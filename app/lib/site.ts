// Central site configuration — shared navigation, company + contact details.

export const navigation = [
  { name: "Início", href: "/" },
  { name: "Sobre Nós", href: "/sobre-nos" },
  { name: "Serviços", href: "/servicos" },
  { name: "Parceiros", href: "/parceiros" },
  { name: "Recrutamento", href: "/recrutamento" },
  { name: "Contactos", href: "/contactos" },
] as const;

export const company = {
  name: "Offici'um",
  legalName: "OFFICI'UM - CONTABILIDADE E CONSULTORIA, LDA",
  nif: "PT 506505340",
  email: "geral@offici1.pt",
  phones: ["+351 223 710 585", "+351 919 636 298"],
  address: {
    line1: "Av. da República Nº 872",
    line2: "1º Andar – Sala 1.3",
    postal: "4430-190 Vila Nova de Gaia",
    country: "Portugal",
  },
  hours: ["Segunda a Sexta: 09:00 – 18:00", "Sábado e Domingo: Encerrado"],
} as const;

export const footerServices = [
  "Contabilidade",
  "Finanças",
  "Gestão e Apoio Fiscal",
  "Abertura de Empresas",
  "Recursos Humanos",
] as const;
