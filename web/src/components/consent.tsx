"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

/*
 * Consent for the one thing on this site that sets third-party cookies: the Google map on
 * the contact page. The choice is kept in this browser only (localStorage, not a cookie)
 * and nothing from Google is requested until the visitor accepts.
 */
type Choice = "accepted" | "refused" | null;
const KEY = "cookies";
const CHANGED = "cookies-changed";

function read(): Choice {
  try {
    const value = localStorage.getItem(KEY);
    return value === "accepted" || value === "refused" ? value : null;
  } catch {
    return null; // storage blocked: ask again on each visit, and load nothing meanwhile
  }
}

function choose(choice: Choice) {
  try {
    if (choice) localStorage.setItem(KEY, choice);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(CHANGED));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// "pending" on the server and until the browser has read the stored choice: nothing is shown or loaded
const useChoice = () => useSyncExternalStore<Choice | "pending">(subscribe, read, () => "pending");

export function CookieBanner() {
  const choice = useChoice();
  if (choice !== null) return null;

  return (
    <section
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper shadow-[0_-8px_24px_rgb(26_54_93/0.08)]"
    >
      <div className="container-page flex flex-col gap-x-8 gap-y-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="measure text-sm">
          Este site só usa cookies de terceiros para mostrar o mapa do Google na página de contactos. Sem a sua
          autorização, o mapa não é carregado.{" "}
          <Link href="/politica-de-privacidade#cookies" className="link">
            Saber mais
          </Link>
        </p>
        {/* Two equal choices: refusing is as easy as accepting */}
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => choose("refused")} className="btn btn-secondary flex-1 lg:flex-none">
            Recusar
          </button>
          <button type="button" onClick={() => choose("accepted")} className="btn btn-secondary flex-1 lg:flex-none">
            Aceitar
          </button>
        </div>
      </div>
    </section>
  );
}

// Footer link: forgets the choice, which brings the banner back
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => choose(null)} className={className}>
      Cookies
    </button>
  );
}

export function ConsentMap({ query, mapsUrl, shape = "aspect-[4/3]" }: { query: string; mapsUrl: string; shape?: string }) {
  const choice = useChoice();

  if (choice === "accepted") {
    return (
      <iframe
        title="Mapa com a localização do gabinete"
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&hl=pt-PT&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`${shape} w-full rounded-[2rem] border-0`}
      />
    );
  }

  return (
    <div className={`flex ${shape} flex-col items-start justify-end gap-3 rounded-[2rem] bg-[#cfe0f0] p-6`}>
      <p className="text-sm text-ink">O mapa é do Google Maps e usa cookies do Google.</p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <button type="button" onClick={() => choose("accepted")} className="btn btn-secondary">
          Aceitar e mostrar o mapa
        </button>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="link tap">
          Abrir no Google Maps <span className="sr-only">(abre num novo separador)</span>
        </a>
      </div>
    </div>
  );
}
