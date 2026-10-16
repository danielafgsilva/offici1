import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/lib/site";
import { seoMetadata } from "@/sanity/seo";
import { getSettings } from "@/sanity/settings";

// While true, the page shows a draft notice and the points awaiting confirmation, and stays
// out of search results. Set to false only after the firm (or its legal adviser) has reviewed
// the text and every <Review> note has been replaced with the confirmed information.
const REVIEW_PENDING = true;

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await seoMetadata(null, {
    path: "/politica-de-privacidade",
    title: "Política de privacidade",
    description:
      "Como a Offici'um trata os dados pessoais enviados através do formulário de contacto deste site.",
  });
  return REVIEW_PENDING ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}

function Review({ children }: { children: ReactNode }) {
  if (!REVIEW_PENDING) return null;
  return (
    <p className="rounded-sm border border-error/40 bg-error/5 p-4 text-sm text-error">
      <strong>A confirmar pelo gabinete:</strong> {children}
    </p>
  );
}

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <article className="container-page page-top">
      <Breadcrumbs items={[{ label: "Política de privacidade", href: "/politica-de-privacidade" }]} />
      <h1 className="mt-4 text-h1">Política de privacidade</h1>

      <div className="measure mt-8 space-y-4 [&_h2]:mt-12 [&_h2]:text-[1.625rem] [&_h2]:leading-tight [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {REVIEW_PENDING && (
          <p className="rounded-sm border border-error/40 bg-error/5 p-4 font-medium text-error">
            Rascunho em revisão. Este texto descreve o funcionamento técnico do site, mas ainda não foi
            validado juridicamente e não deve ser publicado assim.
          </p>
        )}

        <h2>Quem é responsável pelos seus dados</h2>
        <p>
          {site.legalName}, NIF {site.nif}, com sede em {settings.address.join(", ")}.
        </p>
        <p>
          Para qualquer questão sobre os seus dados pessoais, escreva para{" "}
          <a href={`mailto:${settings.email}`} className="link">
            {settings.email}
          </a>{" "}
          ou ligue {settings.phone.label}.
        </p>

        <h2>Que dados recolhemos neste site</h2>
        <p>Apenas os que nos envia através do formulário de contacto:</p>
        <ul>
          <li>nome;</li>
          <li>empresa (opcional);</li>
          <li>email;</li>
          <li>telefone (opcional);</li>
          <li>a mensagem que escrever.</li>
        </ul>
        <p>Se nos enviar uma candidatura através do formulário da página Carreiras, recebemos:</p>
        <ul>
          <li>nome, email e telefone (opcional);</li>
          <li>a vaga a que se candidata e a mensagem que escrever (opcional);</li>
          <li>o seu currículo, em PDF, e os dados que esse documento contiver.</li>
        </ul>
        <p>
          O currículo é entregue por email na caixa do gabinete. O site não guarda cópia da candidatura nem
          do ficheiro.
        </p>

        <h2>Para que os usamos</h2>
        <p>Para responder ao seu pedido de contacto.</p>
        <p>
          As candidaturas são usadas apenas para avaliar o seu perfil para a vaga indicada ou, numa
          candidatura espontânea, para oportunidades no gabinete, com a autorização que dá ao enviar o
          formulário.
        </p>
        <Review>
          o fundamento jurídico do tratamento (artigo 6.º do RGPD) e se os dados são usados para alguma
          outra finalidade, por exemplo contactos posteriores.
        </Review>

        <h2>Durante quanto tempo os guardamos</h2>
        <Review>
          o prazo de conservação das mensagens recebidas pelo formulário e das candidaturas e currículos recebidos
          (incluindo se as candidaturas espontâneas são conservadas para vagas futuras, e por quanto tempo). O site não guarda cópia das mensagens: são entregues por email na caixa do gabinete.
        </Review>

        <h2>Quem tem acesso</h2>
        <p>A equipa da Offici&apos;um.</p>
        <p>O site recorre a prestadores de serviços técnicos para funcionar:</p>
        <ul>
          <li>um serviço de envio de email, que entrega as mensagens e as candidaturas na caixa do gabinete;</li>
          <li>um serviço de alojamento, que disponibiliza o site;</li>
          <li>um serviço de gestão de conteúdos, onde estão os textos e as imagens do site.</li>
        </ul>
        <Review>
          a identificação destes prestadores, os respetivos contratos de subcontratação e se algum trata
          dados fora do Espaço Económico Europeu. Tecnicamente, o site está preparado para usar a Resend
          (envio de email), a Sanity (conteúdos) e a Vercel (alojamento). Falta também indicar o fornecedor
          da caixa de email do gabinete.
        </Review>

        <h2 id="cookies">Cookies e ferramentas de medição</h2>
        <p>
          Este site não tem cookies próprios, nem ferramentas de estatística ou de publicidade, e não carrega
          conteúdos de redes sociais.
        </p>
        <p>
          A única exceção é o mapa da página de contactos, fornecido pelo Google Maps. Ao ser mostrado, o
          Google pode guardar cookies no seu dispositivo e recebe o seu endereço IP. Por isso o mapa só é
          carregado depois de aceitar, no aviso de cookies ou no próprio mapa. Se recusar, o site funciona
          da mesma forma e pode abrir a morada diretamente no Google Maps.
        </p>
        <p>
          A sua escolha fica guardada apenas neste navegador. Pode alterá-la em qualquer momento na ligação
          «Cookies», no fundo de cada página.
        </p>
        <p>
          A ligação para o Livro de Reclamações abre um site externo, que tem a sua própria política de
          privacidade.
        </p>

        <h2>Os seus direitos</h2>
        <p>
          Nos termos do Regulamento Geral sobre a Proteção de Dados, pode pedir o acesso aos seus dados, a
          sua retificação ou o seu apagamento, a limitação do tratamento ou opor-se a ele. Para o fazer,
          use os contactos indicados acima.
        </p>
        <p>
          Tem também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).
        </p>
        <Review>se o gabinete tem um encarregado de proteção de dados e qual o seu contacto.</Review>
      </div>
    </article>
  );
}
