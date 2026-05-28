"""
Generate RGB-packed masks for the two POC drone videos.

Per video, we sample several frames across the timeline, compute a
heuristic segmentation (sky / sea / yacht-and-foreground), then average
across frames so the mask covers wherever the yacht has been seen.
Result is one static PNG per video that pairs with the running
VideoTexture inside the WebGL shader.

Output layout (matches the existing home-hero-depth.png contract):
  R = depth scalar     (0 far → 255 near)
  G = water mask       (255 = pure sea — drives shimmer + cursor light)
  B = static-fg mask   (255 = freeze parallax — yacht, cliffs, rocks)

Outputs:
  public/sea-society/video/shorten-mask.png
  public/sea-society/video/shorten-hero-mask.png
"""
from __future__ import annotations
import glob
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

OUT_DIR = Path("public/sea-society/video")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_frames(pattern: str) -> tuple[np.ndarray, int, int]:
    files = sorted(glob.glob(pattern))
    if not files:
        raise SystemExit(f"no frames matching {pattern}")
    arrs = []
    target_size: tuple[int, int] | None = None
    for f in files:
        im = Image.open(f).convert("RGB")
        if target_size is None:
            target_size = im.size  # (W, H)
        elif im.size != target_size:
            im = im.resize(target_size, Image.Resampling.LANCZOS)
        arrs.append(np.asarray(im).astype(np.float32) / 255.0)
    stack = np.stack(arrs, axis=0)  # (N, H, W, 3)
    W, H = target_size
    return stack, W, H


def feather(mask: np.ndarray, sigma: float) -> np.ndarray:
    return ndimage.gaussian_filter(mask.astype(np.float32), sigma=sigma)


# --------------------------------------------------------------------------
# Video 1 — shorten.mov: open-sea, single dark yacht, distant land on horizon.
# Composition: sea fills 80% of frame, sky narrow band at top, yacht is a
# small dark mass in mid-band.
# --------------------------------------------------------------------------
def mask_open_sea(stack: np.ndarray, W: int, H: int) -> np.ndarray:
    N = stack.shape[0]
    r = stack[..., 0]
    g = stack[..., 1]
    b = stack[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    blueness = b - 0.5 * (r + g)

    yy = np.broadcast_to(np.arange(H)[None, :, None] / H, (N, H, W)).astype(np.float32)

    # Sky — top band, bright + neutral
    sky = (yy < 0.12) & (lum > 0.55)

    # Sea — middle to bottom, blue/cyan dominant
    sea = (yy > 0.10) & (blueness > -0.05) & (lum < 0.78)

    # Yacht — dark cluster in centre band. Threshold AND position.
    yacht_seed = (yy > 0.28) & (yy < 0.78) & (lum < 0.22) & (blueness < 0.02)
    # Average across time so the mask covers wherever the yacht has been seen.
    yacht_avg = yacht_seed.mean(axis=0)
    # Treat any pixel where the yacht was present in >= 30% of frames as static.
    yacht_static = yacht_avg > 0.30
    yacht_static = ndimage.binary_closing(yacht_static, iterations=6)
    yacht_static = ndimage.binary_fill_holes(yacht_static)
    # Drop tiny noise blobs
    labels, n = ndimage.label(yacht_static)
    if n > 0:
        sizes = ndimage.sum(yacht_static, labels, range(1, n + 1))
        biggest = int(np.argmax(sizes)) + 1
        yacht_static = labels == biggest

    sky_avg = sky.mean(axis=0)
    sea_avg = sea.mean(axis=0)
    sea_avg = sea_avg * (1.0 - yacht_static.astype(np.float32))

    sky_f = feather(sky_avg > 0.5, sigma=8.0)
    sea_f = feather(sea_avg > 0.5, sigma=8.0)
    yacht_f = feather(yacht_static, sigma=10.0)  # wide feather so the yacht's
    # drift is absorbed into a soft halo that always covers the boat.

    # Depth: 0 sky → 90 distant sea → 200 yacht
    denom = np.maximum(0.001, sky_f + sea_f + yacht_f)
    depth = (sky_f * 0.0 + sea_f * 90.0 + yacht_f * 220.0) / denom

    water = np.power(sea_f, 0.65) * 255.0
    static_fg = np.power(yacht_f, 0.85) * 255.0

    return _pack(depth, water, static_fg)


# --------------------------------------------------------------------------
# Video 2 — shorten_hero.mov: yacht in turquoise lagoon, red Ibiza cliffs
# behind, bright sky. Composition has more depth than video 1.
# --------------------------------------------------------------------------
def mask_cliffs(stack: np.ndarray, W: int, H: int) -> np.ndarray:
    N = stack.shape[0]
    r = stack[..., 0]
    g = stack[..., 1]
    b = stack[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    warmness = r - b
    blueness = b - 0.5 * (r + g)
    yy = np.broadcast_to(np.arange(H)[None, :, None] / H, (N, H, W)).astype(np.float32)

    # Sky — very top + bright + cool
    sky = (yy < 0.20) & (lum > 0.70) & (warmness < 0.10)

    # Cliffs — warm + mid-band + medium luminance
    cliffs = (yy > 0.05) & (yy < 0.55) & (warmness > 0.05) & (lum > 0.20)

    # Sea — high blueness, lower half
    sea = (yy > 0.40) & (blueness > 0.00) & (warmness < 0.10)

    # Yacht — bright neutral cluster mid-frame (white yacht hull)
    yacht_seed = (yy > 0.45) & (yy < 0.85) & (lum > 0.65) & (np.abs(warmness) < 0.10)
    yacht_avg = yacht_seed.mean(axis=0)
    yacht_static = yacht_avg > 0.25
    yacht_static = ndimage.binary_closing(yacht_static, iterations=6)
    yacht_static = ndimage.binary_fill_holes(yacht_static)
    labels, n = ndimage.label(yacht_static)
    if n > 0:
        sizes = ndimage.sum(yacht_static, labels, range(1, n + 1))
        biggest = int(np.argmax(sizes)) + 1
        yacht_static = labels == biggest

    sky_avg = sky.mean(axis=0)
    cliff_avg = cliffs.mean(axis=0)
    sea_avg = sea.mean(axis=0)

    # Cliffs win over sea where they overlap
    cliff_bin = cliff_avg > 0.5
    cliff_bin = ndimage.binary_closing(cliff_bin, iterations=10)
    cliff_bin = ndimage.binary_fill_holes(cliff_bin)
    sea_avg = sea_avg * (1.0 - cliff_bin.astype(np.float32))
    sea_avg = sea_avg * (1.0 - yacht_static.astype(np.float32))

    sky_f = feather(sky_avg > 0.5, sigma=6.0)
    sea_f = feather(sea_avg > 0.5, sigma=6.0)
    cliff_f = feather(cliff_bin, sigma=10.0)
    yacht_f = feather(yacht_static, sigma=10.0)

    # Static-fg = cliffs ∪ yacht
    static_combined = np.maximum(cliff_f, yacht_f)

    # Depth: 0 sky → 70 distant cliffs → 110 sea → 220 yacht
    denom = np.maximum(0.001, sky_f + cliff_f + sea_f + yacht_f)
    depth = (
        sky_f * 0.0 + cliff_f * 70.0 + sea_f * 110.0 + yacht_f * 220.0
    ) / denom

    water = np.power(sea_f, 0.65) * 255.0
    static_fg = np.power(static_combined, 0.85) * 255.0

    return _pack(depth, water, static_fg)


def _pack(depth: np.ndarray, water: np.ndarray, static_fg: np.ndarray) -> np.ndarray:
    return np.stack(
        [
            np.clip(depth, 0, 255).astype(np.uint8),
            np.clip(water, 0, 255).astype(np.uint8),
            np.clip(static_fg, 0, 255).astype(np.uint8),
        ],
        axis=-1,
    )


if __name__ == "__main__":
    print("video 1 (open sea)…")
    stack1, W1, H1 = load_frames("/tmp/v1_*.jpg")
    packed1 = mask_open_sea(stack1, W1, H1)
    Image.fromarray(packed1, mode="RGB").save(OUT_DIR / "shorten-mask.png", optimize=True)
    Image.fromarray(packed1[..., 2]).save("/tmp/dbg_v1_static.png")
    Image.fromarray(packed1[..., 1]).save("/tmp/dbg_v1_water.png")

    print("video 2 (cliffs)…")
    stack2, W2, H2 = load_frames("/tmp/v2_*.jpg")
    packed2 = mask_cliffs(stack2, W2, H2)
    Image.fromarray(packed2, mode="RGB").save(OUT_DIR / "shorten-hero-mask.png", optimize=True)
    Image.fromarray(packed2[..., 2]).save("/tmp/dbg_v2_static.png")
    Image.fromarray(packed2[..., 1]).save("/tmp/dbg_v2_water.png")

    print("done")
