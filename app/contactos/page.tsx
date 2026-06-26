import type { Metadata } from "next";
import { ContactView } from "./ContactView";

export const metadata: Metadata = {
  title: "Contactos",
  description:
    "Entre em contacto com a Offici'um. Av. da República 872, Vila Nova de Gaia. Telefone, email e formulário de contacto.",
};

export default function ContactPage() {
  return <ContactView />;
}
