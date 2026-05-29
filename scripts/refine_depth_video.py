"""
Refine a DA-V2 depth video by snapping its edges to the color video.

Single-image depth models give correct STRUCTURE (large-scale shape)
but smooth out the high-frequency edges that line up with object
silhouettes — mountains, yacht rigging, etc. The standard fix is a
joint bilateral filter: blur the depth, but only across pixels that
also share colour in the source frame. Result: depth gradients
follow colour gradients without inventing new detail.

Inputs:  source color video + DA-V2 depth video (same length / fps)
Output:  edge-sharpened depth video, same dimensions

Usage:
  python3 scripts/refine_depth_video.py \\
    public/sea-society/video/shorten-scrub.mp4 \\
    public/sea-society/video/shorten-depth-vitl-518.mp4 \\
    public/sea-society/video/shorten-depth-vitl-518-refined.mp4
"""
from __future__ import annotations
import argparse
import subprocess
import sys
import time
from pathlib import Path

import cv2
import numpy as np


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("color")
    ap.add_argument("depth")
    ap.add_argument("output")
    ap.add_argument("--diameter", type=int, default=15,
                    help="bilateral filter spatial size (px)")
    ap.add_argument("--sigma-color", type=float, default=45.0,
                    help="how similar in colour two pixels must be to "
                         "share depth — lower = sharper edges, higher "
                         "= smoother result")
    ap.add_argument("--sigma-space", type=float, default=15.0,
                    help="spatial falloff in pixels")
    args = ap.parse_args()

    cap_c = cv2.VideoCapture(args.color)
    cap_d = cv2.VideoCapture(args.depth)
    if not (cap_c.isOpened() and cap_d.isOpened()):
        sys.exit("failed to open one of the inputs")

    W = int(cap_c.get(cv2.CAP_PROP_FRAME_WIDTH))
    H = int(cap_c.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap_c.get(cv2.CAP_PROP_FPS) or 30.0
    n = int(cap_c.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"color: {W}x{H} @ {fps:.2f} fps, {n} frames")

    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-pix_fmt", "gray",
        "-s", f"{W}x{H}", "-r", f"{fps}",
        "-i", "pipe:0",
        "-c:v", "libx264", "-preset", "medium", "-crf", "22",
        "-g", "1", "-keyint_min", "1", "-sc_threshold", "0",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
        args.output,
    ]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                           stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL)
    assert ff.stdin is not None

    t0 = time.time()
    i = 0
    while True:
        ok_c, fc = cap_c.read()
        ok_d, fd = cap_d.read()
        if not (ok_c and ok_d):
            break
        # Joint bilateral on the depth, guided by the color frame.
        depth = fd[..., 0]
        # cv2.ximgproc.jointBilateralFilter would be ideal but is
        # opencv-contrib-only. A close approximation is to blend a
        # blurred depth with a color-guided edge-aware mask:
        depth_blur = cv2.bilateralFilter(depth, args.diameter,
                                          args.sigma_color, args.sigma_space)
        # Use color frame to detect edges (Sobel on luminance), then
        # let the original depth come through near those edges.
        gray = cv2.cvtColor(fc, cv2.COLOR_BGR2GRAY)
        gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
        gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
        edge_mag = np.sqrt(gx * gx + gy * gy)
        edge_mag = np.clip(edge_mag / max(1.0, np.percentile(edge_mag, 98)), 0, 1)
        # Mix: 1.0 of blurred where no edge, 1.0 of original where strong edge
        out = (depth.astype(np.float32) * edge_mag
               + depth_blur.astype(np.float32) * (1.0 - edge_mag))
        out_u8 = np.clip(out, 0, 255).astype(np.uint8)
        ff.stdin.write(out_u8.tobytes())
        i += 1
        if i % 60 == 0:
            elapsed = time.time() - t0
            print(f"  {i}/{n}  ({i / max(0.001, elapsed):.1f} fps)")
    ff.stdin.close()
    rc = ff.wait()
    cap_c.release()
    cap_d.release()
    if rc != 0:
        sys.exit(f"ffmpeg exited with code {rc}")
    sz = Path(args.output).stat().st_size / (1024 * 1024)
    dt = time.time() - t0
    print(f"refined {i} frames in {dt:.1f}s ({i/dt:.1f} fps) → {args.output} ({sz:.1f} MB)")


if __name__ == "__main__":
    main()
