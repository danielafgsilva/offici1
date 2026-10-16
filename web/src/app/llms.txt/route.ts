import { site, siteUrl } from "@/lib/site";
import { client, fetchOptions } from "@/sanity/client";
import { SERVICES_QUERY } from "@/sanity/queries";
import { getSettings } from "@/sanity/settings";

export const revalidate = 3600;

// A short plain-text guide to the site for AI assistants. Public business information only.
export async function GET() {
  const [services, settings] = await Promise.all([
    client.fetch(SERVICES_QUERY, {}, fetchOptions),
    getSettings(),
  ]);

  const text = `# ${site.name} — Contabilidade e Consultoria

> ${site.legalName} é um gabinete de contabilidade e consultoria em Vila Nova de Gaia, Portugal, fundado em ${site.foundingYear}. Presta serviços a empresas e empresários. O conteúdo oficial está em ${siteUrl}, em português de Portugal.

## Serviços

${services.map((service) => `- [${service.title}](${siteUrl}/servicos/${service.slug}): ${service.summary}`).join("\n")}

## Páginas principais

- [Todos os serviços](${siteUrl}/servicos)
- [Sobre nós](${siteUrl}/sobre-nos)
- [A equipa](${siteUrl}/equipa)
- [Carreiras](${siteUrl}/carreiras)
- [Contactos](${siteUrl}/contactos)

## Contacto

- Telefone: ${settings.phone.label}
- Email: ${settings.email}
- Morada: ${settings.address.join(", ")}
${settings.hours ? `- Horário: ${settings.hours}\n` : ""}`;

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
