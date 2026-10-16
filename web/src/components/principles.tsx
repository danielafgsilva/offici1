type Principle = { _key: string; title: string | null; text: string | null };

// "O que pode esperar de nós": the commitments edited in "Sobre nós" in the Studio.
export function Principles({ items }: { items: Principle[] }) {
  return (
    <dl className="rule grid md:grid-cols-3">
      {items.map(({ _key, title, text }) => (
        <div
          key={_key}
          className="border-b border-line py-8 md:border-b-0 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0 md:last:pr-0"
        >
          <dt className="font-display text-[1.75rem] leading-tight font-medium text-navy">{title}</dt>
          <dd className="mt-3">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
