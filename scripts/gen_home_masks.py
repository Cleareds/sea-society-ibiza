"""
Generate depth + water masks for the homepage Es Vedra hero.

Output: public/sea-society/site/home-hero-depth.png  (RGB)
  R channel: depth, 0 = far, 255 = near. Drives optional parallax.
  G channel: water mask, 255 = pure water (sea). Gates the water shader
             effects (ripple / caustics / cursor refraction).
  B channel: static-foreground mask, 255 = keep absolutely static
             (lady silhouette + foreground rocks she sits on). Used to
             freeze parallax + suppress every dynamic effect inside the
             subject.

The rock (Es Vedra) falls out as "low depth, no water, no static" — it
gets gentle background parallax but no water shimmer, which keeps the
silhouette crisp.
"""
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = "public/sea-society/site/home-hero.webp"
DST = "public/sea-society/site/home-hero-depth.png"

img = Image.open(SRC).convert("RGB")
W, H = img.size
mask_w, mask_h = W // 2, H // 2
small = img.resize((mask_w, mask_h), Image.Resampling.LANCZOS)
arr = np.asarray(small).astype(np.float32) / 255.0
r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

lum = 0.299 * r + 0.587 * g + 0.114 * b
warmness = r - b
blueness = b - 0.5 * (r + g)

yy, xx = np.mgrid[0:mask_h, 0:mask_w].astype(np.float32)
yy /= mask_h
xx /= mask_w

# ----------------------------------------------------------------------
# 1) Sky mask
# ----------------------------------------------------------------------
sky = (
    (lum > 0.65) &
    (warmness < 0.20) &
    (yy < 0.32)
)
sky = ndimage.binary_closing(sky, iterations=3)
sky = ndimage.binary_fill_holes(sky)

# ----------------------------------------------------------------------
# 2) Rock mask (Es Vedra). Position-bounded, warm-or-neutral, dark.
#    Pre-computing this lets us EXCLUDE it from the sea mask later.
# ----------------------------------------------------------------------
rock_seed = (
    (xx > 0.05) & (xx < 0.70) &
    (yy > 0.10) & (yy < 0.55) &
    (lum < 0.55) &
    (warmness > -0.02)
)
rock = ndimage.binary_closing(rock_seed, iterations=12)
rock = ndimage.binary_fill_holes(rock)
labels, n = ndimage.label(rock)
if n > 0:
    sizes = ndimage.sum(rock, labels, range(1, n + 1))
    rock = labels == (int(np.argmax(sizes)) + 1)

# ----------------------------------------------------------------------
# 3) Sea mask. Cool + mid-dark + middle band, NOT rock, NOT sky.
# ----------------------------------------------------------------------
sea_raw = (
    (lum > 0.10) & (lum < 0.55) &
    (warmness < 0.05) &
    (yy > 0.22) & (yy < 0.85)
)
sea_raw &= ~sky
sea_raw &= ~rock

# ----------------------------------------------------------------------
# 4) Foreground rocks (bottom-left). Warm + lower band.
# ----------------------------------------------------------------------
fg_rocks = (
    (yy > 0.80) &
    (warmness > 0.07) &
    (lum < 0.55)
)
fg_rocks = ndimage.binary_closing(fg_rocks, iterations=4)
fg_rocks = ndimage.binary_fill_holes(fg_rocks)

# ----------------------------------------------------------------------
# 5) Lady silhouette. Right side, dark, mid-lower band.
#    Wider band so the new hero photo's whole figure (hat + arm + leg)
#    is included — the old thresholds left edges of the silhouette
#    out of the mask, which then moved with parallax.
# ----------------------------------------------------------------------
lady = (
    (xx > 0.40) &
    (yy > 0.32) & (yy < 0.99) &
    (lum < 0.42)
)
lady = ndimage.binary_dilation(lady, iterations=4)
lady = ndimage.binary_closing(lady, iterations=12)
lady = ndimage.binary_fill_holes(lady)
labels, n = ndimage.label(lady)
if n > 0:
    sizes = ndimage.sum(lady, labels, range(1, n + 1))
    lady = labels == (int(np.argmax(sizes)) + 1)

# ----------------------------------------------------------------------
# 6) Compose: foreground wins over sea + rock. Then DILATE the sea
#    before feathering so the bumpy rock-edge boundary doesn't leave a
#    notched "blind spot" inside the sea (the earlier pass had a hole
#    where the shader switched off water effects mid-band).
# ----------------------------------------------------------------------
foreground = fg_rocks | lady
sea = sea_raw & ~foreground
sea = ndimage.binary_closing(sea, iterations=10)
sea = ndimage.binary_fill_holes(sea)
sea &= ~foreground  # foreground still wins
rock = rock & ~foreground

# ----------------------------------------------------------------------
# 7) Feather each region — soft boundaries prevent the shader from
#    revealing a hard pixel edge between dynamic and static regions.
# ----------------------------------------------------------------------
def feather(mask, sigma=4.0):
    return ndimage.gaussian_filter(mask.astype(np.float32), sigma=sigma)

sea_f  = feather(sea,      sigma=6.0)
lady_f = feather(lady,     sigma=4.0)
fg_f   = feather(fg_rocks, sigma=5.0)
rock_f = feather(rock,     sigma=5.0)
sky_f  = feather(sky,      sigma=5.0)

# Depth: 0 sky -> 70 rock -> 110 sea -> 200 fg-rocks -> 255 lady.
depth = (
    sky_f  * 0.0   +
    rock_f * 70.0  +
    sea_f  * 110.0 +
    fg_f   * 200.0 +
    lady_f * 255.0
) / np.maximum(0.001, sky_f + rock_f + sea_f + fg_f + lady_f)
depth = np.clip(depth, 0, 255).astype(np.uint8)

# Water mask uses a *boosted* sea feather so the shader sees a near-
# binary gate and never lands in a soft mid-grey "blind spot".
water = np.clip(np.power(sea_f, 0.6) * 255.0, 0, 255).astype(np.uint8)
# Static = everything that must NOT move with cursor parallax:
#   - the mountain (Es Vedra rock — user feedback: it was wobbling
#     with the parallax and shouldn't)
#   - lady silhouette
#   - foreground rocks she sits on
# Sky / horizon stays OUT of static — it *should* swing with cursor X
# so the parallax has somewhere to read against.
static_fg = np.clip(
    np.maximum(np.maximum(lady_f, fg_f), rock_f) * 255.0,
    0, 255,
).astype(np.uint8)

packed = np.stack([depth, water, static_fg], axis=-1)
out = Image.fromarray(packed, mode="RGB")
out_full = out.resize((W, H), Image.Resampling.BILINEAR)
out_full.save(DST, optimize=True)

Image.fromarray(depth).save("/tmp/hh_depth.png")
Image.fromarray(water).save("/tmp/hh_water.png")
Image.fromarray(static_fg).save("/tmp/hh_static.png")
print("wrote", DST, "size", out_full.size)
