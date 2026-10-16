import type { Metadata } from "next";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RisingWords } from "@/components/rising-words";
import { ContactCta } from "@/components/contact-cta";
import { Testimonials } from "@/components/testimonials";
import { ServiceIcon } from "@/components/service-icon";
import { ServiceSection } from "@/components/service-section";
import { client, fetchOptions } from "@/sanity/client";
import { SERVICES_PAGE_QUERY, TESTIMONIALS_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";

export const generateMetadata = (): Promise<Metadata> =>
  seoMetadata(null, {
    path: "/servicos",
    title: "Serviços de contabilidade, fiscalidade e salários",
    description:
      "Contabilidade, fiscalidade, processamento salarial, constituição de empresas e apoio à gestão para empresas e empresários, em Vila Nova de Gaia.",
  });

export default async function ServicesPage() {
  const [services, testimonials] = await Promise.all([
    client.fetch(SERVICES_PAGE_QUERY, {}, fetchOptions),
    client.fetch(TESTIMONIALS_QUERY, {}, fetchOptions),
  ]);

  return (
    <>
      {/* The way in: the page's argument on the left, and on the right an index of the five, as a soft panel of rows that jump to each chapter */}
      <section className="container-page page-top pb-14! lg:pb-24!">
        <Breadcrumbs items={[{ label: "Serviços", href: "/servicos" }]} />
        <div className="mt-6 grid gap-x-12 gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <RisingWords text="Em que podemos ajudar a sua empresa" className="max-w-[14em] text-display" />
            <p className="measure mt-6 text-lead">
              Da abertura da empresa às contas de todos os meses, tratamos do que é obrigatório e ajudamos a perceber os
              números.
            </p>
          </div>
          <nav aria-label="Serviços" className="unmask-load rounded-[2.5rem] bg-[#e6eff7] p-3 lg:col-span-5">
            <ul>
              {services.map((service) => (
                <li key={service._id}>
                  <a
                    href={`#${service.slug}`}
                    className="group flex min-h-[4.25rem] items-center gap-4 rounded-[1.75rem] px-4 py-2 font-semibold text-navy transition-colors duration-200 hover:bg-white focus-visible:bg-white"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-navy transition-colors duration-200 group-hover:bg-navy group-hover:text-offwhite group-focus-visible:bg-navy group-focus-visible:text-offwhite">
                      <ServiceIcon icon={service.icon} slug={service.slug} className="size-6" />
                    </span>
                    <span className="flex-1">{service.title}</span>
                    <ArrowDownIcon aria-hidden="true" weight="bold" className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {services.map((service, index) => (
        <ServiceSection key={service._id} service={service} index={index} />
      ))}

      <Testimonials items={testimonials} />

      <ContactCta
        title="Não sabe bem de que serviço precisa?"
        text="É normal. Conte-nos a situação da sua empresa e dizemos-lhe, sem termos técnicos, o que faz sentido no seu caso."
      />
    </>
  );
}
