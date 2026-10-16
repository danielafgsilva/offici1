// Validation for files that visitors attach to a form. Files are only ever emailed: never stored, opened or served by this site.
// ponytail: checks are name, size, declared type, extension, magic bytes and, for PDFs, a plain-byte scan for code-running
// features (compressed streams are not seen). Upgrade to a virus-scanning service if attachments are ever processed.

export const KINDS = {
  pdf: { ext: ["pdf"], mime: "application/pdf", magic: [[0x25, 0x50, 0x44, 0x46, 0x2d]] },
  jpeg: { ext: ["jpg", "jpeg"], mime: "image/jpeg", magic: [[0xff, 0xd8, 0xff]] },
  png: { ext: ["png"], mime: "image/png", magic: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]] },
} as const;

type Kind = keyof typeof KINDS;

const RISKY_NAME = /[\u0000-\u001f\\/:*?"<>|]|\.(exe|js|mjs|html?|php|sh|bat|cmd|scr|jar|vbs|svg|zip|docm?)(\.|$)/i;
const RISKY_PDF = /\/(JavaScript|JS|Launch|EmbeddedFile|OpenAction|RichMedia)\b/;

export type Upload = { bytes: Buffer; ext: string };

export async function checkUpload(
  file: File,
  allowed: Kind[],
  maxBytes: number,
  labels: { type: string; name: string },
): Promise<Upload | { error: string }> {
  if (file.size > maxBytes) return { error: `O ficheiro tem mais de ${Math.round(maxBytes / 1048576)} MB. Envie um mais leve.` };
  if (file.name.length > 150 || RISKY_NAME.test(file.name)) return { error: labels.name };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const kind = allowed.find((key) => (KINDS[key].ext as readonly string[]).includes(ext));
  if (!kind || file.type !== KINDS[kind].mime) return { error: labels.type };
  const bytes = Buffer.from(await file.arrayBuffer());
  const matches = KINDS[kind].magic.some((signature) => signature.every((byte, index) => bytes[index] === byte));
  if (!matches) return { error: labels.type };
  if (kind === "pdf" && RISKY_PDF.test(bytes.toString("latin1"))) {
    return { error: "Este PDF contém elementos que não aceitamos. Exporte-o de novo, em PDF simples." };
  }
  return { bytes, ext: kind === "jpeg" ? "jpg" : ext };
}
