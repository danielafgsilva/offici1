"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Building2,
  Star,
  CheckCircle2,
  Cake,
  UtensilsCrossed,
  PartyPopper,
  Coffee,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Container, SectionHeading } from "../components/ui";
import { Reveal } from "../components/Reveal";
import { PageHero } from "../components/PageHero";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  bio: string[];
  experience: string;
  education: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "Dr. João Silva",
    role: "Diretor Geral e Contabilista Certificado",
    description: "Mais de 20 anos de experiência em contabilidade e gestão fiscal.",
    bio: [
      "Fundador e Diretor Geral da Offici'um desde 2004",
      "Especialista em contabilidade empresarial e planeamento fiscal",
      "Formador certificado em áreas de contabilidade e fiscalidade",
    ],
    experience: "20+ anos em Contabilidade e Consultoria",
    education: "Licenciatura em Contabilidade e Auditoria | Certificação OCC",
    image:
      "https://images.unsplash.com/photo-1738750908048-14200459c3c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Dra. Maria Santos",
    role: "Responsável de Recursos Humanos",
    description: "Especialista em gestão de RH e processamento salarial.",
    bio: [
      "Coordenadora do departamento de Recursos Humanos",
      "Especialista em legislação laboral e processamento de salários",
      "Consultora em gestão de talento e desenvolvimento organizacional",
    ],
    experience: "15+ anos em Recursos Humanos",
    education:
      "Licenciatura em Gestão de Recursos Humanos | Pós-graduação em Direito do Trabalho",
    image:
      "https://images.unsplash.com/photo-1676694047708-1ca814f7e220?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Dr. Pedro Costa",
    role: "Consultor Fiscal e Financeiro",
    description:
      "Especializado em planeamento fiscal e gestão financeira estratégica.",
    bio: [
      "Consultor sénior em fiscalidade e finanças empresariais",
      "Especialista em otimização fiscal e planeamento tributário",
      "Experiência em consultoria para empresas de diversos setores",
    ],
    experience: "12+ anos em Consultoria Fiscal",
    education: "Licenciatura em Gestão | Mestrado em Fiscalidade",
    image:
      "https://images.unsplash.com/photo-1623880840102-7df0a9f3545b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Dra. Ana Oliveira",
    role: "Contabilista e Analista Financeira",
    description: "Especialista em contabilidade analítica e relatórios de gestão.",
    bio: [
      "Contabilista certificada com foco em análise financeira",
      "Responsável pela elaboração de relatórios de gestão e KPIs",
      "Especialista em contabilidade analítica e controlo orçamental",
    ],
    experience: "10+ anos em Contabilidade",
    education: "Licenciatura em Contabilidade | Certificação OCC",
    image:
      "https://images.unsplash.com/photo-1650784854430-3ab0c30afdf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const testimonials = [
  {
    name: "Carlos Mendes",
    company: "TechStart Solutions",
    text: "A Offici'um tem sido um parceiro fundamental no crescimento da nossa empresa. O apoio na gestão fiscal e financeira é impecável.",
  },
  {
    name: "Sofia Rodrigues",
    company: "Restaurante Sabor & Tradição",
    text: "Profissionais de excelência! Sempre disponíveis e com soluções práticas para todos os nossos desafios contabilísticos.",
  },
  {
    name: "Manuel Pereira",
    company: "Construções Pereira & Filhos",
    text: "Trabalho com a Offici'um há mais de 10 anos. A confiança e competência desta equipa são incomparáveis.",
  },
  {
    name: "Rita Almeida",
    company: "Clínica DentalCare",
    text: "Excelente acompanhamento e profissionalismo. Simplificaram toda a gestão contabilística da nossa clínica.",
  },
  {
    name: "José Carvalho",
    company: "AutoPeças Premium",
    text: "Serviço de primeira qualidade. A Offici'um é mais que um gabinete de contabilidade, são verdadeiros parceiros de negócio.",
  },
  {
    name: "Mariana Sousa",
    company: "Boutique Estilo & Charme",
    text: "Equipa profissional, atenciosa e sempre disponível. Recomendo vivamente os seus serviços!",
  },
];

const clients = [
  "Empresas de Construção Civil",
  "Restauração e Hotelaria",
  "Comércio Retalhista",
  "Serviços de Consultoria",
  "Tecnologia e Startups",
  "Indústria Transformadora",
  "Serviços Profissionais",
  "Associações e IPSS",
];

const teamBuilding = [
  {
    icon: PartyPopper,
    title: "Escape Rooms",
    description: "Desafios de equipa que fortalecem a colaboração e comunicação.",
  },
  {
    icon: UtensilsCrossed,
    title: "Jantares de Equipa",
    description: "Momentos de convívio e partilha num ambiente descontraído.",
  },
  {
    icon: Cake,
    title: "Celebração de Aniversários",
    description: "Todos os aniversários são celebrados com a equipa.",
  },
  {
    icon: Coffee,
    title: "Almoços de Empresa",
    description: "Almoços regulares para fortalecer o espírito de equipa.",
  },
];

const gallery = [
  {
    url: "https://images.unsplash.com/photo-1758520144587-3ac9072573c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Atividades de Equipa",
  },
  {
    url: "https://images.unsplash.com/photo-1768508950434-fc76c9f3ed9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Jantares de Equipa",
  },
  {
    url: "https://images.unsplash.com/photo-1758520144658-c87be518b87e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Celebrações",
  },
  {
    url: "https://images.unsplash.com/photo-1740645580344-bad6f745d09f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Almoços de Empresa",
  },
];

export function AboutView() {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(testimonials.length / 3);

  const visible = testimonials.slice(page * 3, page * 3 + 3);
  const next = () => setPage((p) => (p + 1) % pages);
  const prev = () => setPage((p) => (p - 1 + pages) % pages);

  // Close modal on Escape; lock body scroll while open.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <PageHero
        eyebrow="Sobre Nós"
        title="A confiança que se constrói há mais de 20 anos"
        lead="Conheça a história, os valores e a equipa que fazem da Offici'um uma referência em contabilidade e consultoria."
      />

      {/* Who we are */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading eyebrow="Quem somos" title="Uma equipa portuguesa, dedicada ao seu sucesso" />
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
                <p>
                  A <strong className="text-ink-800">Offici&apos;um — Contabilidade
                  e Consultoria, Lda.</strong> é uma empresa portuguesa com mais
                  de 20 anos de experiência no mercado, dedicada a prestar
                  serviços de contabilidade, gestão fiscal e consultoria
                  empresarial de excelência.
                </p>
                <p>
                  Fundada em 2004, a nossa missão é acompanhar o crescimento e
                  sucesso dos nossos clientes, oferecendo soluções personalizadas
                  e um serviço de proximidade que nos distingue no mercado.
                </p>
                <p>
                  Estamos sempre atualizados com as últimas tendências e
                  regulamentações, investindo continuamente em formação
                  profissional para garantir as melhores práticas do setor.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-ink-100 shadow-xl shadow-ink-900/10">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1622131815452-cc00d8d89f02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt="Escritório da Offici'um"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-ink-50/60 py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="A equipa"
            title="Profissionais dedicados ao seu serviço"
            lead="Clique em cada elemento para conhecer o seu percurso."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={(i % 4) * 0.08}>
                <button
                  onClick={() => setSelected(member)}
                  className="card-surface group block h-full w-full overflow-hidden rounded-2xl text-left"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-ink-900">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-brand-700">{member.role}</p>
                    <p className="mt-3 text-sm text-muted">{member.description}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-brand-700">
                      Ver currículo →
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Team member modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
          >
            <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-ink-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink-900">
                      {selected.name}
                    </h3>
                    <p className="font-medium text-brand-700">{selected.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6 p-6">
                <div>
                  <h4 className="mb-3 font-semibold text-ink-900">Sobre</h4>
                  <ul className="space-y-2">
                    {selected.bio.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-muted">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-ink-900">Experiência</h4>
                  <p className="text-muted">{selected.experience}</p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-ink-900">Formação</h4>
                  <p className="text-muted">{selected.education}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Culture / team building */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Cultura"
            title="Valorizamos o espírito de equipa"
            lead="Momentos de partilha e atividades que fortalecem a nossa equipa."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamBuilding.map((activity, i) => (
              <Reveal key={activity.title} delay={(i % 4) * 0.08}>
                <div className="card-surface flex h-full flex-col gap-4 rounded-2xl p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <activity.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-semibold text-ink-900">{activity.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {activity.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="mb-6 text-2xl font-bold text-ink-900">
              Galeria de momentos
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((image, i) => (
                <Reveal key={image.title} delay={(i % 4) * 0.06}>
                  <div className="group relative aspect-square overflow-hidden rounded-2xl border border-ink-100">
                    <Image
                      src={image.url}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {image.title}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Clients */}
      <section className="bg-ink-50/60 py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Clientes"
            title="Servimos empresas de diversos setores"
            lead="Com a mesma dedicação e excelência, qualquer que seja a dimensão."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clients.map((client, i) => (
              <Reveal key={client} delay={(i % 4) * 0.05}>
                <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                  <Building2 className="h-6 w-6 flex-shrink-0 text-brand-600" />
                  <p className="text-sm font-medium text-ink-800">{client}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Testemunhos"
            title="O que dizem os nossos clientes"
          />
          <div className="mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 md:grid-cols-3"
              >
                {visible.map((t) => (
                  <figure
                    key={t.name}
                    className="card-surface flex h-full flex-col rounded-2xl p-7"
                  >
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-5 w-5 fill-gold-400 text-gold-400"
                        />
                      ))}
                    </div>
                    <blockquote className="flex-grow italic leading-relaxed text-muted">
                      “{t.text}”
                    </blockquote>
                    <figcaption className="mt-5">
                      <p className="font-semibold text-ink-900">{t.name}</p>
                      <p className="text-sm text-muted">{t.company}</p>
                    </figcaption>
                  </figure>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition-all hover:border-brand-400 hover:text-brand-700"
                aria-label="Testemunho anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === page ? "w-8 bg-brand-500" : "w-2 bg-ink-200"
                    }`}
                    aria-label={`Ir para página ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition-all hover:border-brand-400 hover:text-brand-700"
                aria-label="Próximo testemunho"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
