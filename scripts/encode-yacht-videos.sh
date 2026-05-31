#!/usr/bin/env bash
# Encode the 9 source yacht videos into yoyo loops (forward + reversed)
# at two resolutions, plus a first-frame WebP poster for the LCP layer.
#
# Output: public/sea-society/yacht-videos/{stem}-loop.mp4, -loop-720.mp4, -poster.webp
set -euo pipefail

SRC_DIR="sea-society/videos"
OUT_DIR="public/sea-society/yacht-videos"
mkdir -p "$OUT_DIR"

encode() {
  local src="$1" stem="$2"
  echo "[$stem] poster..."
  local tmp_png="/tmp/${stem}-poster.png"
  ffmpeg -y -loglevel error -i "$src" -vframes 1 -vf "scale=1920:-2" "$tmp_png"
  cwebp -q 72 "$tmp_png" -o "$OUT_DIR/${stem}-poster.webp" -quiet
  rm -f "$tmp_png"

  # Hi tier: full 1920×1080 30fps, H.264 CRF 21 -tune film, hard
  # cap 6 Mbit/s. Forward-only (no yoyo) — the player plays once
  # and stops at the last frame; scroll-to-top from page bottom
  # triggers a single replay. This gives source-quality footage at
  # ~14-22 MB per clip.
  echo "[$stem] 1080p hi..."
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale=1920:-2,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 21 -tune film -profile:v high -level 4.1 \
    -maxrate 6M -bufsize 12M \
    -movflags +faststart -an "$OUT_DIR/${stem}-loop.mp4"

  # Lo tier: 1280×720 30fps CRF 24, cap 2.5 Mbit/s. ~6-12 MB,
  # served on innerWidth < 1100 (phones).
  echo "[$stem] 720p lo..."
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale=1280:-2,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 24 -tune film -profile:v high -level 4.0 \
    -maxrate 2.5M -bufsize 5M \
    -movflags +faststart -an "$OUT_DIR/${stem}-loop-720.mp4"

  ls -la "$OUT_DIR/${stem}-loop.mp4" "$OUT_DIR/${stem}-loop-720.mp4" "$OUT_DIR/${stem}-poster.webp" | awk '{print $5, $NF}'
}

encode "$SRC_DIR/Ariyas.mov"          ariyas
encode "$SRC_DIR/Chloe.mov"           chloe
encode "$SRC_DIR/DoctorNo.mov"        dr-no
encode "$SRC_DIR/Ella.mov"            ella
encode "$SRC_DIR/Inspiration.mov"     inspiration
encode "$SRC_DIR/Manreboll.mov"       manbero
encode "$SRC_DIR/Mazu.mov"            mazu
encode "$SRC_DIR/Sensation.mov"       sensation
encode "$SRC_DIR/TranquillityIII.mov" tranquility

echo "Done."
