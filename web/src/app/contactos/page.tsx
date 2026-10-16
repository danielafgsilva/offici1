import type { Metadata } from "next";
import { ArrowButton } from "@/components/arrow-button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ConsentMap } from "@/components/consent";
import { RisingWords } from "@/components/rising-words";
import { client, fetchOptions } from "@/sanity/client";
import { FAQ_QUERY, SERVICES_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";
import { getSettings } from "@/sanity/settings";
import { ContactForm } from "./contact-form";

export const generateMetadata = (): Promise<Metadata> =>
  seoMetadata(null, {
    path: "/contactos",
    title: "Contactos do gabinete de contabilidade em Vila Nova de Gaia",
    description:
      "Fale com a Offici'um: telefone, email, morada em Vila Nova de Gaia e formulário para pedir um contacto ou marcar uma reunião.",
  });

export default async function ContactPage() {
  const [settings, faqs, services] = await Promise.all([
    getSettings(),
    client.fetch(FAQ_QUERY, {}, fetchOptions),
    client.fetch(SERVICES_QUERY, {}, fetchOptions),
  ]);

  return (
    <>
      {/* The way in across the full width: the statement, the introduction and the way to the form */}
      <section className="container-page page-top pb-10! lg:pb-16!">
        <Breadcrumbs items={[{ label: "Contactos", href: "/contactos" }]} />
        <RisingWords text="Há sempre alguém desse lado." className="mt-6 text-[clamp(3rem,1rem+8vw,9rem)] leading-[0.98] font-semibold text-navy" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <p className="max-w-none text-lead">
            Ligue-nos, escreva-nos ou peça que o contactemos. Dizemos-lhe como podemos ajudar e, se fizer sentido, marcamos uma reunião.
          </p>
          <ArrowButton href="#formulario" label="Pedir contacto" tone="navy" />
        </div>
      </section>

      {/* Where and how to reach us, with the door to look for; the map beside it, kept in view while the left side is read */}
      <section className="container-page pb-16 lg:pb-28">
        <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <div className="rounded-[1.75rem] bg-[#e6eff7] p-6 lg:col-span-6 lg:p-8">
            <p className="text-sm text-muted">Telefone</p>
            <p className="mt-1 flex flex-col">
              <a href={settings.phone.href} className="tap figures font-display text-[clamp(1.5rem,1.1rem+1.2vw,2.125rem)] leading-[1.05] font-semibold tracking-[-0.025em] whitespace-nowrap text-navy decoration-2 underline-offset-[0.12em] hover:underline">
                {settings.phone.label}
              </a>
              {settings.mobile && (
                <a href={settings.mobile.href} className="tap figures font-display text-[clamp(1.5rem,1.1rem+1.2vw,2.125rem)] leading-[1.05] font-semibold tracking-[-0.025em] whitespace-nowrap text-navy decoration-2 underline-offset-[0.12em] hover:underline">
                  {settings.mobile.label}
                </a>
              )}
            </p>
            {settings.hours && <p className="mt-2 text-sm">{settings.hours}</p>}
            <p className="mt-6 text-sm text-muted">Email</p>
            <a href={`mailto:${settings.email}`} className="link tap font-display text-xl font-semibold [overflow-wrap:anywhere]">
              {settings.email}
            </a>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-start">
            {/* The map loads only once the visitor has accepted Google's cookies; the written address is above */}
            <ConsentMap query={settings.mapQuery} mapsUrl={settings.mapsUrl} shape="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <section id="formulario" className="scroll-mt-16 bg-[#e6eff7]">
        <div className="container-page section grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-display">Prefere que liguemos nós?</h2>
            <p className="mt-6 text-lead">
              Diga-nos quem é e do que precisa. Ligamos ou escrevemos nós, e marcamos uma reunião se fizer sentido.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <ContactForm services={services.map(({ _id, title }) => ({ _id, title }))} />
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="container-page section">
          <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <h2 className="text-h1 lg:col-span-4">Perguntas frequentes</h2>
            <div className="space-y-3 lg:col-span-8">
              {faqs.map((faq) => (
                <details key={faq._id} className="group rounded-[1.5rem] bg-white px-6 open:pb-6">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl font-semibold text-navy lg:text-2xl [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e6eff7] font-sans text-xl font-normal text-navy transition-transform duration-(--duration-fast) group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="measure">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
