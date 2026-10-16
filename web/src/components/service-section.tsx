import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ArrowButton } from "./arrow-button";
import { ServiceIcon } from "./service-icon";
import type { SERVICES_PAGE_QUERY_RESULT } from "../../sanity.types";

type Service = SERVICES_PAGE_QUERY_RESULT[number];

// One service as a chapter, kept short (the problem, one paragraph, the first four ways of helping; the rest, and who it is for, are on its own page): a full-width band that alternates between pale blue and paper, the title and the
// action held still on one side while the substance scrolls on the other (swapping sides each time). Everything the
// visitor reads sits on a white, generously rounded surface, the same cards as the home page.
export function ServiceSection({ service, index }: { service: Service; index: number }) {
  const flip = index % 2 === 1;

  return (
    <section
      id={service.slug ?? undefined}
      aria-labelledby={`${service.slug}-t`}
      className={`scroll-mt-16 ${flip ? "bg-paper" : "bg-[#e6eff7]"}`}
    >
      <div className="container-page grid gap-x-12 gap-y-8 py-14 lg:grid-cols-12 lg:py-20">
        <div className={`lg:sticky lg:top-28 lg:col-span-5 lg:self-start ${flip ? "lg:order-last lg:col-start-8" : ""}`}>
          <span className="flex size-20 items-center justify-center rounded-full bg-white text-navy shadow-[0_10px_30px_rgb(26_54_93/0.1)]">
            <ServiceIcon icon={service.icon} slug={service.slug} className="size-10" />
          </span>
          <h2 id={`${service.slug}-t`} className="mt-6 text-[clamp(1.75rem,1.3rem+1.1vw,2.25rem)] leading-[1.08]">
            {service.title}
          </h2>
          <p className="measure mt-3 text-lead">{service.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ArrowButton href="/contactos#formulario" label="Falar sobre este serviço" tone="navy" />
            <Link href={`/servicos/${service.slug}`} className="link tap">
              Ver tudo
            </Link>
          </div>
        </div>

        <div className={`space-y-4 lg:col-span-6 ${flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-7"}`}>
          {service.problem && (
            <div className="rounded-[2rem] bg-navy p-7 text-offwhite lg:p-8">
              <h3 className="text-lead font-semibold text-offwhite">O que resolve</h3>
              <p className="mt-3 font-display text-[1.25rem] leading-[1.35] font-semibold tracking-[-0.01em] lg:text-[1.5rem]">
                {service.problem}
              </p>
            </div>
          )}
          {service.description && (
            <div className="rounded-[2rem] bg-white p-7 lg:p-8">
              <p className="text-lead">{service.description}</p>
            </div>
          )}
          {service.includes && service.includes.length > 0 && (
            <div className="rounded-[2rem] bg-white p-7 lg:p-8">
              <h3 className="text-h3">Como apoiamos</h3>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {service.includes.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon aria-hidden="true" weight="bold" className="mt-1 size-5 shrink-0 text-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
