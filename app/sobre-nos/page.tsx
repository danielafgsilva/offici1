import type { Metadata } from "next";
import { AboutView } from "./AboutView";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça a história, os valores e a equipa que fazem da Offici'um uma referência em contabilidade e consultoria em Portugal.",
};

export default function AboutPage() {
  return <AboutView />;
}
