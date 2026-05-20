# Sea Society Ibiza

Production-grade, mobile-first, luxury B2C website for **Sea Society Ibiza by Ibimar** — a luxury yacht charter broker representing a fleet of 19 boats out of Botafoc Marina, Ibiza.

## Stack

- Next.js 15 (App Router, RSC) + TypeScript strict
- Tailwind CSS v4 (CSS-first `@theme` tokens in `app/globals.css`)
- shadcn/ui primitives (added on demand)
- Supabase (DB / Auth / Storage) — scaffolded behind `USE_SUPABASE` flag; site runs entirely on dummy data until you flip it
- react-hook-form + zod, lucide-react
- next/font: Fraunces (display serif) + Inter (sans)
- Vercel-ready (no Vercel-only APIs in use)

## Local setup

```bash
nvm use            # Node 20+
pnpm install
cp .env.example .env.local   # only NEXT_PUBLIC_SITE_URL is required to build
pnpm dev
```

Build / lint / typecheck:

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## Environment variables

The site **must build and run with only `NEXT_PUBLIC_SITE_URL` set**. Everything else has sensible fallbacks. See `.env.example`.

| Var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used by metadata, sitemap, OG, hreflang. |
| `USE_SUPABASE` | `true` → real Supabase queries. `false` (default) → dummy data only. |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Required when `USE_SUPABASE=true`. |
| `ADMIN_EMAILS` | Comma-separated whitelist for `/admin`. |
| `RESEND_API_KEY` | Optional — enquiry confirmation emails. Stubbed if missing. |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | Only fire after cookie consent. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Overrides `site_settings.whatsapp_number` if set. |

## Switching dummy → Supabase

1. Create a Supabase project.
2. Apply migrations: `supabase db push` against `/supabase/migrations/`.
3. Drop the four `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY` values into `.env.local`.
4. Set `USE_SUPABASE=true`.

The data-access layer (`/lib/data/index.ts`) is the only place that decides; nothing else changes.

## Deployment (Vercel — connect later)

This repo currently ships to GitHub only. To deploy:

1. Push to `cleareads/sea-society-ibiza` on GitHub (already wired).
2. In Vercel, "Import Git Repository" → pick the repo.
3. Set the same env vars as `.env.example`.
4. Deploy. Vercel auto-detects Next.js 15.

## Project structure

See `BRIEF.md` §15 for the canonical tree.

## Phase 2 (out of scope at launch)

- Multilingual content (route infrastructure ready, content EN only)
- Real-time calendar + payment
- Membership programme
- Mailchimp automation (stubbed)
- Editorial destination articles beyond the launch sections
- Real Instagram API (placeholder grid for now)
- Image cropping in admin
- Audit log / version history

## Reference

- `BRIEF.md` — the client brief, verbatim
- `DESIGN_DECISIONS.md` — every meaningful tradeoff and why
- `designs/` — visual references (HTML/Tailwind mockup, design system MD, screen mock)
