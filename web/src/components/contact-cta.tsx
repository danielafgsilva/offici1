import { ArrowButton } from "@/components/arrow-button";
import { getHomePage } from "@/sanity/settings";

type Props = { title?: string; text?: string };

// The close of a page: an invitation and one button, which leads to the request form on the contacts page.
// Without props, shows the title and text set in "Página inicial" in the Studio.
export async function ContactCta({ title, text }: Props) {
  const home = title ? null : await getHomePage();

  return (
    <section className="bg-[#dbe8f4] text-navy">
      <div className="container-page section-lg grid gap-x-10 gap-y-8 lg:grid-cols-12 lg:items-center">
        <div className="order-last flex lg:order-first lg:col-span-4 lg:justify-start">
          <ArrowButton href="/contactos#formulario" label="Marque uma reunião" tone="white" />
        </div>
        <div className="lg:col-span-8">
          <h2 className="max-w-[18ch] text-display text-navy">{title ?? home?.ctaTitle}</h2>
          <p className="measure mt-6 text-lead">{text ?? home?.ctaText}</p>
        </div>
      </div>
    </section>
  );
}
