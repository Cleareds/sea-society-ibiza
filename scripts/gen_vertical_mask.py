"""
Generate the RGB-packed mask for designs/vertical one.mov.

Vertical composition:
  - Top third: mountainous coastline + sky (static fg)
  - Middle: sea
  - Lower third: turquoise water + white yacht (static fg)

We sample 4 frames across the 2-second clip, threshold per region,
union across time so the static-fg covers the yacht wherever it
drifts.
"""
from __future__ import annotations
import glob
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = Path("public/sea-society/video/vertical-mask.png")


def feather(mask: np.ndarray, sigma: float) -> np.ndarray:
    return ndimage.gaussian_filter(mask.astype(np.float32), sigma=sigma)


def main() -> None:
    files = sorted(glob.glob("/tmp/vert_*.jpg"))
    if not files:
        raise SystemExit("no vert sample frames")
    arrs = []
    for f in files:
        im = Image.open(f).convert("RGB")
        arrs.append(np.asarray(im).astype(np.float32) / 255.0)
    stack = np.stack(arrs, axis=0)
    N, H, W, _ = stack.shape

    r = stack[..., 0]
    g = stack[..., 1]
    b = stack[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    blueness = b - 0.5 * (r + g)
    warmness = r - b
    yy = np.broadcast_to(np.arange(H)[None, :, None] / H, (N, H, W)).astype(np.float32)

    # Mountain / coastline — top portion, warm-or-neutral, darker than sky
    mountain = (yy < 0.30) & (lum < 0.55) & (warmness > -0.05)
    mountain_avg = mountain.mean(axis=0)
    mountain_bin = mountain_avg > 0.3
    mountain_bin = ndimage.binary_closing(mountain_bin, iterations=8)
    mountain_bin = ndimage.binary_fill_holes(mountain_bin)

    # Yacht — bright cluster mid-lower, neutral colour
    yacht_seed = (yy > 0.40) & (yy < 0.85) & (lum > 0.62) & (np.abs(warmness) < 0.10)
    yacht_avg = yacht_seed.mean(axis=0)
    yacht_bin = yacht_avg > 0.20
    yacht_bin = ndimage.binary_closing(yacht_bin, iterations=6)
    yacht_bin = ndimage.binary_fill_holes(yacht_bin)
    labels, n = ndimage.label(yacht_bin)
    if n > 0:
        sizes = ndimage.sum(yacht_bin, labels, range(1, n + 1))
        yacht_bin = labels == int(np.argmax(sizes)) + 1

    # Sea — blue, mid-band, NOT mountain NOT yacht
    sea = (blueness > 0.00) & (lum > 0.20) & (lum < 0.80)
    sea_avg = sea.mean(axis=0)
    sea_bin = sea_avg > 0.5
    sea_bin = sea_bin & ~mountain_bin & ~yacht_bin
    sea_bin = ndimage.binary_closing(sea_bin, iterations=8)

    # Sky — top, very bright
    sky = (yy < 0.10) & (lum > 0.65)
    sky_avg = sky.mean(axis=0)
    sky_bin = sky_avg > 0.5

    # Feathers
    sky_f = feather(sky_bin, sigma=4.0)
    mountain_f = feather(mountain_bin, sigma=10.0)
    sea_f = feather(sea_bin, sigma=8.0)
    yacht_f = feather(yacht_bin, sigma=10.0)

    static_combined = np.maximum(mountain_f, yacht_f)

    denom = np.maximum(0.001, sky_f + mountain_f + sea_f + yacht_f)
    depth = (sky_f * 0.0 + mountain_f * 60.0 + sea_f * 110.0 + yacht_f * 220.0) / denom

    water = np.power(sea_f, 0.65) * 255.0
    static_fg = np.power(static_combined, 0.85) * 255.0

    packed = np.stack([
        np.clip(depth, 0, 255).astype(np.uint8),
        np.clip(water, 0, 255).astype(np.uint8),
        np.clip(static_fg, 0, 255).astype(np.uint8),
    ], axis=-1)
    Image.fromarray(packed, mode="RGB").save(OUT, optimize=True)
    Image.fromarray(packed[..., 2]).save("/tmp/dbg_vert_static.png")
    Image.fromarray(packed[..., 1]).save("/tmp/dbg_vert_water.png")
    print(f"wrote {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()
