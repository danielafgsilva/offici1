import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/Toast";
import { Preloader } from "./components/Preloader";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.offici1.pt"),
  title: {
    default: "Offici'um — Contabilidade e Consultoria",
    template: "%s | Offici'um",
  },
  description:
    "Há mais de 20 anos a servir empresas com contabilidade, gestão fiscal e consultoria de excelência. Vila Nova de Gaia, Portugal.",
  keywords: [
    "contabilidade",
    "consultoria",
    "gestão fiscal",
    "recursos humanos",
    "abertura de empresas",
    "Vila Nova de Gaia",
    "Portugal",
  ],
  openGraph: {
    title: "Offici'um — Contabilidade e Consultoria",
    description:
      "Contabilidade, gestão fiscal e consultoria empresarial de excelência há mais de 20 anos.",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${lexend.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink-900">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar para o conteúdo
        </a>
        <Preloader />
        <Header />
        <main id="conteudo" className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
