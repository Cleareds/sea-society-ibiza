# Video Hero POC — what's in the build

Everything lives locally on `main` (uncommitted, **not pushed**). Run
`npm run dev` and the variants below are immediately browsable.

## Quick start

```
npm run dev
open http://localhost:3000/en/preview-video
```

That index page lists all 10 variants with their parameter cards.
Click any to open the full homepage with that variant.

## The 10 variants

Two source videos, five looks each:

| Slug | Video | Typography | Layout | Notable canvas tweaks |
|------|-------|-----------|--------|------------------------|
| `open-sea-a` | shorten | editorial-serif | bottom-left | Neutral baseline grade |
| `open-sea-b` | shorten | oversized-minimal | bottom-left | Cool cinematic, low zoom, restrained cursor |
| `open-sea-c` | shorten | mixed-weight serif italic | bottom-left | Warm tint, deeper zoom, brighter shimmer |
| `open-sea-d` | shorten | editorial-serif | bottom-left | **Cursor ripple** — water distorts under cursor |
| `open-sea-e` | shorten | classical uppercase | **center** | **Luxe vignette** — corners darkened |
| `cliffs-a` | shorten_hero | editorial-serif | bottom-left | Neutral baseline, turquoise punch |
| `cliffs-b` | shorten_hero | classical uppercase | bottom-left | Warm cliff push, very restrained motion |
| `cliffs-c` | shorten_hero | oversized-minimal | bottom-left | Strong turquoise + sun-glint |
| `cliffs-d` | shorten_hero | mixed-weight serif italic | bottom-left | **Cursor ripple** |
| `cliffs-e` | shorten_hero | oversized-minimal | **center** | **Vignette + centred copy** |

## What to look at on each variant

- **The hover effect.** Move the cursor over the sea — D variants ripple
  the water at the cursor, A/B/C variants paint a soft light spot, E
  variants do nothing on hover (vignette is the only ambient effect).
- **The first scroll.** All variants slowly zoom into the centre of
  the frame as you scroll the first 50% of the viewport. Stronger
  zoom in `c`/`d`/`a`, very gentle in `b`/`e`.
- **The yacht.** It must stay sharp / undistorted regardless of
  cursor or scroll — that's the static-fg mask working. If you see
  the yacht warping the mask needs tightening.
- **The horizon.** Should swing slightly with horizontal cursor
  motion (parallax). Stronger in `c`/`d`.

## Files that ship this

```
components/site/HomeVideoCanvas.tsx       — three.js + VideoTexture shader
components/site/HomeVideoScene.tsx         — flow content above the canvas
app/(site)/[locale]/preview-video/         — variant routes
  page.tsx                                  — index card grid
  _variants.ts                              — all variant configs
  [slug]/page.tsx                           — dynamic variant route

public/sea-society/video/
  shorten.mp4, shorten-720.mp4              — open-sea, desktop + mobile
  shorten-hero.mp4, shorten-hero-720.mp4    — cliffs, desktop + mobile
  shorten-mask.png, shorten-hero-mask.png   — RGB-packed masks per video
  shorten-poster.jpg, shorten-hero-poster.jpg — first-frame fallbacks

scripts/gen_video_masks.py                 — heuristic mask generator
```

## What's been adjusted in the site shell

- **Header now has a Book here pill** (desktop only) next to the nav
  links. Luxe filled-on-hover treatment, transparent variant inverts
  cleanly over the dark hero. Lives in `components/site/Header.tsx`.
- **`whatsappNumber` plumbed through** `app/(site)/[locale]/layout.tsx`
  so the pill renders sitewide.

## Known limitations of this POC

1. **Static masks, not per-frame depth.** I asked the auto-classifier
   to clone Depth-Anything-V2 and was blocked (correctly — running
   external code locally). The current masks are heuristic colour
   thresholds averaged across 5–9 sample frames per video. They
   work for steady drone shots; if a future video has the yacht
   sweeping across the frame, we'd need DA-V2.
2. **Mask only covers what's in the sample frames.** If the yacht
   moves outside that region during playback, the cursor light will
   touch it briefly.
3. **No audio.** Required for autoplay (browser policy). Not a
   problem for hero footage.
4. **Mobile aspect.** Source is 16:9 landscape. On portrait phones
   the canvas cover-fits, cropping the sides. Looks fine but the
   yacht ends up slightly off-centre. If we want true mobile-first
   framing, we'd need re-cropped portrait versions of each clip.

## Drone-video brief

See `docs/drone-video-brief.md`. Short opinionated reference for the
videographer — composition rules, the five shot types we want,
technical specs, and what to avoid. Send it as-is.

## Performance numbers (estimated)

- **First-paint:** poster image renders instantly. WebGL canvas
  mounts after dynamic import (~150ms on desktop, ~400ms on mid-tier
  mobile).
- **Bandwidth:** desktop pulls a 9.4–24 MB clip on first hero view;
  mobile pulls the 2.6–7.9 MB 720p variant.
- **GPU:** plain video texture sampling, no per-pixel work that
  isn't already in the static hero. Fine on iPhone 11 and up.

## What still needs you to decide

1. Which variant (or which mix of looks) to take forward.
2. Whether the **header Book here pill** should also appear on
   pages without a hero video (currently does — sitewide).
3. Whether to spend the time on **DA-V2** for true per-frame depth,
   or live with the static mask approach (works well enough that I
   wouldn't bother unless we see issues).
