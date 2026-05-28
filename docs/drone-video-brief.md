# Drone footage — brief for the videographer

For the WebGL hero on the Sea Society Ibiza homepage. These shots become
the live background of the site: muted, looping, depth-aware. The
result has to read as luxury, not a tourism reel.

## What we need (in priority order)

1. **One "anchor" shot per page** — 8–15 seconds, designed to loop.
2. **3–5 secondary shots** — each 6–12 seconds, designed to cut into
   sub-sections (about, journey, fleet detail).
3. **One vertical-friendly composition** per shot — see "framing" below.

Total deliverable: ~6 final clips, each colour-graded, each ~10 seconds.

## Why this isn't a normal drone reel

Standard drone footage is built around the cut — fast push-ins,
zooms, whip-pans, frequent angle changes. **That all breaks here.**
The web hero shows a single shot continuously while the user scrolls;
inside our shader we add cursor-driven parallax, depth-aware water
shimmer, and a slow zoom. The shot has to support that without
fighting it.

**Translation for the videographer:** shoot like a luxury watch ad,
not like a YouTube travel video. Slow, deliberate, one camera move
per clip. Long enough that nothing happens twice in the 10-second
window we use.

## Shot composition rules

- **Yacht roughly central, never edge-cropped.** The shader's static
  mask locks the yacht in place; if the yacht exits the frame
  mid-shot the cursor parallax tears.
- **Horizon flat ± 2°.** Tilted horizons make the parallax look
  drunk. Use the drone's auto-horizon.
- **No subjects close to the lens.** A waving guest at the bow ruins
  the mask. Keep talent at yacht scale (small in frame). For people
  shots, do a separate clip we use elsewhere on the site.
- **Stay slow.** Camera move under 3 m/s. Smoothness > distance.
- **Loopable.** First frame and last frame should be visually similar
  enough that a hard cut feels seamless. Easiest with: hovering shots,
  long lateral tracking, gentle pull-up.

## The five shot types we want

### 1. The hero anchor — open sea cinematic
**Composition:** Yacht at speed, low golden-hour sun, distant
coastline at frame top, wake trailing behind. Camera tracking
parallel to the yacht, **slightly behind and above**, gimbal locked
on the yacht.
**Why it works:** the wake gives the eye motion to follow, the
coastline anchors depth, the yacht stays static in the frame.
**Reference vibes:** Riva's own promo reels, Sunseeker brand films.
Black yacht against silver water is the strongest version.
**Duration:** 12–15 s. Loop point: start and end should both have the
yacht in roughly the same screen position.

### 2. The cliff anchor — Ibiza geography
**Composition:** Yacht moored or drifting in a turquoise cove with
red sandstone cliffs filling roughly the top third of the frame.
Yacht in lower-third, sky a thin band above the cliffs. Camera
**static or barely arcing**, drone hovering.
**Why it works:** the static cliffs become our "static mask"
naturally — they don't move, so the shader treats them right.
Yacht-as-jewel composition.
**Reference vibes:** Es Calo cove, Cala d'Hort below Es Vedra.
**Duration:** 10–12 s.

### 3. The bird's-eye — overhead anchor
**Composition:** Straight-down shot, drone directly above the yacht,
yacht slow-moving through turquoise water leaving a clean wake. Frame
80% sea, 20% yacht.
**Why it works:** the wake becomes the entire interactive element —
cursor can ripple the water around it. Reads as scale ("you're really
out there").
**Constraint:** the yacht must be moving, not stationary. Drifting at
3–5 knots is perfect.
**Duration:** 10 s.

### 4. The detail — water + hull
**Composition:** Close-ish hover (yacht fills 40–60% of frame),
focused on hull cutting through water. Bow wave, hull reflection,
texture of the water.
**Use:** a secondary clip we can drop into the fleet detail page or
the about page.
**Duration:** 8 s.

### 5. The horizon — sunset
**Composition:** Yacht silhouette against a low sun, sky filling
top half, sea filling bottom half, very subtle camera lift.
**Constraint:** shoot in the actual golden-hour window, not noon
graded warm. Real light reads differently.
**Duration:** 10 s.

## Technical specs

- **Resolution:** 4K (3840×2160) minimum. We re-encode for web but
  start from 4K so the shader has detail to push.
- **Frame rate:** 30 fps (or 60 fps which we downsample). Avoid 24
  fps — it judders under our shader's interpolation.
- **Codec:** H.264 or H.265. ProRes if available is even better.
- **Bitrate:** at least 80 Mbps for 4K30.
- **Format:** 16:9 native. Vertical crops happen in post — frame
  with extra headroom and floor space so we can re-crop to 9:16 for
  mobile without losing the yacht.
- **No overlays.** No logos, no captions, no LUTs baked in beyond
  basic grade. We grade further in the shader.

## What to avoid

- Drone roll moves (Dutch tilt) — they break the parallax.
- Aggressive zoom punches — the shader has its own zoom; double-up
  reads as motion sickness.
- Talent close to camera waving at the drone — looks consumer.
- Mid-day overhead sun — flat light, no depth, the shader has nothing
  to grab onto.
- Wakes that cross the entire frame quickly — they'll look like
  glitches when the shader's loop point comes around.
- Birds-of-prey style shots (sudden dives) — too dramatic for the
  brand. The audience is a couple looking at a slow private day.

## Three references that will help most

1. **Riva Aquariva / Riva Iseo** brand films on YouTube — the slow
   gimbal tracks at golden hour are exactly the template.
2. **Sunseeker yacht launch videos** for the static cove framing.
3. **Apple "Shot on iPhone" desert / nature** ads for the pacing —
   slow, deliberate, premium.

## Delivery

- Raw clips uploaded to Dropbox/Drive in original format.
- 6–10 second cuts of each, with a 1-second tail of "loop-able" frame
  we can use as the seamless loop point.
- Brief note per clip: shot location, time of day, yacht used.

## Two things to test before any final shoot

1. **Pick one cove, shoot 3 versions of the same shot** at 10am,
   golden hour, and just-after-sunset. We pick the look from those
   three. (This is 90% of brand decisions for similar projects — the
   *light* is the brand, not the composition.)
2. **One overhead shot** with the yacht drifting under the camera.
   This is the riskiest format but the most distinctive one in the
   shortlist; worth a 15-minute attempt to know if it works.
