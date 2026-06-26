import type { ReactNode } from "react";
import { Container, Eyebrow } from "./ui";
import { Reveal } from "./Reveal";
import { TextReveal } from "./motion";

/* Compact hero used at the top of inner pages, with a masked title reveal. */
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <Container className="relative py-24 md:py-32">
        <div className="flex max-w-4xl flex-col gap-6">
          {eyebrow ? (
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
          ) : null}
          <TextReveal
            as="h1"
            text={title}
            className="text-4xl font-bold leading-[1.02] tracking-tight text-ink-900 md:text-6xl"
          />
          {lead ? (
            <Reveal delay={0.2}>
              <p className="max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                {lead}
              </p>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
