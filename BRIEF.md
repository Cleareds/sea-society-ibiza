# Sea Society Ibiza by Ibimar — website brief

> Verbatim copy of the client brief delivered on 2026-05-20. Treat this as the source of truth alongside `designs/` (visual reference) and `Engels website sea society presentatie.pdf` (client deck).

You are building a production-grade, mobile-first, luxury B2C website for **Sea Society Ibiza by Ibimar** — a luxury yacht charter broker in Ibiza representing a fleet of 19 boats out of Botafoc Marina. Launch is in 11 days.

## 0. Reference materials in the repo

1. `/Engels website sea society presentatie.pdf` — the official client brief.
2. `/designs/` — visual references. Treat them as authoritative for layout, type hierarchy, color usage, photo treatment, spacing, and component patterns.
3. If boat PDFs exist under `/boats/` or `/content/`, parse them for boat data. If not, use the seed data described below.

Always defer to design references over your own taste. Log every meaningful tradeoff in `DESIGN_DECISIONS.md`.

## 1. Tech stack (non-negotiable)

- Next.js 15, App Router, TypeScript, React Server Components
- Tailwind CSS v4
- shadcn/ui (install only what you use)
- Supabase (DB / Auth / Storage) — scaffold integration, seed with dummy data
- react-hook-form + zod
- lucide-react
- next/font: one elegant serif (Fraunces or Cormorant Garamond) + one clean sans (Inter or Geist) — match `/designs/`
- Deployment: Vercel
- next/image, AVIF + WebP, fully responsive
- Node 20+, pnpm
- No Webflow, no Framer, no headless CMS service. Custom CMS lives in `/app/admin`.

## 2. Rendering strategy

Aggressively favor static and server rendering. `'use client'` only at the leaf of the tree.

| Route | Strategy |
|---|---|
| `/` | SSG + ISR 1h |
| `/fleet` | SSG + ISR 1h |
| `/fleet/[slug]` | SSG with `generateStaticParams`, ISR 1h |
| `/experiences`, `/destinations`, `/about`, `/contact`, `/privacy`, `/terms` | SSG |
| `/admin/*` | Dynamic, server-rendered, auth-gated |
| Enquiry API | Edge runtime where possible |

Interactive bits (filter UI, mobile nav, gallery, sticky WhatsApp) are isolated client components.

## 3. Information architecture

Public:
```
/                          Homepage
/fleet                     Fleet listing with filters
/fleet/[slug]              Boat detail (19 boats)
/experiences               Single page, sectioned
/destinations              Single page covering Ibiza/Formentera/Mallorca
/about                     Brand + Ibimar partnership
/contact                   Contact + FAQ
/privacy
/terms                     (cookie policy included)
/404
/sitemap.xml               Dynamic
/robots.txt                Dynamic
/api/og                    OG image generator via @vercel/og
```

Admin (Phase 2 scaffolding, only Boats CRUD + Enquiries fully working at launch):
```
/admin/login
/admin                     Dashboard with recent enquiries
/admin/boats               Full CRUD
/admin/boats/new
/admin/boats/[id]
/admin/experiences         Stub: "Phase 2"
/admin/destinations        Stub
/admin/faqs                Stub
/admin/enquiries           Functional: list, mark handled, basic filters
/admin/settings            Stub
```

## 4. Design system

Tailwind v4 `@theme` tokens (verify against `/designs/`):

```
--color-ink, --color-cream, --color-sea, --color-coral, --color-muted, --color-line
```

Typography: display serif for hero/H1s/pull quotes; sans for body/UI. Generous letter-spacing on small-caps labels ("THE EXPERIENCE", "WHAT'S INCLUDED"). Body line-height ≥1.6, heading 1.05–1.15.

Layout: 12-col grid, max content 1440px, text 1280px. Section rhythm: 96px desktop / 64px mobile.

Motion: subtle fade-up on scroll, gentle parallax on hero, 8s slow zoom on key images. Respect `prefers-reduced-motion`. Easing: `cubic-bezier(0.16, 1, 0.3, 1)`. No bouncy/playful curves.

Components:
- `Header`, `Footer`, `WhatsAppCTA`, `BoatCard`, `Hero`, `StatsBar`, `Testimonials`, `InstagramFeed`, `FAQAccordion`, `FilterBar`, `Gallery`, `EnquiryForm`.

## 5. Data model (Supabase)

Migrations in `/supabase/migrations/`, Supabase CLI conventions, RLS on every table. See `/supabase/migrations/0001_init.sql` for the canonical schema (`boats`, `experiences`, `destinations`, `faqs`, `enquiries`, `site_settings`).

RLS:
- Public read on published rows for `boats`, `experiences`, `destinations`, `faqs`, `site_settings`
- Public insert + authenticated read on `enquiries`
- Authenticated full access for admins

## 6. Dummy data and data access layer

Create `/lib/data/dummy/` with 19 realistic luxury yachts and seed data for experiences, destinations, faqs, settings.

`/lib/data/index.ts` exposes a unified API:

```ts
export async function getBoats(): Promise<Boat[]>
export async function getBoatBySlug(slug: string): Promise<Boat | null>
export async function getFeaturedBoats(limit: number): Promise<Boat[]>
export async function getExperiences(): Promise<Experience[]>
export async function getDestinations(): Promise<Destination[]>
export async function getFaqs(): Promise<Faq[]>
export async function getSettings(): Promise<Settings>
export async function createEnquiry(input: EnquiryInput): Promise<void>
```

Each function switches between dummy data and Supabase based on `process.env.USE_SUPABASE === 'true'`. Flipping to live data must be a one-line env change.

## 7. Pages

- **Homepage** — hero with Es Vedra, intro, stats (19/20+/Botafoc/Riva·Pershing), featured fleet, experiences teaser, destinations teaser, testimonials, Instagram grid placeholder, enquiry CTA.
- **`/fleet`** — page hero, URL-param filters (length / guests / type / price / brand), grid of boats, empty state.
- **`/fleet/[slug]`** — breadcrumb, hero with tagline, two-column (gallery + sticky sidebar), pills, description, what's included, specs table, related boats, WhatsApp CTA, Product/Offer schema.
- **Experiences** — day trips, sunset, multi-day Balearic, occasions; add-ons.
- **Destinations** — Ibiza, Formentera, Mallorca sections.
- **About** — brand, Ibimar partnership (B2C-friendly), Botafoc, team/crew placeholders.
- **Contact/FAQ** — form, WhatsApp, contact, lazy marina iframe, FAQ accordion.
- **Privacy/Terms** — GDPR template, `// TODO: lawyer review`.

## 8. WhatsApp integration

`/lib/whatsapp.ts` exposes `whatsappLink({ number, message?, boatName?, page? })` returning `https://wa.me/{number}?text={encoded}`.

Templates:
- Generic: "Hi Sea Society, I'd like to enquire about a charter."
- Per-boat: "Hi Sea Society, I'm interested in the {boatName}. Could you tell me more about availability?"

Sticky floating button on mobile, inline elsewhere.

## 9. Forms & enquiries

Fields: name, email, phone (optional), dates, group size, boat preference, message.

- Shared zod schema, client + server validation
- Server action posts to `/api/enquiries`
- Insert into Supabase OR log to `/tmp/enquiries.json` if `USE_SUPABASE=false`
- Send email via Resend if `RESEND_API_KEY` set, otherwise stub
- Success state inline, no redirect
- Honeypot field + simple rate limiting

## 10. SEO — must be perfect

- `generateMetadata` on every dynamic route
- Title: `{Page} — Sea Society Ibiza | Luxury Yacht Charter`
- Unique descriptions 140–160 chars
- Open Graph + Twitter cards, custom OG per page via `/api/og`
- JSON-LD on every page: `Organization`, `WebSite` + `SearchAction`, `BreadcrumbList`, `Product` + `Offer`, `LocalBusiness` (TravelAgency), `FAQPage`, `ItemList`
- Self-referencing canonical + hreflang infrastructure (EN + x-default at launch, ready for `/nl`, `/fr`, `/de`, `/es`)
- Dynamic `/sitemap.xml` + `/robots.txt` (disallow `/admin`)
- Keywords: "yacht charter Ibiza", "luxury boat hire Ibiza", "private yacht Ibiza Formentera", "boat rental Ibiza", "Ibiza yacht broker"
- Core Web Vitals: LCP < 2.0s, CLS < 0.05, INP < 200ms

## 11. Accessibility — must be 100%

WCAG 2.2 AA. Semantic HTML, one `<h1>`, landmarks, keyboard everywhere, visible focus rings, meaningful alt text, contrast 4.5:1 body / 3:1 large, labeled inputs, `aria-live` errors, focus-trapped drawer with ESC + restore, gallery keyboard nav, accordion ARIA, skip-to-content link, `prefers-reduced-motion`, `<html lang="en">`, text-labeled CTAs, `@axe-core/react` in dev.

## 12. Performance budget

- Homepage first-load JS < 90KB gzipped
- LCP image < 200KB after optimization
- No render-blocking 3p above the fold
- Defer Instagram, analytics, chat widgets
- `next/dynamic` only for true client-only modules
- `loading="lazy"`, `decoding="async"` on below-fold images
- Preconnect Supabase, Resend, image CDN

Lighthouse mobile targets: Performance ≥95, Accessibility =100, Best Practices ≥95, SEO =100.

## 13. Analytics, cookies, legal

- GA4 via `@next/third-parties/google`, fires only after consent
- Meta Pixel — same gating
- Cookie banner: granular (necessary / analytics / marketing), stored in cookie, in-house
- Privacy + Terms with `TODO: lawyer review` markers
- All 3p scripts gated behind consent

## 14. Admin panel (minimal for launch)

- Supabase Auth, email + magic link. Whitelist via `ADMIN_EMAILS`.
- `/middleware.ts` redirects unauthenticated `/admin/*` to `/admin/login`.
- Dev fallback: env-gated local mock auth when Supabase vars absent (never in prod).
- Sidebar nav, top bar with logout, shadcn components.
- Full CRUD on `/admin/boats` (list w/ publish toggle + sort + delete confirm; edit form w/ gallery upload to Supabase `boats/`; drag-to-reorder gallery; server actions).
- `/admin/enquiries`: list, mark handled, basic filters.
- Other admin sections: stubs marked "Phase 2".

## 15. Project structure

```
/
├── app/
│   ├── (site)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── fleet/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── experiences/page.tsx
│   │   ├── destinations/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── page.tsx
│   │   ├── boats/
│   │   └── enquiries/
│   ├── api/
│   │   ├── enquiries/route.ts
│   │   └── og/route.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   └── not-found.tsx
├── components/{ui,site,admin,seo}/
├── lib/
│   ├── data/{index.ts,dummy/,supabase/}
│   ├── supabase/{client,server,middleware}.ts
│   ├── whatsapp.ts
│   ├── schemas.ts
│   ├── utils.ts
│   └── seo/{jsonld,metadata}.ts
├── supabase/migrations/
├── public/{images,fonts,og}/
├── designs/
├── BRIEF.md
├── DESIGN_DECISIONS.md
├── README.md
├── .env.example
└── package.json
```

## 16. Environment variables

See `.env.example`. The site must build and run with **only** `NEXT_PUBLIC_SITE_URL` set.

## 17. Git, commits, README

- Conventional commits, small + frequent
- `.gitignore` covers `.env*.local`, `.next`, `node_modules`, `.vercel`
- README: overview, stack, setup, env, deploy, dummy→Supabase flip, admin access, phase 2 list

## 18. Out of scope (Phase 2)

Multilingual content, real-time calendar + payment, membership, Mailchimp automation, editorial destinations, image cropping in admin, audit log, real Instagram API.

## 19. Definition of done

See `BRIEF.md` §19 in conversation history — every checkbox must pass.

## 20. Working style

Small commits. Pause + report after each major section. Log unclear decisions in `DESIGN_DECISIONS.md` and proceed with best judgment. Composition over abstraction. `pnpm build && pnpm lint` before declaring any phase done. Lighthouse + axe on homepage once per session.

## 21. Launch logistics

- No domain yet, no Vercel project yet — ship to GitHub (`cleareads/sea-society-ibiza`). Vercel connects later.
- Client deadline: 1 June 2026 (PDF) / 2026-05-31 (user, ~11 days from 2026-05-20).
