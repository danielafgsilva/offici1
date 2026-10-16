// Shared by the server actions behind the site's forms.
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE = /^[+\d][\d\s().-]{6,19}$/;

// A text field from a submitted form: trimmed and capped, never anything but a string.
export function field(formData: FormData, name: string, max: number) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
