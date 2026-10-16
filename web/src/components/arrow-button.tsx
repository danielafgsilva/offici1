"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

// A pill with its label and a small disc holding an arrow. On hover or focus the two swap ends: the order flips and
// Motion animates each from where it was to where it is with transforms (nothing is re-laid-out frame by frame), while
// the arrow turns a quarter. The press feedback is a small squeeze.
export function ArrowButton({ href, label, tone }: { href: string; label: string; tone: "navy" | "white" }) {
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  const colours = tone === "navy" ? "bg-navy text-offwhite" : "bg-white text-navy";
  const disc = tone === "navy" ? "bg-offwhite text-navy" : "bg-navy text-offwhite";
  const move = { duration: reduce ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <LazyMotion features={domAnimation}>
      <Link
        href={href}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={`inline-flex h-14 w-fit items-center gap-4 rounded-full p-1.5 text-base font-semibold shadow-[0_8px_24px_rgb(26_54_93/0.16)] transition-transform duration-150 ease-(--ease-out) active:scale-[0.97] ${active ? "flex-row-reverse pr-7 pl-1.5" : "pr-1.5 pl-7"} ${colours}`}
      >
        <m.span layout transition={move} className="whitespace-nowrap">
          {label}
        </m.span>
        <m.span layout transition={move} aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-full ${disc}`}>
          <m.span animate={{ rotate: active ? 45 : 0 }} transition={move} className="flex">
            <ArrowUpRightIcon size={20} weight="bold" />
          </m.span>
        </m.span>
      </Link>
    </LazyMotion>
  );
}
