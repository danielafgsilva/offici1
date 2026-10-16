import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// Default sharing image: brand name and tagline on the brand navy.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#1a365d",
          color: "white",
        }}
      >
        <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -3 }}>{site.name}</div>
        <div style={{ marginTop: 16, fontSize: 44, color: "#cfe6f7" }}>Contabilidade e Consultoria</div>
        <div style={{ marginTop: 56, width: 120, height: 6, background: "#0090d9" }} />
        <div style={{ marginTop: 32, fontSize: 32, color: "#cfe6f7" }}>Vila Nova de Gaia</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
