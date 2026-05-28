"""
Convert a colourised depth map (viridis-style, like the Depth-Anything
output the designer shared) into the RGB-packed mask the home shader
expects:

   R = depth scalar         (0=far, 255=near)
   G = water mask           (where sea wave + caustics + cursor-light fire)
   B = static-foreground    (where parallax must NOT shift the pixel)

Why a converter?
- The shader needs three single-channel masks, not a colourmap.
- The colourised depth doesn't isolate the mountain cleanly from the
  sky in this image (both are far/blue), so for the static-foreground
  channel we ALSO fold in the rock detection from the colour photo
  (same heuristic as scripts/gen_home_masks.py).

Inputs:  /tmp/depth_input.webp   (the file you dropped in)
         public/sea-society/site/home-hero.webp (colour photo, for rock detection)
Output:  public/sea-society/site/home-hero-depth.png
"""
import numpy as np
from PIL import Image
from scipy import ndimage

DEPTH_INPUT = "/tmp/depth_input.webp"
COLOR_INPUT = "public/sea-society/site/home-hero.webp"
OUT = "public/sea-society/site/home-hero-depth.png"

# ---- Load + verify -------------------------------------------------------
depth_img = Image.open(DEPTH_INPUT).convert("RGB")
color_img = Image.open(COLOR_INPUT).convert("RGB")
if depth_img.size != color_img.size:
    raise SystemExit(
        f"size mismatch: depth {depth_img.size} != hero {color_img.size}"
    )
W, H = depth_img.size
d = np.asarray(depth_img).astype(np.float32) / 255.0
c = np.asarray(color_img).astype(np.float32) / 255.0
r, g, b = d[..., 0], d[..., 1], d[..., 2]
cr, cg, cb = c[..., 0], c[..., 1], c[..., 2]

# ---- 1. Depth scalar from luminance --------------------------------------
# Empirically in this viridis-style mapping, perceptual luminance is
# monotonic with depth: sky=0.36, mountain=0.39, sea=0.45, lady=0.47,
# foreground=0.61. We normalise the range so it spans 0..1.
lum = 0.299 * r + 0.587 * g + 0.114 * b
lo, hi = np.percentile(lum, [2, 98])
depth = np.clip((lum - lo) / max(1e-3, (hi - lo)), 0, 1)

# ---- 2. Water mask -------------------------------------------------------
# Sea sits in the cyan/blue band of the colourmap: high G, mid-high B,
# low R. We threshold on chromaticity to pick those pixels directly
# off the depth image — much cleaner than the colour-photo heuristic.
sea = (
    (g > 0.40) & (g < 0.65) &
    (b > 0.55) &
    (r < 0.40)
)
sea = ndimage.binary_closing(sea, iterations=6)
sea = ndimage.binary_fill_holes(sea)
# Drop tiny stray blobs
labels, n = ndimage.label(sea)
if n > 0:
    sizes = ndimage.sum(sea, labels, range(1, n + 1))
    keep = np.where(sizes > sizes.max() * 0.10)[0] + 1
    sea = np.isin(labels, keep)

# ---- 3. Foreground subjects from depth (warm side of the colourmap) ------
# Lady + foreground rocks come out warm (high R, low B) in this map.
subject = (r > 0.55) & (b < 0.55)
subject = ndimage.binary_closing(subject, iterations=8)
subject = ndimage.binary_fill_holes(subject)

# ---- 4. Mountain from the colour photo (depth map can't isolate it) ------
# Same recipe as gen_home_masks.py: position-bounded dark warm pixels in
# the upper-mid band of the source frame.
ny, nx = np.mgrid[0:H, 0:W].astype(np.float32)
ny /= H
nx /= W
clum = 0.299 * cr + 0.587 * cg + 0.114 * cb
cwarm = cr - cb
rock_seed = (
    (nx > 0.05) & (nx < 0.75) &
    (ny > 0.06) & (ny < 0.55) &
    (clum < 0.55) &
    (cwarm > -0.02)
)
rock = ndimage.binary_closing(rock_seed, iterations=12)
rock = ndimage.binary_fill_holes(rock)
labels, n = ndimage.label(rock)
if n > 0:
    sizes = ndimage.sum(rock, labels, range(1, n + 1))
    rock = labels == (int(np.argmax(sizes)) + 1)

# ---- 5. Compose ----------------------------------------------------------
# Static-fg = subject (lady + fg rocks) OR mountain. Sea overrides
# nothing in static_fg — sea stays movable.
static_fg = subject | rock

def feather(mask, sigma):
    return ndimage.gaussian_filter(mask.astype(np.float32), sigma=sigma)

# WIDE feather on the static-fg so the parallax tapers smoothly across
# tens of pixels around the silhouette edge — eliminates the visible
# "cardboard cutout" mismatch where the locked mountain meets the
# moving sea. The cost is that pixels close to the mountain shift a
# little even though they're really sea, but at the parallax
# magnitudes we use (sub-pixel near the edge) that's imperceptible.
static_f = feather(static_fg, sigma=14.0)
# Water boundary stays moderate — the wave amplitude is small enough
# that a sigma=5 transition at the mountain edge is unnoticeable.
sea_f    = feather(sea,       sigma=5.0)

# Pack R/G/B
depth_u8 = np.clip(depth * 255.0, 0, 255).astype(np.uint8)
water_u8 = np.clip(np.power(sea_f, 0.6) * 255.0, 0, 255).astype(np.uint8)
# Slightly gentler curve on static (0.7 → 0.85) so the soft halo around
# the mountain holds its gradient instead of being crushed to white.
static_u8 = np.clip(np.power(static_f, 0.85) * 255.0, 0, 255).astype(np.uint8)

packed = np.stack([depth_u8, water_u8, static_u8], axis=-1)
Image.fromarray(packed, mode="RGB").save(OUT, optimize=True)

# Debug previews
Image.fromarray(depth_u8).save("/tmp/dbg_depth.png")
Image.fromarray(water_u8).save("/tmp/dbg_water.png")
Image.fromarray(static_u8).save("/tmp/dbg_static.png")
print(f"wrote {OUT} ({W}x{H})")
