import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { TESTIMONIALS_QUERY_RESULT } from "../../sanity.types";

// What clients say: a card each, with the person's photograph (or their initial until there is one), what they
// say, and who they are. Four across on a wide screen, two on a tablet, a row to swipe on a phone.
export function Testimonials({ items }: { items: TESTIMONIALS_QUERY_RESULT }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="depoimentos" className="bg-sand">
      <div className="container-page section">
        <h2 id="depoimentos" className="max-w-[18ch] text-h1">
          O que dizem os clientes
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 max-sm:-mx-5 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:px-5 max-sm:pb-4 max-sm:[scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <li key={item._id} className="max-sm:w-[78vw] max-sm:shrink-0 max-sm:snap-start">
              <figure className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white transition-transform duration-200 ease-(--ease-out) hover:-translate-y-1">
                {item.photo?.asset ? (
                  <Image
                    src={urlFor(item.photo).width(640).height(480).fit("crop").url()}
                    alt={`Fotografia de ${item.author}`}
                    width={640}
                    height={480}
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 78vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div aria-hidden="true" className="flex aspect-[4/3] items-end bg-[#cfe0f0] p-4 font-display text-[5.5rem] leading-[0.8] font-semibold tracking-[-0.05em] text-navy">
                    {item.author?.charAt(0)}
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <blockquote className="text-ink">“{item.quote}”</blockquote>
                  <figcaption>
                    <span className="block font-semibold text-navy">{item.author}</span>
                    {item.company && <span className="block text-sm text-muted">{item.company}</span>}
                  </figcaption>
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
