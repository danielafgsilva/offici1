"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type TimelineItem = {
  id: string;
  year: string;
  kind?: string | null;
  title: string | null;
  text?: string | null;
  example?: boolean;
  link?: { href: string; label: string };
};

/*
 * The company's life as one line running sideways. On a wide screen the page is pinned and vertical scrolling
 * slides the line past, filling as it goes; on narrow screens, or with reduced motion, it is an ordinary
 * sideways scroller. Years and what happened alternate above and below the line.
 */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [size, setSize] = useState({ distance: 0, height: 0 });

  useEffect(() => {
    const query = matchMedia("(min-width: 1024px)");
    const measure = () => {
      setWide(query.matches && !reduce);
      setSize({ distance: Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth), height: window.innerHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -size.distance]);

  return (
    <div ref={outer} style={wide ? { height: size.distance + size.height } : undefined}>
      <div className={wide ? "sticky top-0 flex h-dvh items-center overflow-hidden" : "py-10"}>
        <div
          className={wide ? "w-full" : "w-full overflow-x-auto pb-4"}
          {...(wide ? {} : { role: "region", "aria-label": "A nossa história. Deslize na horizontal.", tabIndex: 0 })}
        >
          <motion.ol ref={track} style={wide ? { x } : undefined} className="bleed-inset relative flex w-max pr-[20vw]">
            {/* The line, and the part of it already travelled */}
            <li aria-hidden="true" className="pointer-events-none absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-line" />
            <motion.li
              aria-hidden="true"
              style={{ scaleX: wide ? scrollYProgress : 1 }}
              className="pointer-events-none absolute top-1/2 right-0 left-0 h-0.5 origin-left -translate-y-1/2 bg-navy"
            />
            {items.map((item, index) => {
              const up = index % 2 === 0;
              const year = (
                <p
                  aria-hidden="true"
                  className="figures font-display text-[clamp(4rem,9vw,8rem)] leading-[0.85] font-semibold tracking-[-0.03em] text-navy"
                >
                  {item.year}
                </p>
              );
              const body = (
                <div>
                  {item.kind && <p className="eyebrow">{item.kind}</p>}
                  <h3 className="mt-1 font-display text-2xl leading-tight font-semibold tracking-[-0.025em]">
                    <span className="sr-only">{item.year}: </span>
                    {item.title}
                  </h3>
                  {item.text && <p className="mt-3">{item.text}</p>}
                  {item.example && (
                    <p className="mt-3 inline-block rounded-full border border-navy px-3 py-1 text-sm font-medium text-navy">
                      Exemplo, por confirmar
                    </p>
                  )}
                  {item.link && (
                    <Link href={item.link.href} className="link tap mt-2">
                      {item.link.label}
                    </Link>
                  )}
                </div>
              );
              return (
                <li key={item.id} className="relative grid h-[34rem] w-[min(24rem,78vw)] shrink-0 grid-rows-[1fr_2.5rem_1fr] pr-10">
                  <div className="flex items-end pb-2">{up ? year : body}</div>
                  <span aria-hidden="true" className="relative flex items-center">
                    <span className="relative z-10 size-4 rounded-full border-[3px] border-navy bg-paper" />
                  </span>
                  <div className="pt-2">{up ? body : year}</div>
                </li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </div>
  );
}
