import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactCta } from "@/components/contact-cta";
import { OutsideOffice } from "@/components/outside-office";
import { RisingWords } from "@/components/rising-words";
import { TeamExplorer, type Member } from "@/components/team-explorer";
import { personId } from "@/lib/person";
import { urlFor } from "@/sanity/image";
import { client, fetchOptions } from "@/sanity/client";
import { TEAM_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";
import { getTeamPhotos } from "@/sanity/settings";

export const generateMetadata = (): Promise<Metadata> =>
  seoMetadata(null, {
    path: "/equipa",
    title: "Equipa: as pessoas do gabinete de contabilidade",
    description:
      "As pessoas da Offici'um, gabinete de contabilidade em Vila Nova de Gaia: quem vai acompanhar a sua empresa e com quem vai falar.",
  });

export default async function TeamPage() {
  const [team, teamPhotos] = await Promise.all([client.fetch(TEAM_QUERY, {}, fetchOptions), getTeamPhotos()]);

  const members: Member[] = team.map((person) => ({
    id: personId(person.name),
    name: person.name ?? "",
    role: person.role ?? null,
    verified: Boolean(person.verified),
    photo: person.photo?.asset
      ? { src: urlFor(person.photo).width(900).height(900).fit("crop").url(), alt: person.photo.alt || `Retrato de ${person.name}` }
      : null,
    quote: person.quote ?? null,
    bio: person.bio ?? null,
    since: person.since ?? null,
    speciality: person.speciality ?? null,
    qualification: person.qualification ?? null,
    background: person.background ?? null,
    personalNote: person.personalNote ?? null,
    answers: (person.answers ?? []).map((item) => ({ key: item._key, question: item.question ?? "", answer: item.answer ?? "" })),
  }));

  return (
    <>
      {/* The statement across the full width of the page, and the introduction under it */}
      <section className="container-page page-top pb-10! lg:pb-14!">
        <Breadcrumbs items={[{ label: "Equipa", href: "/equipa" }]} />
        <RisingWords
          text="Sabemos tratar dos números, mas nunca esquecemos as pessoas."
          className="mt-6 text-[clamp(2.25rem,0.9rem+4.8vw,5.5rem)] leading-[1.02] font-semibold text-navy"
        />
        <p className="mt-6 max-w-none text-lead">São estas as pessoas que acompanham a sua empresa. Escolha uma para a conhecer melhor.</p>
      </section>

      {/* One card each; choosing one opens the whole person underneath */}
      {members.length > 0 && (
        <section aria-labelledby="pessoas" className="container-page pb-16 lg:pb-28">
          <h2 id="pessoas" className="sr-only">
            Quem somos
          </h2>
          <TeamExplorer team={members} />
        </section>
      )}

      <OutsideOffice photos={teamPhotos} />

      <ContactCta
        title={"Quer conhecer\u2011nos pessoalmente?"} // U+2011: a hyphen that never breaks the line
        text="Marque uma reunião no gabinete ou ligue-nos. A primeira conversa serve para nos conhecermos e percebermos o que a sua empresa precisa."
      />
    </>
  );
}
