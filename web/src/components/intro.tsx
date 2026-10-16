"use client";

import { useEffect } from "react";

// The names of the team, rising one by one over navy, then the curtain lifts. Shown once per session
// (the script in the page head decides); purely visual, so assistive technology skips it.
export function Intro({ names }: { names: string[] }) {
  // Once the curtain is up, hero animations go back to starting immediately; a click or a key skips it at any time
  useEffect(() => {
    const end = () => delete document.documentElement.dataset.intro;
    const timer = setTimeout(end, 1900);
    window.addEventListener("pointerdown", end, { once: true });
    window.addEventListener("keydown", end, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", end);
      window.removeEventListener("keydown", end);
    };
  }, []);

  if (names.length === 0) return null;

  return (
    <div aria-hidden="true" className="intro fixed inset-0 z-[100] flex-col justify-center bg-navy px-[clamp(1.25rem,4vw,2.5rem)] text-offwhite">
      <ul className="mx-auto flex w-full max-w-[76rem] flex-wrap gap-x-[0.3em] font-display text-[clamp(2.25rem,8vw,6.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
        {names.map((name, index) => (
          <li key={name} className="-mb-[0.14em] overflow-hidden pb-[0.14em]">
            <span className="intro-name inline-block" style={{ "--d": `${100 + index * 80}ms` } as React.CSSProperties}>
              {name}
              {index < names.length - 1 ? "," : "."}
            </span>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-6 w-full max-w-[76rem]">
        <div className="intro-line h-1 w-full rounded-full bg-sky" />
      </div>
    </div>
  );
}
