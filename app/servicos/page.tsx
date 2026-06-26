import type { Metadata } from "next";
import {
  Calculator,
  TrendingUp,
  FileText,
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Container, ButtonLink, IconChip } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { PageHero } from "../components/PageHero";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Contabilidade, finanças, gestão fiscal, abertura de empresas, relatórios periódicos e recursos humanos — soluções completas para a sua empresa.",
};

const services = [
  {
    icon: Calculator,
    title: "Contabilidade",
    subtitle: "Financeira, Analítica e Outsourcing",
    description:
      "Gestão contabilística completa e rigorosa para empresas de todos os setores e dimensões.",
    features: [
      "Contabilidade Financeira",
      "Contabilidade Analítica",
      "Outsourcing Contabilístico",
      "Plano de Contas Personalizado",
      "Balancetes e Demonstrações Financeiras",
      "Análise de Rácios Económico-Financeiros",
    ],
  },
  {
    icon: TrendingUp,
    title: "Finanças",
    subtitle: "Gestão Financeira Estratégica",
    description:
      "Planeamento e gestão financeira para otimizar os recursos da sua empresa e maximizar resultados.",
    features: [
      "Planeamento Financeiro",
      "Análise de Investimentos",
      "Gestão de Tesouraria",
      "Controlo Orçamental",
      "Estudos de Viabilidade Económica",
      "Otimização de Cash Flow",
    ],
  },
  {
    icon: FileText,
    title: "Gestão e Apoio Fiscal",
    subtitle: "Consultoria Fiscal Especializada",
    description:
      "Apoio completo em todas as obrigações fiscais, minimizando riscos e otimizando a carga fiscal.",
    features: [
      "Declarações Fiscais (IRS, IRC, IVA)",
      "Planeamento Fiscal",
      "Otimização Fiscal",
      "Apoio em Inspeções Tributárias",
      "Recursos e Reclamações",
      "Assessoria em Benefícios Fiscais",
    ],
  },
  {
    icon: Building2,
    title: "Abertura de Empresas",
    subtitle: "Constituição e Legalização",
    description:
      "Apoio integral na constituição da sua empresa, desde a escolha da estrutura legal até ao início de atividade.",
    features: [
      "Constituição de Sociedades",
      "Alterações Societárias",
      "Registo na Conservatória",
      "Obtenção de NIF e Certidão Permanente",
      "Registo na Segurança Social",
      "Declaração de Início de Atividade",
    ],
  },
  {
    icon: Briefcase,
    title: "Relatórios Periódicos",
    subtitle: "Análises Detalhadas e Regulares",
    description:
      "Relatórios de gestão personalizados para acompanhar o desempenho da sua empresa em tempo real.",
    features: [
      "Relatórios Mensais de Gestão",
      "Análise de Indicadores de Performance (KPIs)",
      "Dashboards Personalizados",
      "Comparação de Períodos",
      "Análise de Desvios Orçamentais",
      "Relatórios de Suporte à Decisão",
    ],
  },
  {
    icon: Users,
    title: "Recursos Humanos",
    subtitle: "Gestão de RH e Processamento Salarial",
    description:
      "Gestão completa de recursos humanos, desde o processamento salarial até à consultoria em legislação laboral.",
    features: [
      "Processamento de Salários",
      "Gestão de Contratos de Trabalho",
      "Declarações à Segurança Social",
      "Gestão de Férias e Faltas",
      "Assessoria em Legislação Laboral",
      "Apoio em Processos de Recrutamento",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title="Soluções completas e personalizadas"
        lead="Acompanhamos todas as necessidades da sua empresa, com rigor técnico e proximidade em cada etapa."
      />

      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-8">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={(i % 2) * 0.05}>
                <article className="card-surface grid gap-8 rounded-3xl p-8 md:grid-cols-2 md:p-10">
                  <div>
                    <IconChip>
                      <service.icon className="h-6 w-6" />
                    </IconChip>
                    <span className="mt-6 block text-sm font-semibold uppercase tracking-wider text-brand-600">
                      0{i + 1}
                    </span>
                    <h2 className="mt-1 text-2xl font-bold text-ink-900 md:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-1 text-lg text-ink-500">{service.subtitle}</p>
                    <p className="mt-4 leading-relaxed text-muted">
                      {service.description}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-ink-50/70 p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-700">
                      O que inclui
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                          <span className="text-sm text-ink-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-ink-50/60 py-20 md:py-24">
        <Container className="text-center">
          <Reveal className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-ink-900 md:text-4xl">
              Precisa de mais informações?
            </h2>
            <p className="mt-5 text-lg text-muted">
              Entre em contacto connosco para discutir as necessidades específicas
              da sua empresa. Estamos aqui para ajudar!
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/contactos" variant="primary">
                Contacte-nos
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
