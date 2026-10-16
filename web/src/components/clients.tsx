import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { CLIENTS_QUERY_RESULT } from "../../sanity.types";

// Stand-ins for logos until real ones are uploaded: a simple mark in a colour and shape per client, drawn here
const MARKS = [
  { colour: "#0b6cb0", radius: "9999px" },
  { colour: "#0f8f7e", radius: "0.9rem" },
  { colour: "#d98a1f", radius: "9999px 9999px 0.9rem 9999px" },
  { colour: "#c2415d", radius: "0.9rem 9999px 0.9rem 9999px" },
  { colour: "#1a365d", radius: "0.9rem" },
];

function Mark({ name, index }: { name: string; index: number }) {
  const { colour, radius } = MARKS[index % MARKS.length];
  const initials = name
    .split(/\s+/)
    .filter((word) => /^\p{Lu}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("") || name.trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{ background: colour, borderRadius: radius }}
      className="flex size-12 items-center justify-center font-display text-lg font-semibold text-white"
    >
      {initials}
    </span>
  );
}

// Who the firm works for: soft cards, in greyscale until hovered, then the logo and name take their colour.
export function Clients({ clients }: { clients: CLIENTS_QUERY_RESULT }) {
  if (clients.length === 0) return null;

  return (
    <section aria-labelledby="clientes" className="container-page section">
      <h2 id="clientes" className="max-w-[18ch] text-h1">
        Empresas que acompanhamos
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-14 lg:grid-cols-4 lg:gap-4">
        {clients.map((client, index) => (
          <li
            key={client._id}
            className="group flex min-h-40 flex-col justify-between gap-6 rounded-[1.75rem] bg-white p-6 transition-transform duration-200 ease-(--ease-out) hover:-translate-y-1"
          >
            <div className="flex flex-col gap-4 grayscale transition-[filter] duration-200 group-hover:grayscale-0 group-focus-within:grayscale-0">
              {client.logo?.asset ? (
                <Image
                  src={urlFor(client.logo).height(96).url()}
                  alt=""
                  width={200}
                  height={48}
                  className="h-12 w-auto max-w-full object-contain object-left"
                />
              ) : (
                <Mark name={client.name ?? ""} index={index} />
              )}
              <p className="font-display text-lg leading-tight font-semibold tracking-[-0.02em] text-navy">{client.name}</p>
            </div>
            {client.sector && <p className="text-sm text-muted">{client.sector}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
