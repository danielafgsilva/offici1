import type { Metadata } from "next";
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  Heart,
  Users,
  Award,
  ArrowRight,
  Check,
} from "lucide-react";
import { Container, SectionHeading, ButtonLink } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { PageHero } from "../components/PageHero";
import { company } from "../lib/site";

export const metadata: Metadata = {
  title: "Recrutamento",
  description:
    "Junte-se a uma equipa dedicada, inovadora e em constante crescimento. Veja a posição disponível ou envie uma candidatura espontânea.",
};

const benefits = [
  {
    icon: GraduationCap,
    title: "Formação Contínua",
    description:
      "Investimos no desenvolvimento dos nossos colaboradores com formações regulares e especializadas.",
  },
  {
    icon: TrendingUp,
    title: "Crescimento Profissional",
    description:
      "Planos de carreira estruturados com oportunidades reais de progressão e desenvolvimento.",
  },
  {
    icon: Heart,
    title: "Ambiente Acolhedor",
    description:
      "Uma equipa pequena onde cada elemento é valorizado e a proximidade faz a diferença.",
  },
  {
    icon: Award,
    title: "Reconhecimento",
    description:
      "Valorizamos o mérito e a dedicação dos nossos colaboradores com reconhecimento justo.",
  },
];

const values = [
  { title: "Inovação", description: "Estamos sempre na vanguarda das tendências do setor." },
  { title: "Excelência", description: "Compromisso com a qualidade em tudo o que fazemos." },
  { title: "Ética", description: "Integridade e transparência em todas as nossas relações." },
  { title: "Equipa", description: "Trabalho em equipa e apoio mútuo são fundamentais." },
];

const requirements = [
  "Licenciatura em Contabilidade ou áreas afins",
  "Forte motivação para aprender",
  "Bons conhecimentos de Excel",
  "Disponibilidade imediata",
];

const offers = [
  "Formação prática e teórica contínua",
  "Acompanhamento personalizado por profissionais certificados",
  "Ambiente de trabalho dinâmico e acolhedor",
  "Possibilidade de integração futura na equipa",
];

export default function RecruitmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Recrutamento"
        title="Junte-se à nossa equipa"
        lead="Faça parte de uma equipa dedicada, inovadora e em constante crescimento."
      />

      {/* Why join + values */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Porquê nós"
                title="Porquê trabalhar connosco?"
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                <p>
                  Na {company.name}, valorizamos cada membro da nossa equipa. Com
                  mais de 20 anos de experiência, oferecemos um ambiente de
                  trabalho estimulante onde o crescimento profissional e pessoal
                  são prioridades.
                </p>
                <p>
                  Investimos continuamente em formação e mantemo-nos sempre
                  atualizados com as últimas tendências do setor. Se procura um
                  lugar onde possa desenvolver a sua carreira num ambiente
                  profissional e acolhedor, este é o sítio certo.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-ink-900">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted">{value.description}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="bg-ink-50/60 py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Vantagens"
            title="Benefícios e vantagens"
            lead="Oferecemos um pacote competitivo de benefícios aos nossos colaboradores."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={(i % 4) * 0.08}>
                <div className="card-surface flex h-full flex-col gap-4 rounded-2xl p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <benefit.icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-ink-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Open position */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Oportunidade"
            title="Posição disponível"
            lead="Explore a nossa oportunidade de carreira atual."
          />
          <Reveal className="mt-12">
            <div className="card-surface overflow-hidden rounded-3xl">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 bg-ink-50/50 p-8">
                <div>
                  <h3 className="text-2xl font-bold text-ink-900">
                    Estagiário de Contabilidade
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-800">
                    <Briefcase className="h-4 w-4" />
                    Estágio Profissional
                  </span>
                </div>
                <ButtonLink href="/candidatar" variant="primary">
                  Candidatar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
              </div>

              <div className="p-8">
                <p className="leading-relaxed text-muted">
                  Programa de estágio para recém-licenciados que queiram iniciar
                  carreira na contabilidade. Uma oportunidade única de aprender
                  com profissionais experientes e desenvolver competências
                  essenciais num ambiente de trabalho estimulante.
                </p>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 font-semibold text-ink-900">Requisitos</h4>
                    <ul className="space-y-3">
                      {requirements.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                          <span className="text-sm text-ink-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold text-ink-900">Oferecemos</h4>
                    <ul className="space-y-3">
                      {offers.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                          <span className="text-sm text-ink-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Spontaneous application */}
      <section className="pb-20 md:pb-28">
        <Container>
          <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-800 px-6 py-16 text-center shadow-2xl shadow-ink-900/20 md:px-16">
            <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(50%_80%_at_50%_0%,rgba(44,188,255,0.3),transparent_60%)]" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Users className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">
                Candidatura espontânea
              </h2>
              <p className="mt-5 text-lg text-brand-100/90">
                Não encontrou a posição ideal mas acredita que pode contribuir
                para a nossa equipa? Envie-nos a sua candidatura espontânea!
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="/candidatar"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 shadow-lg transition-all hover:bg-brand-50 active:scale-[0.98]"
                >
                  Enviar Candidatura
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
              <p className="mt-6 text-sm text-brand-100/70">
                Ou envie o seu CV diretamente para:{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="font-medium text-white underline-offset-4 hover:underline"
                >
                  {company.email}
                </a>
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
