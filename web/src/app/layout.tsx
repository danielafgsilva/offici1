import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { CookieBanner } from "@/components/consent";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Intro } from "@/components/intro";
import { introScript } from "@/lib/intro-script";
import { siteUrl } from "@/lib/site";
import { seoMetadata, titleMetadata } from "@/sanity/seo";
import "./globals.css";

// The family of the logo's lettering: one typeface, with the voice carried by size and weight
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return { ...(await seoMetadata(null, {})), metadataBase: new URL(siteUrl), title: titleMetadata };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-PT" suppressHydrationWarning className={`${montserrat.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Intro />
        <a href="#conteudo" className="btn btn-primary sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50">
          Saltar para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
