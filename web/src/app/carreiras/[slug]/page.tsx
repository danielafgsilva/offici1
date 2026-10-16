import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { RisingWords } from "@/components/rising-words";
import { site, siteUrl } from "@/lib/site";
import { client, fetchOptions } from "@/sanity/client";
import { OPEN_JOBS_QUERY, OPEN_JOB_QUERY } from "@/sanity/queries";
import { seoMetadata } from "@/sanity/seo";
import { getSettings } from "@/sanity/settings";
import { ApplicationForm } from "../application-form";

const longDate = new Intl.DateTimeFormat("pt-PT", { dateStyle: "long", timeZone: "Europe/Lisbon" });

// A vacancy that closes between builds simply stops being found (404), as it should
export const dynamicParams = true;

export async function generateStaticParams() {
  const jobs = await client.fetch(OPEN_JOBS_QUERY, {}, fetchOptions);
  return jobs.flatMap((job) => (job.slug ? [{ slug: job.slug }] : []));
}

export async function generateMetadata({ params }: PageProps<"/carreiras/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const job = await client.fetch(OPEN_JOB_QUERY, { slug }, fetchOptions);
  if (!job) return {};
  return seoMetadata(null, { path: `/carreiras/${slug}`, title: `${job.title}: vaga`, description: job.summary ?? undefined });
}

function JobList({ title, items }: { title: string; items: string[] | null }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h2 className="text-h3">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-navy">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function JobPage({ params }: PageProps<"/carreiras/[slug]">) {
  const { slug } = await params;
  const [job, settings] = await Promise.all([client.fetch(OPEN_JOB_QUERY, { slug }, fetchOptions), getSettings()]);
  if (!job) notFound();

  const text = [job.summary, job.description, ...[job.responsibilities, job.requirements, job.offer].flatMap((items) => items ?? [])]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      {text && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: text,
            datePosted: job.publishedAt ?? job._createdAt.slice(0, 10),
            ...(job.closingDate ? { validThrough: `${job.closingDate}T23:59:59+00:00` } : {}),
            directApply: true,
            url: `${siteUrl}/carreiras/${slug}`,
            hiringOrganization: { "@type": "Organization", name: site.legalName, sameAs: siteUrl },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address.slice(0, -1).join(", "),
                postalCode: settings.postalCode,
                addressLocality: settings.locality,
                addressCountry: "PT",
              },
            },
          }}
        />
      )}
      <section className="container-page page-top pb-12! lg:pb-16!">
        <Breadcrumbs
          items={[
            { label: "Carreiras", href: "/carreiras" },
            { label: job.title ?? "", href: `/carreiras/${slug}` },
          ]}
        />
        <RisingWords text={job.title} className="mt-4 max-w-[18ch] text-hero" />
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-lead">
          {[job.contractType, job.location, job.workModel].filter(Boolean).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {job.closingDate && (
          <p className="mt-2 text-muted">Candidaturas até {longDate.format(new Date(`${job.closingDate}T12:00:00Z`))}</p>
        )}
      </section>

      <section className="container-page pb-16 lg:pb-28">
        <div className="grid gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-6">
            {job.summary && <p className="text-lead">{job.summary}</p>}
            {job.description && <p className="whitespace-pre-line">{job.description}</p>}
            <JobList title="O que vai fazer" items={job.responsibilities} />
            <JobList title="Requisitos" items={job.requirements} />
            <JobList title="O que oferecemos" items={job.offer} />
            <Link href="/carreiras" className="link tap">
              Ver todas as vagas
            </Link>
          </div>
          <div id="candidatura" className="scroll-mt-24 lg:col-span-5 lg:col-start-8">
            <h2 className="text-h1">Candidate-se a esta vaga</h2>
            <p className="mt-3 mb-8 text-sm text-muted">O currículo segue por email para o gabinete e não fica guardado neste site.</p>
            <ApplicationForm jobs={[]} vacancy={{ _id: job._id, title: job.title }} />
          </div>
        </div>
      </section>
    </>
  );
}
