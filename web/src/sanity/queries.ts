import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0]{ phone, mobile, email, address, openingHours, seoDescription, socialImage }`,
);

export const HOME_QUERY = defineQuery(
  `*[_type == "homePage" && _id == "homePage"][0]{ heroTitle, heroText, ctaTitle, ctaText, seo }`,
);

export const ABOUT_QUERY = defineQuery(
  `*[_type == "aboutPage" && _id == "aboutPage"][0]{ title, intro, principles[]{ _key, title, text }, continuity[]{ _key, subject, statement }, seo }`,
);

export const HISTORY_QUERY = defineQuery(
  `*[_type == "historyMilestone"] | order(order asc){ _id, year, kind, verified, title, description, image{ alt, asset, hotspot, crop, "ratio": asset->metadata.dimensions.aspectRatio } }`,
);

export const SERVICES_QUERY = defineQuery(
  `*[_type == "service" && defined(slug.current)] | order(order asc){ _id, title, "slug": slug.current, icon, summary, audience }`,
);

export const SERVICES_PAGE_QUERY = defineQuery(
  `*[_type == "service" && defined(slug.current)] | order(order asc){ _id, title, "slug": slug.current, icon, summary, description, audience, problem, includes }`,
);

export const SERVICE_QUERY = defineQuery(
  `*[_type == "service" && slug.current == $slug][0]{
    _id, title, summary, description, audience, problem, includes, seo,
    related[]->{ _id, title, "slug": slug.current, summary }
  }`,
);

export const SITEMAP_QUERY = defineQuery(
  `{
    "home": *[_id == "homePage"][0]._updatedAt,
    "about": *[_id == "aboutPage"][0]._updatedAt,
    "services": *[_type == "service" && defined(slug.current)] | order(order asc){ "slug": slug.current, _updatedAt },
    "jobs": *[_type == "jobOpening"] | order(_updatedAt desc)[0]._updatedAt,
    "jobPages": *[_type == "jobOpening" && status == "open" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
  }`,
);

export const TEAM_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc){ _id, name, verified, role, qualification, photo, bio, since, speciality, background, quote, answers[]{ _key, question, answer }, personalNote }`,
);

export const TEAM_MOMENTS_QUERY = defineQuery(
  `*[_type == "teamMoment"] | order(order asc){ _id, title, year, category, description, images[]{ _key, alt, whole, asset, hotspot, crop, "ratio": asset->metadata.dimensions.aspectRatio } }`,
);

export const OPEN_JOBS_QUERY = defineQuery(
  // A vacancy past its closing date disappears on its own
  `*[_type == "jobOpening" && status == "open" && (!defined(closingDate) || closingDate >= string::split(string(now()), "T")[0])] | order(order asc){
    _id, _createdAt, title, "slug": slug.current, publishedAt, contractType, location, workModel, closingDate, summary, description, responsibilities, requirements, offer
  }`,
);

export const OPEN_JOB_QUERY = defineQuery(
  `*[_type == "jobOpening" && slug.current == $slug && status == "open" && (!defined(closingDate) || closingDate >= string::split(string(now()), "T")[0])][0]{
    _id, _createdAt, title, "slug": slug.current, publishedAt, contractType, location, workModel, closingDate, summary, description, responsibilities, requirements, offer
  }`,
);

export const CLIENTS_QUERY = defineQuery(
  `*[_type == "client"] | order(order asc){ _id, name, sector, verified, logo }`,
);

export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonial"] | order(order asc){ _id, quote, author, company, verified, photo }`,
);

// Only what a page needs from the team: how many people, and their names
export const TEAM_COUNT_QUERY = defineQuery(`count(*[_type == "teamMember"])`);
export const TEAM_NAMES_QUERY = defineQuery(`*[_type == "teamMember"] | order(order asc).name`);

export const FAQ_QUERY = defineQuery(
  `*[_type == "faq"] | order(order asc){ _id, question, answer }`,
);
