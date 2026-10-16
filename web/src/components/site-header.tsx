import Link from "next/link";
import { getSettings } from "@/sanity/settings";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";

// Not there at the top of a page: it arrives, as transparent glass, once the visitor starts to scroll (see .site-header).
// Keyboard focus inside it brings it into view at any time.
export async function SiteHeader() {
  const { phone, hours } = await getSettings();

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-paper/65 backdrop-blur-md backdrop-saturate-150">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="shrink-0"
            aria-label="Offici’um, página inicial"
          >
            <Logo variant="mark" className="h-9 w-auto" />
          </Link>

          <MainNav />
        </div>
      </header>
      <MobileMenu phone={phone} hours={hours} />
    </>
  );
}
