import Link from "next/link";
import { Marquee } from "@/components/marquee";
import { ServiceIcon } from "@/components/service-icon";
import type { SERVICES_QUERY_RESULT } from "../../../sanity.types";

// What the firm does, drifting sideways on a pale blue ground. Each card is one link; on hover or focus it
// fills with navy and opens to show who the service is for (always open where there is no hover).
export function Services({ services }: { services: SERVICES_QUERY_RESULT }) {
  if (services.length === 0) return null;
  return (
    <section className="bg-[#e6eff7] py-16 lg:py-28">
      <div className="container-page">
        <h2 className="max-w-[18ch] text-h1">Em que podemos ajudar</h2>
      </div>
      <div className="mt-10 lg:mt-14">
        <Marquee
          label="Serviços"
          copies={Math.ceil(5 / services.length)}
          footer={
            <Link href="/servicos" className="btn btn-primary btn-lg">
              Ver todos os serviços
            </Link>
          }
        >
          {services.map((service) => (
            <li key={service._id} className="w-[78vw] shrink-0 sm:w-[21rem] lg:w-[24rem]">
              <Link
                href={`/servicos/${service.slug}`}
                className="panel group relative flex h-full min-h-[24rem] flex-col justify-between overflow-hidden rounded-[2.25rem] bg-white p-7 text-navy shadow-[0_1px_0_rgb(26_54_93/0.04)] lg:min-h-[27rem] lg:p-9"
              >
                <ServiceIcon icon={service.icon} slug={service.slug} className="relative size-14 transition-colors duration-300 group-hover:text-offwhite group-focus-visible:text-offwhite" />
                <span className="relative block transition-colors duration-300 group-hover:text-offwhite group-focus-visible:text-offwhite">
                  <span className="block font-display text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[1.75rem] lg:text-[2rem]">
                    {service.title}
                  </span>
                  <span className="mt-3 block text-ink transition-colors duration-300 group-hover:text-offwhite group-focus-visible:text-offwhite">
                    {service.summary}
                  </span>
                  {service.audience && (
                    <span className="reveal mt-4 block text-sm transition-[opacity,transform] duration-200 ease-(--ease-out)">{service.audience}</span>
                  )}
                  <span className="mt-5 block font-semibold underline underline-offset-4">Saber mais</span>
                </span>
              </Link>
            </li>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
