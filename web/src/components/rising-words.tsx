import type { CSSProperties } from "react";

type Props = { text: string | null | undefined; as?: "h1" | "p"; className?: string };

// A page title whose words rise into place once, on load. CSS only: the text is in the
// first paint, and under reduced motion it is simply there.
export function RisingWords({ text, as: Tag = "h1", className }: Props) {
  const words = (text ?? "").split(/\s+/).filter(Boolean);

  return (
    <Tag className={className} aria-label={words.join(" ")}>
      {words.map((word, index) => (
        // The outer span is the mask; its padding leaves room for descenders
        <span key={index} aria-hidden="true">
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <span className="rise inline-block" style={{ "--d": `${60 + index * 55}ms` } as CSSProperties}>
              {word}
            </span>
          </span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
