import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-10-02",
  // Pages are built statically, so query the live API: the CDN can serve stale results at build time.
  useCdn: false,
});

// Pages are static; edits made in the Studio appear within a minute.
export const fetchOptions = { next: { revalidate: 60 } };
