import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/marquee";
import { urlFor } from "@/sanity/image";
import type { TEAM_QUERY_RESULT } from "../../../sanity.types";

// The people, small and always drifting: name and role only, each card opening the team page. Until a portrait
// is uploaded the card is navy with the person's initial: a placeholder, labelled as one.
export function Team({ team }: { team: TEAM_QUERY_RESULT }) {
  if (team.length === 0) return null;
  return (
    <section aria-labelledby="equipa-titulo" className="bg-sand py-16 lg:py-24">
      <div className="container-page">
        <h2 id="equipa-titulo" className="max-w-[20ch] text-h1">
          A equipa que o acompanha
        </h2>
      </div>
      <div className="mt-10 lg:mt-12">
        <Marquee label="Equipa" copies={Math.ceil(6 / team.length)} seconds={120}>
          {team.map((person) => (
            <li key={person._id} className="w-[9.5rem] shrink-0 sm:w-[11rem] lg:w-[min(22rem,calc((100vw-5rem)/5))]">
              <Link href="/equipa" className="group block">
                <div className="overflow-hidden rounded-[1.25rem]">
                  {person.photo?.asset ? (
                    <Image
                      src={urlFor(person.photo).width(640).height(800).fit("crop").url()}
                      alt={person.photo.alt || `Retrato de ${person.name}`}
                      width={440}
                      height={550}
                      sizes="(min-width: 1024px) 20vw, 11rem"
                      className="photo aspect-[4/5] w-full transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] items-end bg-[#cfe0f0] p-3 text-navy">
                      <p aria-hidden="true" className="font-display text-[5.5rem] leading-[0.8] lg:text-[9rem] font-semibold tracking-[-0.05em] transition-transform duration-500 ease-(--ease-out) group-hover:-translate-y-1">
                        {person.name?.charAt(0)}
                      </p>
                    </div>
                  )}
                </div>
                <p className="mt-3 font-display text-xl leading-tight lg:text-2xl font-semibold tracking-[-0.02em] text-navy group-hover:underline">{person.name}</p>
                {person.role && <p className="text-sm text-muted">{person.role}</p>}
              </Link>
            </li>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
