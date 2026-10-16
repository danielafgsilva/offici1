import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactCta } from "@/components/contact-cta";
import { Clients } from "@/components/clients";
import { Timeline } from "@/components/timeline";
import { Principles } from "@/components/principles";
import { RisingWords } from "@/components/rising-words";
import { site } from "@/lib/site";
import { client, fetchOptions } from "@/sanity/client";
import { CLIENTS_QUERY, HISTORY_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";
import { getAboutPage, getSettings } from "@/sanity/settings";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return seoMetadata(about.seo, {
    path: "/sobre-nos",
    title: "Sobre nós: a história do gabinete de contabilidade",
    description: about.intro?.split("\n")[0],
  });
}

export default async function AboutPage() {
  const [about, settings, history, clients] = await Promise.all([
    getAboutPage(),
    getSettings(),
    client.fetch(HISTORY_QUERY, {}, fetchOptions),
    client.fetch(CLIENTS_QUERY, {}, fetchOptions),
  ]);
  const paragraphs = (about.intro ?? "").split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      {/* The way in, kept simple: the statement and the introduction, top-aligned */}
      <section className="container-page page-top pb-10! lg:pb-16!">
        <Breadcrumbs items={[{ label: "Sobre nós", href: "/sobre-nos" }]} />
        <div className="mt-6 grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-start">
          <RisingWords text={about.title} className="max-w-[14em] text-display lg:col-span-7" />
          {/* Top-aligned with the headline: the first line of text sits level with the first line of the title */}
          <div className="space-y-4 lg:col-span-5 lg:pt-3">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href="/equipa" className="link tap">
              Conheça a equipa
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="historia" className="pb-10 lg:pb-0">
        <h2 id="historia" className="container-page pt-12 text-center text-display lg:pt-24">
          A nossa história
        </h2>
        <Timeline
          items={[
            ...history.map((milestone) => ({
              id: milestone._id,
              year: milestone.year ?? "",
              kind: milestone.kind,
              title: milestone.title,
              text: milestone.description,
              example: !milestone.verified,
            })),
            {
              id: "hoje",
              year: "Hoje",
              title: `Em ${settings.locality ?? "Vila Nova de Gaia"} desde ${site.foundingYear}.`,
              text: `Fica na ${settings.address.join(", ")}. Somos membros da OCC, da APECA, da APC e do GRASROC.`,
              link: { href: "/contactos", label: "Ver contactos e horário" },
            },
          ]}
        />
      </section>

      {/* How the story ends: what changed, and what did not. Each line is a subject and its verdict. */}
      {about.continuity && about.continuity.length > 0 && (
        <section className="bg-blue text-offwhite">
          <div className="container-page section">
            <h2 className="text-h3 text-offwhite">O que mudou e o que ficou</h2>
            <dl className="mt-8 lg:mt-12">
              {about.continuity.map((item) => (
                <div
                  key={item._key}
                  className="grid gap-x-8 gap-y-1 border-t border-offwhite/40 py-6 lg:grid-cols-12 lg:items-baseline lg:py-8"
                >
                  <dt className="lg:col-span-4">{item.subject}</dt>
                  <dd className="font-display text-display font-medium text-offwhite lg:col-span-8">{item.statement}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {about.principles && about.principles.length > 0 && (
        <section className="bg-sand">
          <div className="container-page section">
            <h2 className="text-display">O que pode esperar de nós</h2>
            <div className="mt-10 lg:mt-14">
              <Principles items={about.principles} />
            </div>
          </div>
        </section>
      )}

      <Clients clients={clients} />

      <ContactCta />
    </>
  );
}
