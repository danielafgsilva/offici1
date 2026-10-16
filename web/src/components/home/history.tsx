"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = { since: number; place: string; title: string | null; text: string | null };

// A glimpse of the story: how long the firm has been working, counted up once when it comes into view, and the
// two ends of the line with the middle left for the history page.
export function HistoryPanel({ since, place, title, text }: Props) {
  const years = new Date().getFullYear() - since;
  const root = useRef<HTMLElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const seen = useInView(root, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  // Starts at its true value so nothing is wrong without script; counts up from zero when seen
  useEffect(() => {
    if (!seen || reduce || !number.current) return;
    const controls = animate(0, years, {
      duration: 1.2,
      ease: [0.2, 0, 0, 1],
      onUpdate: (value) => {
        if (number.current) number.current.textContent = String(Math.round(value));
      },
    });
    return () => controls.stop();
  }, [seen, reduce, years]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.5 }, transition: { duration: 0.7, delay, ease: [0.2, 0, 0, 1] as const } };

  return (
    <section ref={root} aria-labelledby="historia-resumo" className="bg-[#eaf1f8]">
      <div className="container-page section grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="historia-resumo" className="text-lead font-semibold text-muted">
            Desde {since}
          </h2>
          <p className="mt-4 flex items-baseline gap-x-4 font-display leading-[0.85] font-semibold tracking-[-0.03em] text-navy">
            <span ref={number} className="figures text-[clamp(5.5rem,15vw,11rem)]">
              {years}
            </span>
            <span className="text-[clamp(1.75rem,4vw,3rem)]">anos</span>
          </p>
          <p className="mt-6 max-w-[26ch] text-lead">a acompanhar empresas em {place}.</p>
        </div>

        <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8">
          {/* The two ends of the line, and a gap the history page fills: the line draws, then the stops appear one by one */}
          <div aria-hidden="true">
            <div className="relative flex items-center justify-between">
              <span className="absolute inset-x-0 h-px bg-navy/20" />
              <span className="draw-in-view absolute inset-x-0 h-0.5 bg-navy" />
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  {...(reduce ? {} : { initial: { scale: 0.6, opacity: 0 }, whileInView: { scale: 1, opacity: 1 }, viewport: { once: true, amount: 1 }, transition: { duration: 0.4, delay: 0.3 + dot * 0.08, ease: [0.2, 0, 0, 1] as const } })}
                  className={`relative size-3.5 rounded-full border-2 border-navy ${dot === 1 ? "bg-[#eaf1f8]" : "bg-navy"}`}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-sm text-muted">
              <span className="figures">{since}</span>
              <span>Hoje</span>
            </div>
          </div>
          <motion.div {...enter(0.2)}>
            {title && <p className="mt-8 font-display text-2xl leading-tight font-semibold tracking-[-0.02em] text-navy">{title}</p>}
            {text && <p className="mt-3">{text}</p>}
            <Link href="/sobre-nos" className="btn btn-frost mt-8 w-fit">
              Conheça a nossa história
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
