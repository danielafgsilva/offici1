import type { Metadata } from "next";
import { Award, Handshake, Building2, Users, ExternalLink } from "lucide-react";
import { Container, SectionHeading } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Parceiros",
  description:
    "Parcerias estratégicas com a OCC, APECA, APC e GRASROC que reforçam o nosso compromisso com a excelência e a qualidade.",
};

const partners = [
  {
    name: "APECA",
    fullName:
      "Associação Portuguesa das Empresas de Contabilidade e Administração",
    description:
      "Membro ativo da APECA, contribuindo para a dignificação e desenvolvimento da profissão de contabilista.",
    website: "https://www.apeca.pt",
  },
  {
    name: "OCC",
    fullName: "Ordem dos Contabilistas Certificados",
    description:
      "Todos os nossos contabilistas são certificados pela OCC, garantindo os mais elevados padrões de competência profissional.",
    website: "https://www.occ.pt",
  },
  {
    name: "APC",
    fullName: "Associação Portuguesa de Contabilidade",
    description:
      "Parceria estratégica que nos mantém na vanguarda das melhores práticas contabilísticas e normativas internacionais.",
    website: "https://www.apotec.pt",
  },
  {
    name: "GRASROC",
    fullName:
      "Gabinete de Relações e Apoio ao Sector Rodoviário e das Oficinas de Contabilidade",
    description:
      "Parceria que reforça o nosso compromisso com a excelência no apoio ao sector empresarial português.",
    website: null,
  },
];

const benefits = [
  {
    icon: Award,
    title: "Certificação e Qualidade",
    description:
      "As nossas parcerias garantem que seguimos as mais rigorosas normas de qualidade e deontologia profissional.",
  },
  {
    icon: Users,
    title: "Formação Contínua",
    description:
      "Acesso privilegiado a programas de formação e atualização profissional das entidades parceiras.",
  },
  {
    icon: Building2,
    title: "Networking",
    description:
      "Integração numa rede nacional de profissionais que partilham conhecimento e melhores práticas.",
  },
  {
    icon: Handshake,
    title: "Compromisso Ético",
    description:
      "Adesão aos códigos deontológicos e de conduta das principais organizações do setor.",
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Parceiros"
        title="Parcerias que reforçam a confiança"
        lead="Associações estratégicas que sustentam o nosso compromisso com a excelência e a inovação."
      />

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Vantagens"
            title="Benefícios das nossas parcerias"
            lead="As nossas associações profissionais garantem que oferecemos sempre o melhor serviço aos nossos clientes."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={(i % 4) * 0.08}>
                <div className="flex flex-col gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
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

      {/* Partner entities */}
      <section className="bg-ink-50/60 py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Entidades"
            title="Orgulhosamente associados"
            lead="Membros das principais organizações do setor em Portugal."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {partners.map((partner, i) => (
              <Reveal key={partner.name} delay={(i % 2) * 0.08}>
                <div className="card-surface flex h-full flex-col rounded-2xl p-8">
                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-ink-800 text-lg font-bold text-white shadow-md">
                      {partner.name.substring(0, 3)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ink-900">
                        {partner.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{partner.fullName}</p>
                    </div>
                  </div>
                  <p className="mt-5 flex-grow leading-relaxed text-muted">
                    {partner.description}
                  </p>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
                    >
                      Visitar website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Commitment */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Handshake className="h-7 w-7" />
            </span>
            <h2 className="mt-6 text-3xl font-bold text-ink-900 md:text-4xl">
              Compromisso com a excelência
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              As nossas parcerias não são apenas certificações — representam o
              nosso compromisso diário em oferecer serviços da mais alta
              qualidade, mantendo-nos sempre atualizados com as últimas
              tendências, tecnologias e regulamentações do setor. É assim que
              garantimos que os nossos clientes têm acesso ao melhor da
              contabilidade e consultoria em Portugal.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
