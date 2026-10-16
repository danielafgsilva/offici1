import Link from "next/link";
import { siteUrl } from "@/lib/site";
import { JsonLd } from "./json-ld";

type Crumb = { label: string; href: string };

// Visible trail plus the matching BreadcrumbList. The last item is the current page.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Início", href: "/" }, ...items];

  return (
    <nav aria-label="Localização" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        {trail.map(({ label, href }, index) => {
          const current = index === trail.length - 1;
          return (
            <li key={href} className="flex items-center gap-x-2">
              {current ? (
                <span aria-current="page">{label}</span>
              ) : (
                <>
                  <Link href={href} className="tap hover:text-navy hover:underline">
                    {label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map(({ label, href }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: label,
            item: `${siteUrl}${href === "/" ? "" : href}`,
          })),
        }}
      />
    </nav>
  );
}
