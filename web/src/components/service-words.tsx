import Link from "next/link";

type Service = {
  _id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  audience?: string | null;
};

// Services as a plain list of large words: no cards, no numbering, no icons.
export function ServiceWords({ services, onBlue = false }: { services: Service[]; onBlue?: boolean }) {
  const line = onBlue ? "border-offwhite/35" : "border-line";

  return (
    <ul className={`border-t ${onBlue ? line : "border-navy"}`}>
      {services.map((service) => (
        <li key={service._id} className={`border-b ${line}`}>
          <Link
            href={`/servicos/${service.slug}`}
            className="group grid gap-x-8 gap-y-2 py-6 lg:grid-cols-12 lg:items-baseline lg:py-8"
          >
            <span
              className={`font-display text-[2rem] leading-[1.02] font-medium decoration-2 underline-offset-[0.14em] group-hover:underline lg:col-span-7 lg:text-[3.25rem] ${
                onBlue ? "text-offwhite" : "text-navy"
              }`}
            >
              {service.title}
            </span>
            <span className={`lg:col-span-5 ${onBlue ? "text-offwhite" : ""}`}>
              {service.summary}
              {service.audience && (
                <span className={`mt-2 block text-sm ${onBlue ? "text-offwhite" : "text-muted"}`}>
                  {service.audience}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
