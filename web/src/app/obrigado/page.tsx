import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/sanity/settings";

// Reached only after a successful contact request; kept out of search results and the sitemap.
export const metadata: Metadata = {
  title: "Pedido recebido",
  robots: { index: false, follow: true },
};

export default async function ThankYouPage() {
  const settings = await getSettings();

  return (
    <section className="container-page page-top">
      <p className="eyebrow">Pedido recebido</p>
      <h1 className="mt-4 text-h1">Obrigado. Recebemos o seu pedido.</h1>
      <div className="measure mt-6 space-y-4 text-lead">
        <p>
          A sua mensagem chegou ao nosso email. Alguém da equipa vai lê-la e entrar em contacto consigo,
          pelo email ou pelo telefone que indicou.
        </p>
        <p>
          Se o assunto for urgente, ligue{" "}
          <a href={settings.phone.href} className="link">
            {settings.phone.label}
          </a>
          {settings.hours && ` (${settings.hours.charAt(0).toLowerCase()}${settings.hours.slice(1)})`}.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/servicos" className="btn btn-primary">
          Ver serviços
        </Link>
        <Link href="/equipa" className="link tap">
          Conheça a equipa
        </Link>
        <Link href="/" className="link tap">
          Página inicial
        </Link>
      </div>
    </section>
  );
}
