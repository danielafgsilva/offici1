"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown when a page fails to render. Visitors see no technical detail; the full error
// stays in the server logs, matched by error.digest.
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <section className="container-page page-top">
      <p className="eyebrow">Erro</p>
      <h1 className="mt-4 text-h1">Algo correu mal.</h1>
      <p className="measure mt-6 text-lead">
        Não foi possível mostrar esta página. Tente novamente; se o problema continuar, fale connosco pelos
        contactos habituais.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Tentar novamente
        </button>
        <Link href="/" className="btn btn-secondary">
          Página inicial
        </Link>
      </div>
    </section>
  );
}
