"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { src: string; alt: string; whole?: boolean };

// Where each card sits relative to the front one: the front, two peeking from behind (each a little lower and more
// turned), the ones further back hidden at the last position, and the card that has just left, thrown off to the left.
const place = (offset: number, count: number) => {
  if (offset === 0) return { x: 0, y: 0, r: -1.5, s: 1, o: 1, z: 30 };
  if (offset === 1) return { x: 3.5, y: 4, r: 3, s: 0.97, o: 1, z: 20 };
  if (offset === 2) return { x: 7, y: 8, r: 6.5, s: 0.94, o: 1, z: 10 };
  if (offset === count - 1) return { x: -42, y: 2, r: -12, s: 0.96, o: 0, z: 40 };
  return { x: 7, y: 8, r: 6.5, s: 0.94, o: 0, z: 0 };
};

// The team's photographs as a stack of cards that deal themselves: every few seconds the front card is thrown off to the
// side and the next comes forward. It rests only while keyboard focus is inside it. Each card is
// the photograph itself, cropped to fit (or shown whole, for the ones marked so), with its caption on it. Under reduced
// motion the cards swap in place instead of travelling.
export function PhotoSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [resting, setResting] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || resting) return;
    // Keeps dealing even when the section is out of view, but not while the tab is in the background
    const timer = setInterval(() => {
      if (!document.hidden) setCurrent((index) => (index + 1) % count);
    }, 4200);
    return () => clearInterval(timer);
  }, [count, resting]);

  return (
    <div
      onFocus={() => setResting(true)}
      onBlur={() => setResting(false)}
      className="relative pr-[8%] pb-[8%]"
    >
      <div className="relative aspect-[16/13] w-full">
        {slides.map((slide, index) => {
          const p = place((index - current + count) % count, count);
          return (
            <figure
              key={slide.src}
              aria-hidden={index !== current}
              style={{
                transform: `translate(${p.x}%, ${p.y}%) rotate(${p.r}deg) scale(${p.s})`,
                opacity: p.o,
                zIndex: p.z,
              }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#dbe8f4] shadow-[0_20px_50px_rgb(26_54_93/0.2)] transition-[transform,opacity] duration-[650ms] ease-(--ease-out)"
            >
              <Image
                src={slide.src}
                alt={index === current ? slide.alt : ""}
                fill
                sizes="(min-width: 1024px) 50vw, 92vw"
                priority={index === 0}
                className={slide.whole ? "object-contain" : "object-cover object-[50%_35%]"}
              />
              <figcaption className="absolute bottom-4 left-4 max-w-[85%] rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-navy">
                {slide.alt}
              </figcaption>
            </figure>
          );
        })}
      </div>
      {count > 1 && (
        <div className="mt-6 flex justify-center gap-1">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Fotografia ${index + 1} de ${count}`}
              aria-current={index === current}
              className="flex size-8 items-center justify-center"
            >
              <span className={`block h-1.5 w-8 origin-center rounded-full bg-navy transition-[transform,opacity] duration-300 ease-(--ease-out) ${index === current ? "" : "scale-x-[0.375] opacity-30"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
