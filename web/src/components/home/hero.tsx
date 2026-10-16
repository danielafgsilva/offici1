import Image from "next/image";
import Link from "next/link";
import { RisingWords } from "@/components/rising-words";

type Props = { title: string | null; text: string | null };

// The supplied desk photograph, pale and nearly colourless, the headline, one action. The glass button blurs the photograph behind it.
export function Hero({ title, text }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-[#c2d9ef] text-navy">
      <div className="relative flex min-h-[max(36rem,100dvh)] flex-col justify-end">
        {/* The supplied photograph, left in its own greys with only a breath of blue: multiplied over a very pale blue, and a paper veil from the bottom for the type */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#c2d9ef]">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_6%] mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#1d4f88]/85 via-[#1d4f88]/35 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_90%_0%,rgb(0_144_217/0.1),transparent)]" />
        </div>

        <div className="container-page pt-32 pb-14 lg:pb-24">
          <RisingWords
            text={title}
            className="max-w-[11em] text-[clamp(2.5rem,0.8rem+6.2vw,6.5rem)] leading-[0.98] font-semibold text-white lg:max-w-none lg:text-[clamp(3rem,5.3vw,5.5rem)]"
          />
          <p className="mt-6 max-w-[38ch] text-lead text-white">{text}</p>
          <div className="mt-9">
            <Link href="/contactos" className="btn btn-frost w-full sm:w-auto">
              Marque uma reunião
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
