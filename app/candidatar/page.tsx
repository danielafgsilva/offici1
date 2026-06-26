import type { Metadata } from "next";
import { ApplyView } from "./ApplyView";

export const metadata: Metadata = {
  title: "Enviar Candidatura",
  description:
    "Preencha o formulário e envie o seu CV. Analisaremos com atenção a sua candidatura à equipa da Offici'um.",
};

export default function ApplyPage() {
  return <ApplyView />;
}
