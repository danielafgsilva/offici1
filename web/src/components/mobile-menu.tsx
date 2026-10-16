"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { isCurrentPage, navigation } from "@/lib/site";

type Props = { phone: { label: string; href: string }; hours: string | null };

export function MobileMenu({ phone, hours }: Props) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      {/* Always on screen (below the desktop width), whether or not the bar has arrived: it is the way to every page */}
      <button
        type="button"
        className="menu-fab fixed top-2 right-[clamp(1.25rem,4vw,2.5rem)] z-50 flex size-12 items-center justify-center rounded-full bg-paper/75 text-navy shadow-[0_8px_24px_rgb(26_54_93/0.16)] backdrop-blur-md transition-transform duration-150 ease-(--ease-out) active:scale-[0.95]"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <span className="sr-only">Abrir menu</span>
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Native dialog: focus trap, Esc and backdrop come from the browser */}
      <dialog
        ref={dialog}
        aria-label="Menu"
        className="mobile-menu"
        onClick={(event) => {
          // Close on backdrop click and after following any link
          if (
            event.target === event.currentTarget ||
            (event.target as HTMLElement).closest("a")
          ) {
            dialog.current?.close();
          }
        }}
      >
        <div className="flex min-h-full flex-col px-6 pb-8">
          <div className="flex h-16 items-center justify-between">
            <span className="text-lg font-semibold text-navy">Menu</span>
            <button
              type="button"
              className="-mr-2 flex size-12 items-center justify-center text-navy"
              onClick={() => dialog.current?.close()}
            >
              <span className="sr-only">Fechar menu</span>
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Principal">
            {/* The pages set large, arriving one after the other as the panel opens */}
            <ul className="mt-6">
              {navigation.map(({ href, label }, index) => (
                <li
                  key={href}
                  className="rise-quick"
                  style={{ animationDelay: `${60 + index * 40}ms` }}
                >
                  <Link
                    href={href}
                    aria-current={
                      isCurrentPage(pathname, href) ? "page" : undefined
                    }
                    className="flex min-h-16 items-center font-display text-[2.5rem] leading-none font-medium tracking-tight text-navy decoration-[0.06em] underline-offset-[0.14em] hover:underline aria-[current=page]:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-4 pt-10">
            <Link href="/contactos" className="btn btn-primary w-full">
              Marque uma reunião
            </Link>
            <a href={phone.href} className="btn btn-secondary w-full">
              Ligar {phone.label}
            </a>
            {hours && <p className="text-center text-sm text-muted">{hours}</p>}
          </div>
        </div>
      </dialog>
    </>
  );
}
