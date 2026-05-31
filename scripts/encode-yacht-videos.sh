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

  # Hi tier: 1280×720 @ 24fps, CRF 28 with hard bitrate cap at
  # 2 Mbit/s. Water + boat highlights are high-entropy; without
  # the cap CRF 28 runs to 5+ Mbit/s. Cap gives us ~9 MB per ~35s
  # yoyo while keeping film-tuned visual fidelity.
  echo "[$stem] 720p hi yoyo..."
  ffmpeg -y -loglevel error -i "$src" -filter_complex \
    "[0:v]scale=1280:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,fps=24,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -preset slow -crf 28 -tune film -profile:v high -level 4.0 \
    -maxrate 2M -bufsize 4M \
    -movflags +faststart -an "$OUT_DIR/${stem}-loop.mp4"

  # Lo tier: 960×540 @ 24fps, CRF 30, hard cap 1 Mbit/s. ~4 MB
  # per yoyo, used on innerWidth < 1100.
  echo "[$stem] 540p lo yoyo..."
  ffmpeg -y -loglevel error -i "$src" -filter_complex \
    "[0:v]scale=960:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,fps=24,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -preset slow -crf 30 -tune film -profile:v main -level 3.1 \
    -maxrate 1M -bufsize 2M \
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
