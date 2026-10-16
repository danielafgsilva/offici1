import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowButton } from "@/components/arrow-button";
import { Principles } from "@/components/principles";
import { RisingWords } from "@/components/rising-words";
import { client, fetchOptions } from "@/sanity/client";
import { OPEN_JOBS_QUERY, TEAM_COUNT_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";
import { ApplicationForm } from "./application-form";

export const generateMetadata = (): Promise<Metadata> =>
  seoMetadata(null, {
    path: "/carreiras",
    title: "Carreiras em contabilidade: trabalhar connosco",
    description:
      "Trabalhar na Offici'um, gabinete de contabilidade em Vila Nova de Gaia: a equipa, as vagas em aberto e como enviar uma candidatura espontânea.",
  });

const longDate = new Intl.DateTimeFormat("pt-PT", { dateStyle: "long", timeZone: "Europe/Lisbon" });

export default async function CareersPage() {
  const [jobs, teamSize] = await Promise.all([
    client.fetch(OPEN_JOBS_QUERY, {}, fetchOptions),
    client.fetch(TEAM_COUNT_QUERY, {}, fetchOptions),
  ]);
  return (
    <>
      {/* The way in across the full width: the statement, one line of introduction and the action */}
      <section className="container-page page-top pb-12! lg:pb-20!">
        <Breadcrumbs items={[{ label: "Carreiras", href: "/carreiras" }]} />
        <RisingWords text="Trabalhe connosco" className="mt-6 text-[clamp(3rem,1rem+8vw,9rem)] leading-[0.98] font-semibold text-navy" />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <p className="max-w-none text-lead">
            Somos uma equipa pequena, em Vila Nova de Gaia. Quando abrimos uma vaga, publicamo-la nesta página.
          </p>
          <ArrowButton href="#candidatura" label="Enviar candidatura" tone="navy" />
        </div>
      </section>

      {/* Why work here: only what the rest of the site can show to be true */}
      <section className="container-page pb-16 lg:pb-28">
        <h2 className="text-display">Como é trabalhar aqui</h2>
        <div className="mt-10 lg:mt-14">
          <Principles
            items={[
              {
                _key: "equipa",
                title: "Uma equipa pequena",
                text: `Somos ${teamSize} pessoas, num gabinete em Vila Nova de Gaia. Aqui toda a gente se conhece pelo nome.`,
              },
              {
                _key: "clientes",
                title: "Contacto direto com os clientes",
                text: "Quem trata dos assuntos de uma empresa é quem fala com ela. Não há intermediários entre si e o cliente.",
              },
              {
                _key: "fora",
                title: "Também fora do gabinete",
                text: "Almoçamos juntos e, de vez em quando, saímos para um escape room.",
              },
            ]}
          />
        </div>
      </section>

      {/* One card per open vacancy, and always one for a spontaneous application */}
      <section aria-labelledby="vagas" className="container-page pb-16 lg:pb-28">
        <h2 id="vagas" className="text-display">
          Vagas em aberto
        </h2>
        {jobs.length === 0 && (
          <p className="mt-6 text-lead">Neste momento não temos vagas em aberto. Pode sempre enviar-nos uma candidatura espontânea.</p>
        )}
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <li key={job._id}>
              <Link href={`/carreiras/${job.slug}`} className="panel group relative flex h-full min-h-[18rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-7 text-navy">
                <span className="relative block">
                  <span className="block font-display text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.025em] text-navy">{job.title}</span>
                  {job.summary && <span className="mt-3 block">{job.summary}</span>}
                </span>
                <span className="relative block">
                  <span className="block text-sm text-muted">
                    {[job.contractType, job.location, job.workModel].filter(Boolean).join(", ")}
                    {job.closingDate && ` Candidaturas até ${longDate.format(new Date(`${job.closingDate}T12:00:00Z`))}.`}
                  </span>
                  <span className="mt-4 block font-semibold text-navy underline underline-offset-4">Ver vaga e candidatar-me</span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#candidatura"
              data-vaga="espontanea"
              className="group relative flex h-full min-h-[18rem] flex-col justify-between rounded-[2rem] bg-navy p-7 text-offwhite"
            >
              <span className="block font-display text-[1.75rem] leading-[1.05] font-semibold tracking-[-0.025em]">Candidatura espontânea</span>
              <span className="block">
                <span className="block">Não vê a vaga certa? Conte-nos quem é e o que sabe fazer. Guardamos o contacto para quando abrir uma vaga.</span>
                <span className="mt-4 block font-semibold underline underline-offset-4">Enviar candidatura</span>
              </span>
            </a>
          </li>
        </ul>
      </section>

      {/* Always here, with or without open vacancies */}
      <section id="candidatura" className="scroll-mt-16 bg-[#e6eff7]">
        <div className="container-page section grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-display">Envie a sua candidatura</h2>
            <p className="mt-6 text-lead">
              Para uma vaga em aberto ou como candidatura espontânea: diga-nos quem é e junte o seu currículo.
            </p>
            <p className="mt-4 text-sm text-muted">O currículo segue por email para o gabinete e não fica guardado neste site.</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 sm:p-10 lg:col-span-7 lg:col-start-6">
            <ApplicationForm jobs={jobs.map(({ _id, title }) => ({ _id, title }))} />
          </div>
        </div>
      </section>
    </>
  );
}
