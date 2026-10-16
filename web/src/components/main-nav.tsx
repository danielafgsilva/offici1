"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isCurrentPage, navigation } from "@/lib/site";

export function MainNav() {
  const pathname = usePathname();
  const isCurrent = (href: string) => isCurrentPage(pathname, href);

  return (
    <nav aria-label="Principal" className="hidden xl:block">
      <ul className="flex items-center gap-8">
        {navigation.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              className="nav-link"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
