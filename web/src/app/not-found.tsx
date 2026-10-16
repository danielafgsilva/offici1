import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page page-top">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-4 text-h1">Não encontrámos esta página.</h1>
      <p className="measure mt-6 text-lead">
        O endereço pode ter mudado ou já não existir. Estes caminhos levam-no ao que procura.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/" className="btn btn-primary">
          Página inicial
        </Link>
        <Link href="/servicos" className="btn btn-secondary">
          Serviços
        </Link>
        <Link href="/contactos" className="btn btn-secondary">
          Contactos
        </Link>
      </div>
    </section>
  );
}
