"""
Run Depth-Anything-V2 (Small) on a source video and write a grayscale
depth video in lock-step with the colour clip.

We deliberately downsample for inference (max 540px on the long axis,
15 fps) — DA-V2-Small on Mac MPS gives ~2–4 fps at 540p, so a 30 s
1080×1920 clip would otherwise take 7+ minutes. Downsampling brings
it to ~1–2 minutes per clip, and the depth map gets re-encoded at the
SAME resolution and frame rate as the colour clip the shader plays so
seek alignment works frame-for-frame.

Output is h264 all-intra (keyframe every frame) so the depth video
can be scrubbed bidirectionally alongside the colour video without
either tearing.

Usage:
  python3 scripts/gen_depth_video.py <input.mov> <output-depth.mp4>
"""
from __future__ import annotations
import argparse
import os
import sys
import time
import tempfile
import subprocess
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn.functional as F

# Make the DA-V2 module importable.
REPO = Path(__file__).resolve().parent.parent / "designs/depth-anything-v2/Depth-Anything-V2"
sys.path.insert(0, str(REPO))

from depth_anything_v2.dpt import DepthAnythingV2  # type: ignore  # noqa: E402

CHECKPOINTS = Path(__file__).resolve().parent.parent / "designs/depth-anything-v2/checkpoints"

MODEL_CONFIGS = {
    "vits": {"encoder": "vits", "features": 64,  "out_channels": [48, 96, 192, 384]},
    "vitb": {"encoder": "vitb", "features": 128, "out_channels": [96, 192, 384, 768]},
    "vitl": {"encoder": "vitl", "features": 256, "out_channels": [256, 512, 1024, 1024]},
}


def load_model(encoder: str, device: str) -> DepthAnythingV2:
    cfg = MODEL_CONFIGS[encoder]
    ckpt = CHECKPOINTS / f"depth_anything_v2_{encoder}.pth"
    if not ckpt.exists():
        sys.exit(f"checkpoint missing: {ckpt}")
    model = DepthAnythingV2(**cfg)
    state = torch.load(ckpt, map_location="cpu")
    model.load_state_dict(state)
    model = model.to(device).eval()
    return model


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--max-side", type=int, default=518)
    ap.add_argument("--encoder", default="vits", choices=list(MODEL_CONFIGS))
    args = ap.parse_args()

    src = Path(args.input)
    dst = Path(args.output)
    if not src.exists():
        sys.exit(f"input not found: {src}")
    dst.parent.mkdir(parents=True, exist_ok=True)

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    print(f"device: {device}")

    cap = cv2.VideoCapture(str(src))
    if not cap.isOpened():
        sys.exit(f"failed to open {src}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"input: {W}x{H} @ {fps:.2f} fps, {total} frames")

    model = load_model(args.encoder, device)
    print(f"model: {args.encoder}, max-side: {args.max_side}")

    # Per-clip depth range — we want a consistent grayscale mapping
    # across frames so the shader's threshold doesn't flicker. Strategy:
    # do a quick pass on the first 8 evenly-spaced frames to find the
    # min/max disparity, then use those bounds for the full run.
    sample_idx = np.linspace(0, total - 1, min(8, total)).astype(int)
    print("calibrating depth range across 8 sample frames…")
    sample_depths = []
    for i in sample_idx:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(i))
        ok, frame = cap.read()
        if not ok:
            continue
        depth = model.infer_image(frame, args.max_side)
        sample_depths.append(depth)
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    all_depths = np.concatenate([d.flatten() for d in sample_depths])
    lo, hi = np.percentile(all_depths, [1, 99])
    print(f"depth range: {lo:.3f} … {hi:.3f}")

    # Pipe raw grayscale frames directly into ffmpeg so we never need
    # to materialise the uncompressed YUV (would be hundreds of MB to
    # GB per clip and blow up /tmp on a constrained drive).
    print(f"encoding depth video → {dst}")
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-pix_fmt", "gray",
        "-s", f"{W}x{H}",
        "-r", f"{fps}",
        "-i", "pipe:0",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "22",
        "-g", "1", "-keyint_min", "1", "-sc_threshold", "0",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        str(dst),
    ]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    assert ff.stdin is not None

    t0 = time.time()
    n = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        depth = model.infer_image(frame, args.max_side)
        d_norm = np.clip((depth - lo) / max(1e-3, (hi - lo)), 0, 1)
        d_u8 = (d_norm * 255).astype(np.uint8)
        if d_u8.shape != (H, W):
            d_u8 = cv2.resize(d_u8, (W, H), interpolation=cv2.INTER_LINEAR)
        try:
            ff.stdin.write(d_u8.tobytes())
        except BrokenPipeError:
            break
        n += 1
        if n % 30 == 0:
            elapsed = time.time() - t0
            print(f"  {n}/{total}  ({n / max(0.001, elapsed):.1f} fps)")
    ff.stdin.close()
    cap.release()
    rc = ff.wait()
    if rc != 0:
        sys.exit(f"ffmpeg exited with code {rc}")
    dt = time.time() - t0
    print(f"inference done: {n} frames in {dt:.1f}s ({n/dt:.1f} fps)")
    sz = dst.stat().st_size / (1024 * 1024)
    print(f"wrote {dst} ({sz:.1f} MB)")


if __name__ == "__main__":
    main()
