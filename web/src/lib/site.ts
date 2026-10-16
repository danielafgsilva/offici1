// Fixed business details. Contacts and editable content come from Sanity (see sanity/settings.ts).
// The production address. Set NEXT_PUBLIC_SITE_URL when the final domain is known.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://offici1.pt").replace(/\/$/, "");

export const site = {
  name: "Offici’um",
  legalName: "Offici’um – Contabilidade e Consultoria, Lda.",
  nif: "506 505 340",
  foundingYear: "2004",
};

export const navigation = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre-nos", label: "Sobre nós" },
  { href: "/equipa", label: "Equipa" },
  { href: "/carreiras", label: "Carreiras" },
  { href: "/contactos", label: "Contactos" },
];

// "/servicos/fiscalidade" is inside "/servicos"; "/" is current only on the home page
export const isCurrentPage = (pathname: string, href: string) =>
  pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
