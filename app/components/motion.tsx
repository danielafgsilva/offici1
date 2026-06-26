"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import {
  useRef,
  type ElementType,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ *
 * TextReveal — splits text into words that rise from a clipping mask.
 * Use for big editorial headings. Pass plain text as children.
 * ------------------------------------------------------------------ */
export function TextReveal({
  text,
  className = "",
  as = "h2",
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as as "h2"] ?? motion.h2;
  const words = text.split(" ");

  if (reduce) {
    const Static = as as ElementType;
    return <Static className={className}>{text}</Static>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      aria-label={text}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i} className="reveal-mask inline-block align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              visible: { y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * Marquee — seamless infinite horizontal scroll. Duplicates children.
 * ------------------------------------------------------------------ */
export function Marquee({
  children,
  duration = 28,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`marquee-paused w-full overflow-hidden ${className}`}>
      <div
        className="animate-marquee flex w-max flex-nowrap"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex flex-nowrap">{children}</div>
        <div className="flex flex-nowrap" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Magnetic — element subtly follows the cursor (desktop pointer only).
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
