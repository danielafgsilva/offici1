// "Cláudio" → "claudio": the anchor a team member can be linked to (/equipa#claudio)
export const personId = (name: string | null) =>
  (name ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
