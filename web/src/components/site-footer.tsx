import Link from "next/link";
import { Logo } from "./logo";
import { CookieSettingsButton } from "./consent";
import { navigation, site } from "@/lib/site";
import { getSettings } from "@/sanity/settings";

const link = "decoration-1 underline-offset-4 hover:underline py-0.5 inline-block";
// The legal links sit in a row of their own, so they get a taller touch area
const legal = link.replace("py-0.5", "py-2");

// Navy, so that a page's dark close runs straight into it. The logo with the firm's details beneath it, the pages
// beside them; then the legal links, centred; then the credits.
export async function SiteFooter() {
  const settings = await getSettings();

  return (
    <footer className="bg-navy text-[0.8125rem] leading-relaxed text-offwhite">
      <div className="container-page grid gap-x-10 gap-y-10 py-10 lg:grid-cols-12 lg:py-14">
        <div className="lg:col-span-7">
          <Link href="/" className="inline-block" aria-label="Offici’um, página inicial">
            <Logo onDark className="h-12 w-auto" />
          </Link>
          <address className="mt-5 not-italic">
            <p>
              {settings.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-2 flex flex-col">
              <a href={settings.phone.href} className={`${link} figures w-fit`}>
                {settings.phone.label}
              </a>
              {settings.mobile && (
                <a href={settings.mobile.href} className={`${link} figures w-fit`}>
                  {settings.mobile.label}
                </a>
              )}
              <a href={`mailto:${settings.email}`} className={`${link} w-fit [overflow-wrap:anywhere]`}>
                {settings.email}
              </a>
            </p>
            {settings.hours && <p className="mt-2">{settings.hours}</p>}
          </address>
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-4 lg:col-start-9">
          <ul>
            {navigation.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="text-xs">
        <ul className="container-page flex flex-wrap justify-center gap-x-8 gap-y-1 py-4">
          <li>
            <Link href="/politica-de-privacidade" className={legal}>
              Política de privacidade
            </Link>
          </li>
          <li>
            <CookieSettingsButton className={`${legal} cursor-pointer`} />
          </li>
          <li>
            <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className={legal}>
              Livro de Reclamações <span className="sr-only">(abre num novo separador)</span>
            </a>
          </li>
        </ul>
      </div>

      {/* The credits: quieter than anything above, and on their own line */}
      <div className="bg-navy-dark text-xs text-offwhite/75">
        <div className="container-page flex flex-col gap-x-8 gap-y-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por{" "}
            <a
              href="https://daniela-silva.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-offwhite"
            >
              Daniela Silva<span className="sr-only"> (abre num novo separador)</span>
            </a>{" "}
            e Tiago Santos.
          </p>
        </div>
      </div>
    </footer>
  );
}
