import { ArrowButton } from "@/components/arrow-button";

// The invitation to join: the question and a sentence on the left, the one action on the right.
export function Careers() {
  return (
    <section className="bg-sand section">
      <div className="container-page grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-8">
          <h2 className="max-w-[16ch] text-display">Quer fazer parte da equipa?</h2>
          <p className="measure mt-6 text-lead">
            Veja as vagas em aberto ou envie-nos uma candidatura espontânea. Gostamos de conhecer quem quer trabalhar connosco.
          </p>
        </div>
        <div className="flex lg:col-span-4 lg:justify-end">
          <ArrowButton href="/carreiras" label="Ver carreiras" tone="navy" />
        </div>
      </div>
    </section>
  );
}
