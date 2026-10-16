import {
  BriefcaseIcon,
  ChartLineUpIcon,
  HandshakeIcon,
  LaptopIcon,
  NotebookIcon,
  PercentIcon,
  ReceiptIcon,
  ScalesIcon,
  StorefrontIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

// The one icon family of the site (Phosphor, light weight). The Studio picks a key; if none is set, the slug decides.
const byKey = {
  notebook: NotebookIcon,
  percent: PercentIcon,
  users: UsersThreeIcon,
  storefront: StorefrontIcon,
  chart: ChartLineUpIcon,
  scales: ScalesIcon,
  handshake: HandshakeIcon,
  laptop: LaptopIcon,
  receipt: ReceiptIcon,
  briefcase: BriefcaseIcon,
};

const keyBySlug: Record<string, keyof typeof byKey> = {
  contabilidade: "notebook",
  fiscalidade: "percent",
  "processamento-salarial": "users",
  "constituicao-de-empresas": "storefront",
  "apoio-a-gestao": "chart",
};

export function ServiceIcon({ icon, slug, className }: { icon?: string | null; slug?: string | null; className?: string }) {
  const Glyph = byKey[(icon ?? "") as keyof typeof byKey] ?? byKey[keyBySlug[slug ?? ""] ?? "briefcase"];
  return <Glyph aria-hidden="true" weight="light" className={className} />;
}
