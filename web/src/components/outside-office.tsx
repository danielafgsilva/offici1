import { PhotoSlider } from "@/components/photo-slider";
import type { SitePhoto } from "@/components/site-photo";
import { urlFor } from "@/sanity/image";

// The firm outside the office: a headline across the page, then the team's photographs in one large, slightly
// tilted frame, each with its caption. Takes any number of photographs; with more than one they can be swiped.
export function OutsideOffice({ photos }: { photos: SitePhoto[] }) {
  const slides = photos
    .filter((photo) => photo.asset)
    .map((photo) => ({
      // A photograph marked "whole" keeps its own shape; the others are cropped to the card
      src: (photo.whole ? urlFor(photo).width(1600).fit("max") : urlFor(photo).width(1600).height(1200).fit("crop")).url(),
      alt: photo.alt ?? "",
      whole: Boolean(photo.whole),
    }));
  if (slides.length === 0) return null;

  return (
    <section aria-labelledby="fora" className="container-page section">
      <h2 id="fora" className="max-w-[24ch] text-display lg:max-w-none">
        Fora do gabinete, somos a mesma equipa.
      </h2>
      <p className="measure mt-5 text-lead">Trabalhamos juntos todos os dias e gostamos de nos encontrar fora do gabinete.</p>
      <div className="mt-12 pb-6 lg:mt-16 lg:ml-auto lg:w-10/12">
        <PhotoSlider slides={slides} />
      </div>
    </section>
  );
}
