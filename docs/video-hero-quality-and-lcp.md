# Video hero — quality + LCP performance plan

The homepage hero is a scroll-scrubbed 1080p clip with a paired
DA-V2 depth video, composited with a 3D water plane. Two goals,
sometimes in tension:

1. **Highest possible visual quality** — sharp video, clean depth
   composite, no compression artefacts visible in the water.
2. **Snappy first paint** — the LCP image is the poster JPEG, painted
   before any video bytes are downloaded.

This doc lists what's shipped, what's queued, and the tradeoffs.

## Already shipped (commit log)

- **All-intra encoding** (`-g 1 -keyint_min 1 -sc_threshold 0`) so the
  video scrubs both directions without keyframe seeking jumps.
- **Two resolutions**: `shorten-scrub.mp4` (1080p, 46 MB) for desktop,
  `shorten-scrub-720.mp4` (720p, 22 MB) for mobile (auto-selected at
  innerWidth < 900).
- **Static poster** (`shorten-poster.jpg`, 152 KB) used as the video's
  `poster` attribute fallback.
- **LCP poster image** rendered as a Next.js `<Image priority
  fetchPriority="high">` BEHIND the WebGL canvas. Counts as the LCP
  element in the browser's measurement. Canvas paints on top within
  ~one frame.

## Queued work (in priority order)

### 1. Generate higher-quality master encodes

Currently all-intra @ CRF 26. Quality is decent but the sea surface
shows banding in dark regions. Bump quality at the cost of size:

```bash
# Current: 1080p all-intra CRF 26 → 46 MB / 30 s
# Target: 1080p all-intra CRF 22 → ~70-80 MB / 30 s (estimate)
ffmpeg -i shorten.mov \
  -vf "scale=-2:1080" -c:v libx264 -preset slow -crf 22 \
  -g 1 -keyint_min 1 -sc_threshold 0 -tune film \
  -profile:v high -level 4.2 -pix_fmt yuv420p \
  -movflags +faststart -an shorten-scrub-hq.mp4
```

Tradeoff: file 50% bigger, first byte arrives later, but the
sea reads cleaner. Defer until we can A/B on real network.

### 2. HEVC + AV1 fallbacks

Modern codecs cut file size 30-50% at the same quality:

```bash
# HEVC (Safari + modern Chrome on Mac)
ffmpeg -i shorten.mov -vf "scale=-2:1080" -c:v libx265 -preset slow \
  -crf 24 -tag:v hvc1 -movflags +faststart -an shorten-scrub.hevc.mp4

# AV1 (Chrome, Firefox; slow encode)
ffmpeg -i shorten.mov -vf "scale=-2:1080" -c:v libsvtav1 \
  -preset 6 -crf 28 -g 1 -movflags +faststart -an shorten-scrub.av1.webm
```

Browser picks the best supported via `<source>` ordering:

```tsx
<video>
  <source src="...av1.webm" type='video/webm; codecs="av01.0.05M.08"' />
  <source src="...hevc.mp4" type='video/mp4; codecs="hvc1.1.6.L120.90"' />
  <source src="...mp4" type='video/mp4' />
</video>
```

Three.js's `VideoTexture` reads from the loaded video element so
`<source>` negotiation works transparently. Requires updating
`HomeWater3DCanvas` to create child `<source>` elements instead of
`video.src = ...`.

### 3. Three resolution tiers

`<source media="...">` selects by viewport:

| Source | Resolution | Size | Used when |
|--------|-----------|------|-----------|
| shorten-2k.mp4 | 1440p | ~70 MB | innerWidth ≥ 1600 |
| shorten-scrub.mp4 | 1080p | 46 MB | innerWidth ≥ 900 |
| shorten-scrub-720.mp4 | 720p | 22 MB | innerWidth < 900 |

Currently we only pick between 1080p / 720p in JS at component mount.
Better: use `<source media="(min-width: ...px)">` so the browser
chooses before the JS even runs.

### 4. Range requests / partial downloads

Vercel already serves video with `Accept-Ranges: bytes`. The video
element starts downloading from the beginning + jumps to wherever
`currentTime` lands. For a scrubbed hero, the user will frequently
land in mid-file. Two optimisations:

- **`preload="metadata"`** instead of `auto` — server sends only the
  moov atom + 1-2 seconds of data. Full video loads as needed via
  range requests when scrubbing exceeds buffer.
- **Background download** of the rest of the file after first paint,
  via fetch() that doesn't block rendering.

Currently `preload="auto"` — the browser pulls aggressively. On slow
networks the user waits for ~half the file before the video is
playable. Switching to `metadata` + fetch-prefetch behind the scenes
would unblock first-paint dramatically.

### 5. Depth video same treatment

The grayscale depth video (`shorten-depth-vitl-518.mp4`, 8 MB) gets
the same scrub + sync as the colour video. Currently encoded at
the same all-intra CRF 22. It's already small; no immediate work
needed, but the same `preload="metadata"` + range pattern applies.

### 6. WebP / AVIF poster

The poster JPEG is 152 KB. Re-encoded as AVIF it would be 30-50 KB
with equivalent quality. Next.js `<Image>` already serves AVIF when
the browser supports it — but our poster is referenced as a static
file from `<video poster="..."` AND as a Next/Image. The Next/Image
path benefits automatically; the `<video poster>` doesn't.

Quick fix: pre-encode the poster as AVIF + reference both:

```html
<picture>
  <source srcset="shorten-poster.avif" type="image/avif" />
  <source srcset="shorten-poster.webp" type="image/webp" />
  <img src="shorten-poster.jpg" alt="" />
</picture>
```

But we'd need a custom poster overlay (not the native `<video poster>`)
since `<video>` doesn't accept `<picture>`. We already do this via the
Next/Image LCP layer — covered by the work shipped above.

### 7. Cache hints

Vercel sets long cache headers on `_next/image` paths. The raw mp4
under `/sea-society/video/` doesn't get `Cache-Control: immutable`
by default. Add a `vercel.json` rule:

```json
{
  "headers": [
    {
      "source": "/sea-society/video/(.*).mp4",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

Trivial to add; benefit kicks in on repeat visits.

## What I'm NOT doing yet

- **CDN re-host of videos** — Vercel's edge network handles this
  adequately. Cloudflare R2 or Bunny.net would cut a few hundred ms
  off TTFB in distant geographies but adds operational overhead.
- **HLS / DASH streaming** — overkill for a 30-second hero. The full
  file fits in normal cache + range requests.
- **Per-frame depth video at higher resolution** — would require
  cloud GPU rendering (Mac MPS caps out at vitl @ 518). Defer until
  the design is locked.

## What to actually do this week

Priority order:

1. **Switch `preload="auto"` → `preload="metadata"`** in the canvas.
   First-paint improvement is dramatic; minimal risk.
2. **Re-encode masters at CRF 22** (~10 min per clip). Replace
   existing files. Visual quality jump.
3. **Add HEVC sibling** for Safari. ~5 min encode. 30% smaller.
4. **`vercel.json` cache headers** on the mp4 paths. 30 seconds of work.

If those four land, the homepage will load with a poster instantly,
the video will quietly stream into place, and the visual quality
will be the best we've shipped.
