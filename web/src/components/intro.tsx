"use client";

import { useEffect } from "react";
import { LINE, TAGLINE, WORD } from "./logo";

// The first-visit intro, drawn from the logo: the disc settles, the rising line is drawn across it from end to end,
// the two dots land as the line reaches them, then the name is wiped in; then the curtain lifts. Shown once per session
// (the script in the page head decides); purely visual, so assistive technology skips it.
export function Intro() {
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

  return (
    <div aria-hidden="true" className="intro fixed inset-0 z-[100] flex items-center justify-center bg-navy px-6">
      <svg viewBox="75 20 1198 212" className="w-[min(86vw,34rem)]">
        <defs>
          <radialGradient id="intro-fill" cx="267" cy="128" r="130" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".55" stopColor="#f1f6fb" />
            <stop offset="1" stopColor="#dbe8f4" />
          </radialGradient>
          {/* The gap the line leaves in the disc is drawn with the line */}
          <mask id="intro-band" maskUnits="userSpaceOnUse" x="130" y="10" width="274" height="232">
            <rect x="130" y="10" width="274" height="232" fill="#fff" />
            <path d={LINE} pathLength={1} fill="none" stroke="#000" strokeWidth="27" strokeMiterlimit="10" className="intro-draw" />
          </mask>
        </defs>
        <ellipse cx="267" cy="125.7" rx="126" ry="105" fill="url(#intro-fill)" mask="url(#intro-band)" className="intro-disc" />
        <path d={LINE} pathLength={1} fill="none" stroke="#1f9ad8" strokeWidth="5.5" strokeLinejoin="round" className="intro-draw" />
        <circle cx="85" cy="172.7" r="9.5" fill="#1f9ad8" className="intro-dot" style={{ animationDelay: "120ms" }} />
        <circle cx="450" cy="84" r="9.5" fill="#1f9ad8" className="intro-dot" style={{ animationDelay: "760ms" }} />
        <g transform="translate(478.25 -356.3) scale(1.5)" className="intro-word">
          <path d={WORD} fill="#1c9ad6" />
          <path d={TAGLINE} fill="#f7f6f2" />
        </g>
      </svg>
    </div>
  );
}
