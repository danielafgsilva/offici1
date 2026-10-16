# Offici'um — website

Website of Offici'um – Contabilidade e Consultoria, Lda. (Vila Nova de Gaia).

- `web/` — the public site: Next.js (App Router), TypeScript, Tailwind CSS.
- `studio/` — Sanity Studio, where the office edits content (project `cdj6b9v2`, dataset `production`).

## Running locally

Requires Node.js 22.12 or newer.

```bash
cd web && npm install && npm run dev      # http://localhost:3000
cd studio && npm install && npm run dev   # http://localhost:3333
```

Copy `web/.env.example` to `web/.env.local` and fill in the values. The contact form only sends
email when `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are set.

## Content

Editable content lives in Sanity: homepage, about page, services, team, job openings, FAQ and
contact details. Published changes appear on the site within about a minute.

After changing a schema in `studio/schemaTypes` or a query in `web/src/sanity/queries.ts`, run
`npm run typegen` in `studio/` to regenerate `web/sanity.types.ts`.

## Checks

```bash
cd web && npm run lint && npx tsc --noEmit && npm run build
cd web && npm run test:e2e   # browser tests (Playwright) against the production build
```

The first time, install the test browser with `npx playwright install chromium`.
