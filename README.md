# Offici'um

Website of **Offici'um – Contabilidade e Consultoria, Lda.**, an accounting firm in Vila Nova de Gaia (Portugal), in Portuguese (pt-PT). The office edits all content itself in a Sanity Studio; the site reads it and stays fast and static.

> **Status: first draft.** Structure, design, forms and tests are in place. Much of the content (team details, clients, testimonials, history milestones) is example text, clearly labelled on the page and in the Studio as *"Exemplo, por confirmar"*, until the office supplies the real facts.

## Contents

- [Stack](#stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Content model](#content-model)
- [How it works](#how-it-works)
- [Testing and quality](#testing-and-quality)
- [Deployment](#deployment)
- [Conventions](#conventions)
- [Known gaps](#known-gaps)
- [License](#license)

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript), Turbopack |
| Styling | Tailwind CSS 4; design tokens and a few custom utilities in `web/src/app/globals.css` |
| Content | Sanity (project `cdj6b9v2`, dataset `production`), queried with GROQ via `next-sanity`; types generated with TypeGen |
| Motion | CSS (scroll-driven animations, keyframes) first; Motion (`motion/react`) only where state or scroll position is needed |
| UI primitives | Base UI Select (accessible dropdown), Phosphor icons |
| Email | Resend, from server actions only |
| Tests | Playwright against the production build |
| Hosting | Vercel (site), `sanity.studio` (Studio) |

## Repository layout

```
.
├── web/                      Public site (Next.js)
│   ├── src/app/              Routes: home, servicos, sobre-nos, equipa, carreiras, contactos, ...
│   ├── src/components/       Shared components; home/ holds the home page sections
│   ├── src/lib/              Small helpers: form parsing, upload validation, site constants
│   ├── src/sanity/           Client, GROQ queries, settings and SEO helpers
│   ├── e2e/                  Playwright tests
│   └── sanity.types.ts       Generated: do not edit by hand
├── studio/                   Sanity Studio
│   └── schemaTypes/          Content schemas
├── docs/                     Notes for the office (e.g. photography plan)
└── .claude/, .agents/        Design and review skills used while building (not part of the product)
```

## Getting started

Requires **Node.js 22.12 or newer**.

```bash
# the site
cd web
cp .env.example .env.local     # then fill it in (see below)
npm install
npm run dev                    # http://localhost:3000

# the Studio (separate terminal)
cd studio
npm install
npm run dev                    # http://localhost:3333
```

Both apps have their own `package.json`; there is no root-level workspace. If a port is busy, Next.js and Sanity pick the next free one and print it.

## Environment variables

Set in `web/.env.local` locally and in the Vercel project for production. Only `web/` reads them; the Studio needs none.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | Sanity project id (`cdj6b9v2`) |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Dataset (`production`) |
| `NEXT_PUBLIC_SITE_URL` | yes in production | Public address, no trailing slash. Used for canonical URLs, sitemap, structured data |
| `RESEND_API_KEY` | for forms | Server-side key; forms fall back to a "write to us" message without it |
| `CONTACT_FROM_EMAIL` | for forms | Sender on a domain verified in Resend, e.g. `Offici'um <site@offici1.pt>` |
| `CONTACT_TO_EMAIL` | optional | Where contact requests go (defaults to the address in site settings) |
| `CAREERS_TO_EMAIL` | optional | Where applications go (defaults to the contact address) |

Never commit `.env.local` (it is ignored). The site only reads public Sanity data, so no Sanity token is needed here.

## Content model

Editors work in the Studio; each document type is a Studio section.

- **Singletons:** home page, about page, and contacts and settings (phone, email, address, hours, SEO).
- **Collections:** services, team members, team moments (photographs), history milestones, clients, testimonials, job openings, FAQ.
- **Verified switch:** history milestones, team members, clients and testimonials carry a `verified` flag. While it is off, the page shows an *"Exemplo, por confirmar"* marker. Switch it on once the facts are confirmed.
- **Limits are in the schema:** for example, a milestone text warns above 300 characters and a testimonial is capped at 280.

After changing a schema in `studio/schemaTypes` or a query in `web/src/sanity/queries.ts`:

```bash
cd studio && npm run typegen     # regenerates web/sanity.types.ts
```

## How it works

- **Static with revalidation.** Pages are rendered statically and re-fetch Sanity at most once a minute, so a published edit shows up within about a minute with no redeploy.
- **Forms are server actions** (`app/contactos`, `app/carreiras`). They validate every field again on the server and return typed errors that the form shows next to each field. A hidden honeypot field catches simple bots. Nothing the visitor types is ever sent as HTML.
- **File uploads** (CVs, contact documents) go through one validator, `src/lib/upload.ts`: size, file name, declared type, extension and the file's real signature bytes; PDFs are also scanned for script features. Files are emailed, never stored or opened by the site, and never put in Sanity.
- **Cookies and maps.** The Google map loads only after the visitor accepts it; otherwise a link and the written address are shown.
- **SEO.** Metadata per page, `sitemap.xml` (including open vacancies), `robots.txt`, `llms.txt`, Open Graph image, and JSON-LD for the firm, services, breadcrumbs and job postings.
- **Motion rules.** Decorative motion uses `transform` and `opacity`; scroll-linked effects use CSS scroll timelines where supported and show the final state elsewhere. `prefers-reduced-motion` removes entrances and stops moving rows, and hover effects apply only to devices with a pointer. The first-visit intro (drawn from the logo) runs once per session and a click or key skips it.
- **Navigation.** The bar arrives on scroll; the menu button is always available on phones and tablets.

## Testing and quality

```bash
cd web
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e        # builds, then runs Playwright against the production build on port 3200
```

First time: `npx playwright install chromium`.

The Playwright suite (87 tests) covers every route at six widths (no console errors, no horizontal overflow, one `h1`), navigation and the mobile menu, keyboard paths and focus, form validation including server-side upload checks, reduced motion, cookies and consent, and the careers flow. Run `npm run test:e2e` after changing a route or a form.

## Deployment

- **Site:** a Vercel project connected to this repository with **Root Directory `web`** and the Next.js preset. Add the environment variables above. Every push to `main` deploys.
- **Studio:** `cd studio && npm run deploy` publishes it to `https://<hostname>.sanity.studio` (it does not run on Vercel). Re-run after changing schemas.
- **CORS:** in sanity.io/manage → API → CORS origins, add the Studio address with credentials allowed.
- **Contact email:** verify the sending domain in Resend before going live, then set the three email variables.

## Conventions

- Portuguese (pt-PT) for everything visitors see; code, comments and commit messages in English.
- One typeface (Montserrat), a navy and pale-blue palette, pill buttons and generously rounded surfaces; tokens live in `@theme` in `globals.css`. Add a token or utility only when a second real use appears.
- Prefer a native platform feature or an existing dependency to new code; keep components small and server-rendered unless they need state.
- Commits: short imperative subject, body explaining *why*; keep the working tree green (`lint`, `tsc`, tests) before pushing.

## Known gaps

- Real portraits, client logos, testimonials and history facts are pending; example data is marked as such.
- Two team photographs include minors; confirm guardians' consent or remove them in the Studio (*Momentos da equipa*).
- Production email needs a verified Resend domain and key.
- The menu, intro and card animations have been checked in desktop browsers and in automated tests, not yet on a range of real phones.
- Accessibility has been reviewed by hand and by tests (WCAG 2.2 AA is the target); a full audit with an assistive-technology pass is still to do.

## License

MIT. See [LICENSE](LICENSE).
