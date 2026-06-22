#!/usr/bin/env bash
# Second batch of yacht hero videos. Same encode recipe as
# encode-yacht-videos.sh (forward-only H.264, 1080p hi + 720p lo, WebP
# poster) but sources live in the local-only ./boats drop folder with
# their original filenames.
#
# Output: public/sea-society/yacht-videos/{stem}-loop.mp4, -loop-720.mp4, -poster.webp
set -euo pipefail

OUT_DIR="public/sea-society/yacht-videos"
mkdir -p "$OUT_DIR"

encode() {
  local src="$1" stem="$2"
  echo "[$stem] poster..."
  local tmp_png="/tmp/${stem}-poster.png"
  ffmpeg -y -loglevel error -i "$src" -vframes 1 -vf "scale=1920:-2" "$tmp_png"
  cwebp -q 72 "$tmp_png" -o "$OUT_DIR/${stem}-poster.webp" -quiet
  rm -f "$tmp_png"

  echo "[$stem] 1080p hi..."
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale=1920:-2,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 21 -tune film -profile:v high -level 4.1 \
    -maxrate 6M -bufsize 12M \
    -movflags +faststart -an "$OUT_DIR/${stem}-loop.mp4"

  echo "[$stem] 720p lo..."
  ffmpeg -y -loglevel error -i "$src" \
    -vf "scale=1280:-2,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -crf 24 -tune film -profile:v high -level 4.0 \
    -maxrate 2.5M -bufsize 5M \
    -movflags +faststart -an "$OUT_DIR/${stem}-loop-720.mp4"

  ls -la "$OUT_DIR/${stem}-loop.mp4" "$OUT_DIR/${stem}-loop-720.mp4" "$OUT_DIR/${stem}-poster.webp" | awk '{print $5, $NF}'
}

encode "boats/belisa video.mov"   belisa
encode "boats/eternity.mov"       eternity
encode "boats/georgia video.mov"  georgia
encode "boats/INVICTUS.mov"       invictus
encode "boats/MAJECTIC.mov"       majestic
encode "boats/NR9.mov"            number-9
encode "boats/RUBY.mov"           ruby
encode "boats/yolo.mov"           yolo

echo "Done."
