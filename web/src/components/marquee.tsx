import { type ReactNode } from "react";

/*
 * A row that drifts sideways without end. It stops while the pointer or keyboard focus is on it. The second copy
 * is for the loop only, so it is hidden from assistive technology and cannot take focus. Under reduced motion
 * nothing moves: it is an ordinary scrolling row.
 */
export function Marquee({
  label,
  children,
  footer,
  copies = 1,
  seconds = 55,
}: {
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  /** How many times the items fill one half of the loop: raise it when the items alone are narrower than the screen */
  copies?: number;
  /** Seconds for one full loop: higher is slower */
  seconds?: number;
}) {
  // The track holds two equal halves; it moves by exactly one half, so the loop has no seam
  const lists = Array.from({ length: copies * 2 }, (_, index) => index);

  return (
    <section aria-roledescription="carousel" aria-label={label}>
      <div className="marquee overflow-x-hidden py-2">
        <div className="marquee-track flex w-max" style={{ "--drift": `${seconds}s` } as React.CSSProperties}>
          {lists.map((index) =>
            index === 0 ? (
              <ul key={index} className="flex gap-x-5 pr-5">
                {children}
              </ul>
            ) : (
              <ul key={index} aria-hidden="true" inert className="marquee-clone flex gap-x-5 pr-5">
                {children}
              </ul>
            ),
          )}
        </div>
      </div>
      {footer && <div className="container-page mt-8 flex justify-center">{footer}</div>}
    </section>
  );
}
