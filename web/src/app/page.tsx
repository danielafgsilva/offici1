import type { Metadata } from "next";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { Careers } from "@/components/home/careers";
import { Clients } from "@/components/clients";
import { OutsideOffice } from "@/components/outside-office";
import { HistoryPanel } from "@/components/home/history";
import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Team } from "@/components/home/team";
import { site, siteUrl } from "@/lib/site";
import { client, fetchOptions } from "@/sanity/client";
import { CLIENTS_QUERY, HISTORY_QUERY, SERVICES_QUERY, TEAM_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";
import { getHomePage, getTeamPhotos, getSettings } from "@/sanity/settings";

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage();
  // No page title here: the homepage keeps the site's default title unless an SEO title is set.
  return seoMetadata(home.seo, { path: "/", description: home.heroText });
}

export default async function Home() {
  const [home, teamPhotos, settings, services, team, history, clients] = await Promise.all([
    getHomePage(),
    getTeamPhotos(),
    getSettings(),
    client.fetch(SERVICES_QUERY, {}, fetchOptions),
    client.fetch(TEAM_QUERY, {}, fetchOptions),
    client.fetch(HISTORY_QUERY, {}, fetchOptions),
    client.fetch(CLIENTS_QUERY, {}, fetchOptions),
  ]);
  const milestone = history[0];

  return (
    <>
      {/* Only verified facts: no ratings, reviews, coordinates or opening hours that could drift from the CMS */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AccountingService",
              "@id": `${siteUrl}/#organizacao`,
              name: site.name,
              legalName: site.legalName,
              url: siteUrl,
              description: settings.seoDescription,
              telephone: settings.phone.href.replace("tel:", ""),
              email: settings.email,
              foundingDate: site.foundingYear,
              vatID: `PT${site.nif.replace(/\s/g, "")}`,
              image: `${siteUrl}/og`,
              logo: `${siteUrl}/logo.svg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address.slice(0, -1).join(", "),
                postalCode: settings.postalCode,
                addressLocality: settings.locality,
                addressCountry: "PT",
              },
              memberOf: [
                {
                  "@type": "Organization",
                  name: "Ordem dos Contabilistas Certificados",
                },
                {
                  "@type": "Organization",
                  name: "APECA — Associação Portuguesa das Empresas de Contabilidade e Administração",
                },
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: site.name,
              inLanguage: "pt-PT",
              publisher: { "@id": `${siteUrl}/#organizacao` },
            },
          ],
        }}
      />

      <Hero title={home.heroTitle} text={home.heroText} />

      <Services services={services} />

      <Clients clients={clients} />

      <HistoryPanel
        since={Number(site.foundingYear)}
        place={settings.locality ?? "Vila Nova de Gaia"}
        title={milestone?.title ?? null}
        text={milestone?.description ?? null}
      />

      <Team team={team} />

      <OutsideOffice photos={teamPhotos} />

      <Careers />

      <ContactCta />
    </>
  );
}
