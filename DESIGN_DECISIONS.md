# Design decisions log

Living document. Each entry: **decision**, **why**, **alternatives considered**.

## 2026-05-21 — Fonts: Fraunces + Inter

- **Decision**: Use Fraunces (display serif) + Inter (body sans), loaded via `next/font/google` with `display: swap` and CSS variables `--font-fraunces` / `--font-inter`.
- **Why**: The brief explicitly lists Fraunces or Cormorant + Inter or Geist. User confirmed the brief wins on this specific item even though `designs/DESIGN.md` and `designs/code.html` use Playfair Display + Manrope. Fraunces has the editorial weight Sea Society needs and pairs cleanly with Inter's neutrality.
- **Alternatives**: Playfair + Manrope (matches design ref exactly). Rejected by user direction.

## 2026-05-21 — Color tokens: Azure Mediterranean (DESIGN.md)

- **Decision**: Adopt the exact palette from `designs/DESIGN.md`. Primary (Deep Turquoise) `#006565` with container `#008080`, secondary (Vibrant Red) `#bc0100` with container `#eb0000`, surface (Off-white) `#fcf9f8`, on-surface (Soft Charcoal) `#1c1b1b`.
- **Why**: The design reference is closer to the brand mood expressed in the brief PDF ("off-white, deep turquoise, red"). User explicitly chose the design values over the brief's `--color-sea #0E7C8A` / `--color-coral #E63946` / `--color-cream #F5F1E8`.
- **Alternatives**: Brief palette. Rejected by user direction.
- **Brief aliases preserved**: `--color-ink`, `--color-cream`, `--color-sea`, `--color-coral`, `--color-muted`, `--color-line` are still defined in `globals.css`, just mapped to the Azure Mediterranean equivalents so any code that references the brief names still works.

## 2026-05-21 — Tailwind v4 (CSS-first, no `tailwind.config.ts`)

- **Decision**: Use Tailwind v4's `@theme { … }` block in `app/globals.css` for all design tokens; no JS config file.
- **Why**: v4's native CSS API is the supported path; tokens live next to the styles that use them.

## 2026-05-21 — Scaffold by hand, not `create-next-app`

- **Decision**: Write `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `app/{layout,page,globals.css}` by hand.
- **Why**: The repo already contained `designs/` and the brief PDF before the Next.js scaffold landed; `create-next-app` refuses to operate on a non-empty directory. Hand-scaffolding is faster than the dance of bootstrapping into a temp dir and merging.

## 2026-05-21 — Imagery: Unsplash photos with attribution

- **Decision**: Commit Unsplash-licensed yacht/Ibiza imagery into `/public/images/`. Each photo's photographer + source URL is listed in `IMAGE_CREDITS.md` (to be added with commit 5/6 when images land).
- **Why**: The site needs to look real on day one; SVG placeholders read as unfinished. Unsplash license permits this use.

## 2026-05-21 — Contact details: obvious placeholders

- **Decision**: WhatsApp `+34 600 000 000`, Instagram `@seasocietyibiza`, generic Botafoc Marina address. All wired through `site_settings` (DB) and `.env` so admin or env-var changes swap them without code edits.
- **Why**: Real values not available yet. Placeholders that are obviously fake reduce the risk of accidentally launching with the wrong number.

## 2026-05-21 — Package manager: pnpm 9 (installed via `npm i -g pnpm@9`)

- **Decision**: pnpm 9.15.9. Installed globally because corepack on Node 21 hit a known `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` with pnpm 11's binary.
- **Why**: Brief mandates pnpm; pnpm 9 is stable on Node 20+ and avoids the corepack bug.
