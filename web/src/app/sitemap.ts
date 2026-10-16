import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { client, fetchOptions } from "@/sanity/client";
import { SITEMAP_QUERY } from "@/sanity/queries";

// lastModified comes from Sanity's own timestamps; pages without CMS content declare none.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { home, about, services, jobs, jobPages } = await client.fetch(SITEMAP_QUERY, {}, fetchOptions);
  const latestService = services.map((service) => service._updatedAt).sort().at(-1);

  return [
    { url: siteUrl, lastModified: home ?? undefined },
    { url: `${siteUrl}/servicos`, lastModified: latestService },
    ...services.map((service) => ({
      url: `${siteUrl}/servicos/${service.slug}`,
      lastModified: service._updatedAt,
    })),
    { url: `${siteUrl}/sobre-nos`, lastModified: about ?? undefined },
    { url: `${siteUrl}/equipa`, lastModified: about ?? undefined },
    { url: `${siteUrl}/carreiras`, lastModified: jobs ?? undefined },
    ...jobPages.map(({ slug, _updatedAt }) => ({ url: `${siteUrl}/carreiras/${slug}`, lastModified: _updatedAt })),
    { url: `${siteUrl}/contactos` },
    // The privacy policy is added here once its review is finished and it stops being noindex
  ];
}
