"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Building2,
  Users,
  Calculator,
  Briefcase,
  ArrowDown,
} from "lucide-react";
import { Container, Eyebrow } from "./components/ui";
import { Reveal } from "./components/Reveal";
import { CountUp } from "./components/CountUp";
import { TextReveal, Marquee, Magnetic } from "./components/motion";

const services = [
  {
    icon: Calculator,
    title: "Contabilidade",
    desc: "Financeira, Analítica e Outsourcing",
    gradient: "from-brand-500 to-ink-800",
  },
  {
    icon: TrendingUp,
    title: "Finanças",
    desc: "Gestão financeira estratégica",
    gradient: "from-ink-700 to-brand-600",
  },
  {
    icon: FileText,
    title: "Gestão e Apoio Fiscal",
    desc: "Consultoria fiscal especializada",
    gradient: "from-brand-600 to-brand-900",
  },
  {
    icon: Building2,
    title: "Abertura de Empresas",
    desc: "Constituição e legalização",
    gradient: "from-ink-800 to-brand-500",
  },
  {
    icon: Users,
    title: "Recursos Humanos",
    desc: "Gestão de RH e salários",
    gradient: "from-brand-500 to-brand-800",
  },
  {
    icon: Briefcase,
    title: "Relatórios Periódicos",
    desc: "Análises detalhadas e regulares",
    gradient: "from-ink-900 to-brand-700",
  },
];

const stats = [
  { number: 20, suffix: "+", label: "Anos de experiência" },
  { number: 500, suffix: "+", label: "Clientes satisfeitos" },
  { number: 4, suffix: "", label: "Especialistas dedicados" },
  { number: 100, suffix: "%", label: "Compromisso" },
];

const approach = [
  {
    title: "Excelência",
    text: "Rigor e qualidade em cada serviço — sem exceções.",
  },
  {
    title: "Proximidade",
    text: "Uma relação próxima e personalizada com cada cliente.",
  },
  {
    title: "Formação Contínua",
    text: "Sempre atualizados com as últimas regulamentações.",
  },
  {
    title: "Inovação",
    text: "As melhores práticas e tecnologias do mercado.",
  },
];

const marqueeItems = [
  "Contabilidade",
  "Fiscalidade",
  "Consultoria",
  "Finanças",
  "Recursos Humanos",
  "Abertura de Empresas",
];

export function HomeView() {
  const reduce = useReducedMotion();

  // Hero parallax for the decorative orb.
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // Cursor-following panel for the services list (desktop).
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 250, damping: 28, mass: 0.5 });
  const py = useSpring(my, { stiffness: 250, damping: 28, mass: 0.5 });

  const onListMove = (e: React.MouseEvent) => {
    if (!listRef.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = listRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const ActiveIcon = active !== null ? services[active].icon : null;

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-grid"
      >
        <div className="pointer-events-none absolute inset-0 bg-aurora" />
        {/* Parallax orb */}
        <motion.div
          style={{ y: reduce ? 0 : orbY }}
          className="pointer-events-none absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-brand-300/40 to-brand-500/10 blur-3xl"
        />

        <Container className="relative flex min-h-[88vh] flex-col justify-center py-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.18em] text-ink-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              Desde 2004 — Vila Nova de Gaia
            </span>
          </motion.div>

          <h1 className="font-bold leading-[0.92] tracking-tight text-[clamp(2.75rem,8.5vw,7.5rem)]">
            <TextReveal as="span" text="Contabilidade" className="block text-ink-900" />
            <TextReveal
              as="span"
              text="& Consultoria"
              className="block text-ink-400"
              delay={0.08}
            />
            <TextReveal
              as="span"
              text="de Excelência."
              className="block text-gradient"
              delay={0.16}
            />
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
            <Reveal delay={0.3} className="max-w-xl">
              <p className="text-lg leading-relaxed text-muted md:text-xl">
                Há mais de 20 anos a servir empresas com dedicação, rigor e
                inovação — para que se possa focar no que faz melhor: crescer.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Link
                    href="/contactos"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    Fale Connosco
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
                <Link
                  href="/servicos"
                  className="link-underline text-sm font-semibold text-ink-700"
                >
                  Ver Serviços
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.4} className="hidden md:flex md:justify-end">
              <div className="flex items-center gap-3 text-sm text-ink-400">
                <ArrowDown className="h-4 w-4 animate-bounce" />
                Faça scroll para explorar
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- Marquee */}
      <section className="border-y border-ink-800 bg-ink-950 py-6 text-white">
        <Marquee duration={30}>
          {marqueeItems.map((item) => (
            <span
              key={item}
              className="mx-8 inline-flex items-center gap-8 text-2xl font-medium uppercase tracking-tight md:text-4xl"
            >
              {item}
              <span className="text-brand-400">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ----------------------------------------------- Services hover list */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-4">
              <div className="flex w-sm">
                <Eyebrow>Serviços — 06</Eyebrow>
              </div>
              <TextReveal
                as="h2"
                text="Soluções completas para o seu negócio"
                className="text-3xl font-bold leading-tight text-ink-900 md:text-5xl"
              />
            </div>
            <Link
              href="/servicos"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-700"
            >
              Todos os serviços
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div
            ref={listRef}
            onMouseMove={onListMove}
            onMouseLeave={() => setActive(null)}
            className="relative border-t border-ink-100"
          >
            {services.map((service, i) => (
              <Link
                key={service.title}
                href="/servicos"
                onMouseEnter={() => setActive(i)}
                className="group flex items-center justify-between gap-6 border-b border-ink-100 py-7 transition-colors md:py-8"
              >
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span className="text-sm font-medium tabular-nums text-ink-300 md:text-base">
                    0{i + 1}
                  </span>
                  <span className="text-2xl font-semibold tracking-tight text-ink-900 transition-all duration-300 group-hover:translate-x-2 group-hover:text-brand-600 md:text-4xl">
                    {service.title}
                  </span>
                </div>
                <span className="hidden text-sm text-muted sm:block md:text-base">
                  {service.desc}
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-all duration-300 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-white">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            ))}

            {/* Cursor-following preview (desktop) */}
            {active !== null && ActiveIcon && (
              <motion.div
                style={{ x: px, y: py }}
                className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`flex h-44 w-60 -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-2xl bg-gradient-to-br ${services[active].gradient} p-6 text-white shadow-2xl shadow-ink-900/30`}
                >
                  <ActiveIcon className="h-9 w-9" />
                  <div>
                    <p className="text-lg font-semibold leading-tight">
                      {services[active].title}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {services[active].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Stats */}
      <section className="border-y border-ink-100 bg-ink-50/60 py-20">
        <Container>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="flex flex-col">
                  <CountUp
                    end={stat.number}
                    suffix={stat.suffix}
                    duration={2.4}
                    className="font-display text-5xl font-bold tracking-tight text-ink-900 md:text-7xl"
                  />
                  <span className="mt-3 text-sm uppercase tracking-wider text-muted">
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------ Approach */}
      <section className="grain relative overflow-hidden bg-ink-950 py-24 text-white md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(60%_60%_at_80%_0%,rgba(0,144,217,0.22),transparent_60%)]" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Eyebrow>A nossa abordagem</Eyebrow>
              <TextReveal
                as="h2"
                text="A excelência nasce da dedicação"
                className="mt-5 max-w-md text-3xl font-bold leading-[1.1] md:text-5xl"
              />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
                Acreditamos que os melhores resultados vêm da combinação de
                experiência, proximidade e atualização constante.
              </p>
            </div>

            <div className="border-t border-white/10">
              {approach.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="flex items-start gap-6 border-b border-white/10 py-7">
                    <span className="text-sm tabular-nums text-brand-400">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-white/55">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <TextReveal
              as="h2"
              text="Pronto para impulsionar o seu negócio?"
              className="text-4xl font-bold leading-[1.05] tracking-tight text-ink-900 md:text-6xl"
            />
            <Reveal delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
                Entre em contacto connosco e descubra como podemos ajudar a sua
                empresa a crescer com segurança e eficiência.
              </p>
              <div className="mt-10 flex justify-center">
                <Magnetic strength={0.4}>
                  <Link
                    href="/contactos"
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-brand-600/30 transition-colors hover:bg-ink-900"
                  >
                    Contacte-nos Hoje
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
