"use server";

import { redirect } from "next/navigation";
import { EMAIL, PHONE, field } from "@/lib/form";
import { checkUpload } from "@/lib/upload";
import { client, fetchOptions } from "@/sanity/client";
import { SERVICES_QUERY } from "@/sanity/queries";
import { getSettings } from "@/sanity/settings";

export type ContactState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<"clientType" | "name" | "email" | "phone" | "message" | "documents" | "consent", string>>;
  // `services` holds the ids ticked, so the form can tick them again
  values?: Record<string, string> & { services?: string };
};

// The options of "Melhor horário para contacto"; anything else is read as no preference
const CLIENT_TYPES: Record<string, string> = { particular: "Particular", empresa: "Empresa" };
// Up to three documents (PDF, JPG or PNG). Together they stay under the 4 MB the server accepts for a form.
const MAX_FILES = 3;
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const MAX_TOTAL_BYTES = 3.5 * 1024 * 1024;

const TIMES: Record<string, string> = { "": "Tanto faz", manha: "De manhã", tarde: "À tarde" };

export async function sendContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field. Bots get the same thank-you page and learn nothing.
  if (formData.get("website")) redirect("/obrigado");

  const values = {
    clientType: field(formData, "clientType", 20),
    name: field(formData, "name", 100),
    company: field(formData, "company", 100),
    email: field(formData, "email", 200),
    phone: field(formData, "phone", 30),
    time: field(formData, "time", 20),
    message: field(formData, "message", 3000),
    consent: formData.get("consent") ? "on" : "",
  };

  // Services are looked up again here: the names in the email never come from the browser
  const catalogue = await client.fetch(SERVICES_QUERY, {}, fetchOptions);
  const ticked = formData.getAll("services").filter((id): id is string => typeof id === "string");
  const services = catalogue.filter((service) => ticked.includes(service._id));

  const errors: ContactState["errors"] = {};
  if (!CLIENT_TYPES[values.clientType]) errors.clientType = "Escolha se é particular ou empresa.";
  if (values.name.length < 2) errors.name = "Indique o seu nome.";
  // One way to reach the person is enough: a phone number or an email
  if (!values.phone && !values.email) errors.phone = "Indique um telefone ou um email para o podermos contactar.";
  if (values.email && !EMAIL.test(values.email)) errors.email = "Indique um email válido, por exemplo nome@empresa.pt.";
  if (values.phone && !PHONE.test(values.phone)) errors.phone = "Verifique o número de telefone.";
  if (values.message.length < 10) errors.message = "Diga-nos em poucas palavras como podemos ajudar.";

  const files = formData.getAll("documents").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const documents: { filename: string; content: string }[] = [];
  if (files.length > MAX_FILES) errors.documents = `Pode anexar até ${MAX_FILES} documentos.`;
  else if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) errors.documents = "Os documentos têm, no total, mais de 3,5 MB. Envie menos ou mais leves.";
  else {
    for (const file of files) {
      const checked = await checkUpload(file, ["pdf", "jpeg", "png"], MAX_FILE_BYTES, {
        type: "Só aceitamos documentos em PDF, JPG ou PNG.",
        name: "O nome de um ficheiro não é aceite. Renomeie-o, por exemplo «Fatura março.pdf».",
      });
      if ("error" in checked) {
        errors.documents = checked.error;
        break;
      }
      // The attachment is named by us: nothing from the uploaded file's own name is kept
      documents.push({ filename: `Documento ${documents.length + 1}.${checked.ext}`, content: checked.bytes.toString("base64") });
    }
  }

  if (!values.consent) errors.consent = "Precisamos da sua autorização para o contactar.";

  if (Object.keys(errors).length > 0) {
    // A browser never lets a page fill in a file field, so documents have to be attached again
    const again = files.length > 0 && !errors.documents ? " Por segurança, o navegador pede que volte a anexar os documentos." : "";
    return {
      status: "error",
      message: `Verifique os campos assinalados.${again}`,
      errors,
      values: { ...values, services: services.map((service) => service._id).join(",") },
    };
  }

  const settings = await getSettings();
  const FALLBACK = `Não foi possível enviar o seu pedido. Por favor, ligue ${settings.phone.label} ou escreva para ${settings.email}.`;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_FROM_EMAIL is not set.");
    return { status: "error", message: FALLBACK, values };
  }

  // Plain text only: nothing the visitor types is ever interpreted as HTML.
  const text = [
    `Tipo de cliente: ${CLIENT_TYPES[values.clientType]}`,
    `Serviços: ${services.map((service) => service.title).join(", ") || "não indicados"}`,
    `Nome: ${values.name}`,
    `Empresa: ${values.clientType === "empresa" ? values.company || "—" : "—"}`,
    `Telefone: ${values.phone || "—"}`,
    `Email: ${values.email || "—"}`,
    `Melhor horário para contacto: ${TIMES[values.time] ?? TIMES[""]}`,
    "",
    values.message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: process.env.CONTACT_TO_EMAIL || settings.email,
        ...(values.email ? { reply_to: values.email } : {}),
        subject: `Pedido de contacto — ${values.name.replace(/[\r\n]+/g, " ")}`,
        text: documents.length ? `${text}\n\n${documents.length} documento(s) em anexo.` : text,
        ...(documents.length ? { attachments: documents } : {}),
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.error("Contact form: Resend responded", response.status, await response.text());
      return { status: "error", message: FALLBACK, values };
    }
  } catch (error) {
    console.error("Contact form: request to Resend failed", error);
    return { status: "error", message: FALLBACK, values };
  }

  // Only reached when Resend accepted the message. redirect() must stay outside the try block.
  redirect("/obrigado");
}
