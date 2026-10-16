import { cache } from "react";
import { client, fetchOptions } from "./client";
import { ABOUT_QUERY, HOME_QUERY, SITE_SETTINGS_QUERY, TEAM_MOMENTS_QUERY } from "./queries";

// The single pages are the only source of this content. If one is missing the build
// fails with a clear message instead of showing stale or invented text.
export function required<T>(document: T | null, name: string): T {
  if (!document) throw new Error(`Falta publicar "${name}" no Sanity Studio.`);
  return document;
}

// "223 710 585" → { label, href: "tel:+351223710585" }
function toPhone(label: string) {
  const digits = label.replace(/\D/g, "");
  return { label, href: `tel:+${digits.length === 9 ? `351${digits}` : digits}` };
}

// cache(): one request per render, however many components ask
export const getSettings = cache(async () => {
  const settings = required(
    await client.fetch(SITE_SETTINGS_QUERY, {}, fetchOptions),
    "Contactos e definições",
  );
  const address = (settings.address ?? "").split("\n").filter(Boolean);
  // "4430-190 Vila Nova de Gaia" → postal code and locality
  const [, postalCode, locality] = address.at(-1)?.match(/^(\d{4}-\d{3})\s+(.+)$/) ?? [];
  // What the map is asked for: street, door number and the last line. Google does not find the
  // address with "n.º", the floor or the room in it. "Av. da República, n.º 872, 1.º andar" → "Av. da República 872"
  const street = (address[0] ?? "").split(",").slice(0, 2).join("").replace(/n\.º\s*/i, "");
  const mapQuery = [street, ...address.slice(1)].join(", ");

  return {
    phone: toPhone(settings.phone ?? ""),
    mobile: settings.mobile ? toPhone(settings.mobile) : null,
    email: settings.email ?? "",
    address,
    postalCode,
    locality,
    mapQuery,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
    hours: settings.openingHours ?? null,
    seoDescription: settings.seoDescription ?? undefined,
    socialImage: settings.socialImage ?? null,
  };
});

export const getHomePage = cache(async () =>
  required(await client.fetch(HOME_QUERY, {}, fetchOptions), "Página inicial"),
);

export const getAboutPage = cache(async () =>
  required(await client.fetch(ABOUT_QUERY, {}, fetchOptions), "Sobre nós"),
);

// Team moments in the order set in the Studio; `photos` is every photograph of every moment, in that order.
export const getTeamMoments = cache(async () => {
  const moments = await client.fetch(TEAM_MOMENTS_QUERY, {}, fetchOptions);
  return { moments, photos: moments.flatMap((moment) => moment.images ?? []) };
});

// Every photograph of the team outside the office, in the order set in the Studio (Momentos da equipa)
export const getTeamPhotos = cache(async () => {
  const { photos } = await getTeamMoments();
  return photos.filter((photo) => photo.asset);
});
