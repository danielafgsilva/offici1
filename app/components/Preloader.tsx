"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SESSION_KEY = "offici1:intro-seen";

export function Preloader() {
  // `null` until we decide whether to show it (avoids SSR flash).
  const [show, setShow] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY);

    if (seen || reduce) {
      setShow(false);
      return;
    }

    setShow(true);
    document.body.style.overflow = "hidden";

    // Animate the percentage counter 0 → 100.
    const duration = 1500;
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 350);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // Release scroll + persist once the intro is dismissed.
  useEffect(() => {
    if (show === false) {
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(50%_50%_at_50%_45%,rgba(0,144,217,0.25),transparent_70%)]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            <div className="rounded-3xl bg-white/95 p-7 shadow-2xl shadow-brand-900/30">
              <Image
                src="/logo.png"
                alt="Offici'um"
                width={536}
                height={376}
                priority
                className="h-20 w-auto md:h-24"
              />
            </div>

            {/* Progress track */}
            <div className="mt-10 h-px w-56 overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-brand-400"
                style={{ width: `${count}%` }}
              />
            </div>

            <div className="mt-4 flex w-56 items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-white/50">
              <span>A preparar</span>
              <span className="tabular-nums text-white/80">{count}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
