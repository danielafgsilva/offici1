"use server";

import { EMAIL, PHONE, field } from "@/lib/form";
import { checkUpload } from "@/lib/upload";
import { client, fetchOptions } from "@/sanity/client";
import { OPEN_JOBS_QUERY } from "@/sanity/queries";
import { getSettings } from "@/sanity/settings";

export type ApplicationState = {
  status: "idle" | "error" | "sent";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "phone" | "vaga" | "message" | "cv" | "consent", string>>;
  values?: Record<string, string>;
};

const SPONTANEOUS = "espontanea";
const MAX_CV_BYTES = 3 * 1024 * 1024;

async function readCv(value: FormDataEntryValue | null): Promise<{ bytes: Buffer } | { error: string }> {
  if (!(value instanceof File) || value.size === 0) return { error: "Anexe o seu currículo em PDF." };
  return checkUpload(value, ["pdf"], MAX_CV_BYTES, {
    type: "O currículo tem de ser um ficheiro PDF.",
    name: "O nome do ficheiro não é aceite. Renomeie-o, por exemplo «CV Nome Apelido.pdf».",
  });
}

export async function sendApplication(_previous: ApplicationState, formData: FormData): Promise<ApplicationState> {
  // Honeypot: real visitors never see or fill this field. Bots get the same confirmation and learn nothing.
  if (formData.get("website")) return { status: "sent" };

  const values = {
    name: field(formData, "name", 100),
    email: field(formData, "email", 200),
    phone: field(formData, "phone", 30),
    vaga: field(formData, "vaga", 100),
    message: field(formData, "message", 2000),
    consent: formData.get("consent") ? "on" : "",
  };

  // The vacancy is looked up again here: the title in the email never comes from the browser
  const jobs = await client.fetch(OPEN_JOBS_QUERY, {}, fetchOptions);
  const vacancy =
    values.vaga === SPONTANEOUS ? "Candidatura espontânea" : jobs.find((job) => job._id === values.vaga)?.title;

  const errors: ApplicationState["errors"] = {};
  if (values.name.length < 2) errors.name = "Indique o seu nome.";
  if (!EMAIL.test(values.email)) errors.email = "Indique um email válido, por exemplo nome@exemplo.pt.";
  if (values.phone && !PHONE.test(values.phone)) errors.phone = "Verifique o número de telefone.";
  if (!vacancy) errors.vaga = "Esta vaga já não está aberta. Escolha outra ou envie uma candidatura espontânea.";
  if (!values.consent) errors.consent = "Precisamos da sua autorização para tratar a candidatura.";
  const cv = await readCv(formData.get("cv"));
  if ("error" in cv) errors.cv = cv.error;

  if (Object.keys(errors).length > 0 || "error" in cv) {
    // A browser never lets a page fill in a file field, so the CV has to be attached again
    const again = errors.cv ? "" : " Por segurança, o navegador pede que volte a anexar o currículo.";
    return { status: "error", message: `Verifique os campos assinalados.${again}`, errors, values };
  }

  const settings = await getSettings();
  const FALLBACK = `Não foi possível enviar a sua candidatura. Por favor, envie o currículo para ${settings.email}.`;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Careers form: RESEND_API_KEY or CONTACT_FROM_EMAIL is not set.");
    return { status: "error", message: FALLBACK, values };
  }

  const oneLine = (text: string) => text.replace(/[\r\n]+/g, " ");
  // The attachment is named by us: nothing from the uploaded file's own name is kept
  const safeName = values.name
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9 -]/g, "")
    .trim()
    .slice(0, 60);

  // Plain text only: nothing the candidate types is ever interpreted as HTML.
  const text = [
    `Vaga: ${vacancy}`,
    `Nome: ${values.name}`,
    `Email: ${values.email}`,
    `Telefone: ${values.phone || "—"}`,
    "",
    values.message || "(sem mensagem)",
    "",
    "O currículo segue em anexo. O candidato autorizou o tratamento dos dados para este processo de recrutamento.",
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: process.env.CAREERS_TO_EMAIL || process.env.CONTACT_TO_EMAIL || settings.email,
        reply_to: values.email,
        subject: `Candidatura — ${oneLine(vacancy!)} — ${oneLine(values.name)}`,
        text,
        attachments: [{ filename: `CV - ${safeName || "candidato"}.pdf`, content: cv.bytes.toString("base64") }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.error("Careers form: Resend responded", response.status, await response.text());
      return { status: "error", message: FALLBACK, values };
    }
  } catch (error) {
    console.error("Careers form: request to Resend failed", error);
    return { status: "error", message: FALLBACK, values };
  }

  // Only reached when Resend accepted the message
  return { status: "sent" };
}
