import type { Metadata } from "next";
import type { Seo } from "../../sanity.types";
import { urlFor } from "./image";
import { getSettings } from "./settings";

const defaultTitle = "Offici'um — Contabilidade e Consultoria em Vila Nova de Gaia";

type Page = {
  /** Canonical path, e.g. "/servicos". Omit for pages that should not declare one. */
  path?: string;
  title?: string | null;
  description?: string | null;
};

// Search results cut descriptions at about 160 characters; end fallback text at a word instead.
function shorten(text?: string | null) {
  if (!text || text.length <= 158) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

// Page metadata with fallbacks: the page's SEO fields, then its own title and text, then the site defaults.
export async function seoMetadata(seo: Seo | null | undefined, page: Page): Promise<Metadata> {
  const settings = await getSettings();
  const title = seo?.title || page.title;
  const description = seo?.description || shorten(page.description) || settings.seoDescription;
  const image = seo?.image?.asset ? seo.image : settings.socialImage?.asset ? settings.socialImage : null;

  return {
    // Without a title the root layout's default applies
    ...(title ? { title } : {}),
    description,
    ...(page.path ? { alternates: { canonical: page.path } } : {}),
    // A page's openGraph replaces the layout's entirely, so the shared fields are repeated here
    openGraph: {
      title: title ?? defaultTitle,
      description,
      url: page.path,
      siteName: "Offici'um",
      locale: "pt_PT",
      type: "website",
      images: [
        {
          // Generated brand image until a real one is uploaded in the Studio
          url: image ? urlFor(image).width(1200).height(630).fit("crop").url() : "/og",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const titleMetadata = { default: defaultTitle, template: "%s | Offici'um" };
