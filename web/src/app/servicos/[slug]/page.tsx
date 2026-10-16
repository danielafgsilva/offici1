import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactCta } from "@/components/contact-cta";
import { JsonLd } from "@/components/json-ld";
import { RisingWords } from "@/components/rising-words";
import { ServiceWords } from "@/components/service-words";
import { siteUrl } from "@/lib/site";
import { client, fetchOptions } from "@/sanity/client";
import { SERVICE_QUERY, SERVICES_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";

export async function generateStaticParams() {
  const services = await client.fetch(SERVICES_QUERY, {}, fetchOptions);
  return services.map(({ slug }) => ({ slug: slug! }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await client.fetch(SERVICE_QUERY, { slug }, fetchOptions);
  if (!service) return {};
  return seoMetadata(service.seo, {
    path: `/servicos/${slug}`,
    title: service.title,
    description: service.summary,
  });
}

export default async function ServicePage({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const service = await client.fetch(SERVICE_QUERY, { slug }, fetchOptions);
  if (!service) notFound();

  return (
    <>
      <article>
        <header className="container-page page-top pb-10! lg:pb-14!">
          <Breadcrumbs
            items={[
              { label: "Serviços", href: "/servicos" },
              { label: service.title ?? "", href: `/servicos/${slug}` },
            ]}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Service",
              name: service.title,
              description: service.description ?? service.summary,
              serviceType: service.title,
              url: `${siteUrl}/servicos/${slug}`,
              provider: { "@id": `${siteUrl}/#organizacao` },
            }}
          />
          <RisingWords text={service.title} className="mt-4 max-w-[14ch] text-hero" />
          <div className="mt-8 grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-8">
            <p className="text-lead lg:col-span-6">{service.summary}</p>
            <div className="lg:col-span-5 lg:col-start-8 lg:text-right">
              <Link href="/contactos" className="btn btn-primary w-full sm:w-auto">
                Fale connosco sobre este serviço
              </Link>
            </div>
          </div>
        </header>

        {/* What it solves is the persuasive part, so it is set as a statement on the blue surface */}
        {service.problem && (
          <section className="bg-blue text-offwhite">
            <div className="container-page section">
              <h2 className="eyebrow text-offwhite!">O que resolve</h2>
              <p className="mt-4 max-w-[30ch] font-display text-display font-medium">{service.problem}</p>
            </div>
          </section>
        )}

        <section className="container-page section">
          <div className="grid gap-x-8 gap-y-12 lg:grid-cols-12">
            <div className="space-y-10 lg:col-span-5">
              {service.description && (
                <div>
                  <h2 className="font-sans text-h3 font-semibold tracking-normal">O que é</h2>
                  <p className="mt-3">{service.description}</p>
                </div>
              )}
              {service.audience && (
                <div>
                  <h2 className="font-sans text-h3 font-semibold tracking-normal">Para quem</h2>
                  <p className="mt-3">{service.audience}</p>
                </div>
              )}
            </div>

            {service.includes && service.includes.length > 0 && (
              <div className="lg:col-span-6 lg:col-start-7">
                <h2 className="font-sans text-h3 font-semibold tracking-normal">Como apoiamos</h2>
                <ul className="rule mt-4">
                  {service.includes.map((item) => (
                    <li key={item} className="border-b border-line py-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </article>

      {service.related && service.related.length > 0 && (
        <section className="container-page section pt-0!">
          <h2 className="text-h2">Também pode interessar-lhe</h2>
          <div className="mt-8">
            <ServiceWords services={service.related} />
          </div>
        </section>
      )}

      <ContactCta
        title="O próximo passo é uma conversa."
        text="Conte-nos como funciona a sua empresa e o que precisa de resolver. Explicamos como trabalhamos e o que muda para si."
      />
    </>
  );
}
