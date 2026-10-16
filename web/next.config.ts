import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site is never meant to be embedded in another page
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The careers form carries a CV (3 MB at most, checked again in the action). Vercel refuses bodies over 4.5 MB.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  images: {
    // Only this project's Sanity images may be optimised
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**` },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
