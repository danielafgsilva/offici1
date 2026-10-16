"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export type Member = {
  id: string;
  name: string;
  role: string | null;
  verified: boolean;
  photo: { src: string; alt: string } | null;
  quote: string | null;
  bio: string | null;
  since: string | null;
  speciality: string | null;
  qualification: string | null;
  background: string | null;
  personalNote: string | null;
  answers: { key: string; question: string; answer: string }[];
};

function Portrait({ member, className, large = false }: { member: Member; className: string; large?: boolean }) {
  return member.photo ? (
    <Image src={member.photo.src} alt={member.photo.alt} width={900} height={900} sizes="(min-width: 1024px) 25vw, 45vw" className={`${className} object-cover object-[50%_20%]`} />
  ) : (
    <div className={`${className} flex items-end bg-[#cfe0f0] p-4 text-navy`}>
      <span aria-hidden="true" className={`font-display leading-[0.8] font-semibold tracking-[-0.05em] ${large ? "text-[12rem]" : "text-[7rem] lg:text-[9rem]"}`}>
        {member.name.charAt(0)}
      </span>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: string | null }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

/*
 * The team as a grid of cards. Choosing one opens a wide panel under the grid with the whole person, brought into
 * view; choosing another swaps what it shows; choosing the same one, or "Fechar", folds it away. A link such as
 * /equipa#claudio opens that person on arrival. The panel is a region named after the person, and each card says
 * whether it is open.
 */
export function TeamExplorer({ team }: { team: Member[] }) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  // The last person stays in the panel while it folds away
  const [shown, setShown] = useState<string | null>(null);
  const member = team.find((person) => person.id === (selected ?? shown));

  const choose = (id: string) => {
    setSelected((current) => (current === id ? null : id));
    setShown(id);
  };

  // Arriving from /equipa#name opens that person (after the first paint, so the page is the same as the server's)
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!team.some((person) => person.id === id)) return;
    const timer = setTimeout(() => {
      setSelected(id);
      setShown(id);
    }, 0);
    return () => clearTimeout(timer);
  }, [team]);

  useEffect(() => {
    if (selected) panel.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [selected, reduce]);

  return (
    <LazyMotion features={domAnimation}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {team.map((person) => {
          const open = person.id === selected;
          return (
            <li key={person.id} className="flex">
              <button
                type="button"
                onClick={() => choose(person.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] text-left transition-colors duration-200 ease-(--ease-out) active:scale-[0.98] ${open ? "bg-navy text-offwhite" : "bg-white text-navy hover:bg-navy hover:text-offwhite focus-visible:bg-navy focus-visible:text-offwhite"}`}
              >
                <span className="block p-2.5 pb-0">
                  <span className="block overflow-hidden rounded-[1.25rem]">
                    <Portrait member={person} className="aspect-square w-full transition-transform duration-300 ease-(--ease-out) group-hover:scale-[1.03]" />
                  </span>
                </span>
                <span className="block flex-1 px-5 pt-4 pr-16 pb-5">
                  <span className="block font-display text-xl leading-tight font-semibold tracking-[-0.02em]">{person.name}</span>
                  {person.role && <span className={`mt-1 block text-sm ${open ? "text-offwhite/80" : "text-muted group-hover:text-offwhite/80"}`}>{person.role}</span>}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full transition-[background-color,color,rotate] duration-200 ease-(--ease-out) ${open ? "rotate-45 bg-offwhite text-navy" : "bg-[#e6eff7] text-navy group-hover:bg-offwhite"}`}
                >
                  <PlusIcon size={18} weight="bold" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Folds open under the grid; the swap between people is a short fade and rise */}
      <div
        id={panelId}
        ref={panel}
        role="region"
        aria-label={member?.name}
        className={`grid scroll-mt-20 transition-[grid-template-rows] duration-350 ease-(--ease-out) ${selected ? "grid-rows-[1fr]" : "grid-rows-[0fr] invisible delay-500 [transition-property:grid-template-rows,visibility]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {member && (
              <m.div
                key={member.id}
                initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="pt-4 lg:pt-6"
              >
                <div className="grid gap-x-12 gap-y-8 rounded-[2.5rem] bg-[#e6eff7] p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
                  <div className="lg:col-span-4">
                    <div className="max-w-sm overflow-hidden rounded-[2rem] lg:max-w-none">
                      <Portrait member={member} large className="aspect-[4/5] w-full" />
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {member.role && <p className="text-lead text-muted">{member.role}</p>}
                        <h2 className="mt-1 font-display text-[clamp(2.5rem,1.5rem+4vw,5rem)] leading-none font-semibold tracking-[-0.04em] text-navy [overflow-wrap:anywhere]">
                          {member.name}
                        </h2>
                        {member.since && <p className="mt-3 text-muted">{member.since}</p>}
                      </div>
                      <button type="button" onClick={() => setSelected(null)} className="btn btn-glass-navy shrink-0">
                        Fechar
                      </button>
                    </div>
                    {member.quote && (
                      <blockquote className="mt-6 max-w-[32ch] font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.25] font-semibold tracking-[-0.02em] text-blue">
                        “{member.quote}”
                      </blockquote>
                    )}
                    {member.bio && <p className="measure mt-6 text-lead">{member.bio}</p>}
                    <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      <Fact label="Especialidade">{member.speciality}</Fact>
                      <Fact label="Qualificações">{member.qualification}</Fact>
                      <Fact label="Antes da Offici’um">{member.background}</Fact>
                      <Fact label="Um detalhe">{member.personalNote}</Fact>
                    </dl>
                    {member.answers.length > 0 && (
                      <dl className="mt-8 grid gap-3 md:grid-cols-3">
                        {member.answers.map((item) => (
                          <div key={item.key} className="rounded-[1.5rem] bg-white p-5">
                            <dt className="text-sm font-semibold text-navy">{item.question}</dt>
                            <dd className="mt-1">{item.answer}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {!member.verified && (
                      <p className="mt-6 inline-block rounded-full border border-navy px-3 py-1 text-sm font-medium text-navy">Exemplo, por confirmar</p>
                    )}
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
