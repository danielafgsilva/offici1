"use client";

// Last resort: replaces the whole document when the root layout itself fails, so it cannot
// rely on the site's header, fonts or stylesheet. Plain links only: the router may be unavailable.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-PT">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#faf8f4",
          color: "#3a4658",
        }}
      >
        <main style={{ maxWidth: "36rem" }}>
          <h1 style={{ color: "#1a365d", fontSize: "2rem", margin: 0 }}>Algo correu mal.</h1>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.6 }}>
            O site está temporariamente indisponível. Tente novamente dentro de momentos.
          </p>
          <p style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                minHeight: "3rem",
                padding: "0 1.375rem",
                border: 0,
                borderRadius: "0.25rem",
                background: "#0b6cb0",
                color: "white",
                font: "inherit",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tentar novamente
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the router may be unavailable here */}
            <a href="/" style={{ color: "#0b6cb0", fontWeight: 600 }}>
              Página inicial
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
