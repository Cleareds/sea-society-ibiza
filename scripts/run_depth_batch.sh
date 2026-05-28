#!/usr/bin/env bash
# Paced overnight DA-V2 batch.
#
# Generates multiple depth-video qualities for each source clip so the
# user can compare. Sleeps 30s between runs so the GPU/Neural Engine
# isn't pegged continuously.
#
# Naming:    <source>-depth-<encoder>-<maxside>.mp4
#
# Outputs (≈ 10 files):
#   shorten-depth-vits-518.mp4         shorten-hero-depth-vits-518.mp4 (already exists)
#   shorten-depth-vits-756.mp4         shorten-hero-depth-vits-756.mp4
#   shorten-depth-vitb-518.mp4         shorten-hero-depth-vitb-518.mp4
#   shorten-depth-vitl-518.mp4         shorten-hero-depth-vitl-518.mp4
#   vertical-depth-vits-518.mp4        vertical-depth-vitb-518.mp4
#
# Total est. compute: ~70-90 min across all clips with pauses.

set -e
cd "$(dirname "$0")/.."

mkdir -p public/sea-society/video
mkdir -p logs

run() {
  local src=$1 enc=$2 mx=$3 out=$4
  if [ -f "public/sea-society/video/$out" ]; then
    echo "skip $out (exists)"
    return
  fi
  echo "==> $src | $enc | $mx → $out"
  python3 scripts/gen_depth_video.py \
    "designs/$src" \
    "public/sea-society/video/$out" \
    --encoder "$enc" --max-side "$mx" \
    > "logs/${out%.mp4}.log" 2>&1
  echo "    done — $(ls -lh public/sea-society/video/$out | awk '{print $5}')"
  # Pause between runs so the GPU stays cool.
  echo "    sleeping 30s before next run…"
  sleep 30
}

# --- Cliffs (9s, 276 frames, the fastest to verify) ---
# vits-518 already done — keep
run "shorten_hero.mov" "vits" 756 "shorten-hero-depth-vits-756.mp4"
run "shorten_hero.mov" "vitb" 518 "shorten-hero-depth-vitb-518.mp4"
run "shorten_hero.mov" "vitl" 518 "shorten-hero-depth-vitl-518.mp4"

# --- Vertical (2s, 68 frames, fastest of all) ---
run "vertical one.mov" "vits" 518 "vertical-depth-vits-518.mp4"
run "vertical one.mov" "vits" 756 "vertical-depth-vits-756.mp4"
run "vertical one.mov" "vitb" 518 "vertical-depth-vitb-518.mp4"
run "vertical one.mov" "vitl" 518 "vertical-depth-vitl-518.mp4"

# --- Open sea (30s, 920 frames, the longest) ---
# Run vits first; if compute is comfortable, do the other variants.
run "shorten.mov" "vits" 518 "shorten-depth-vits-518.mp4"
run "shorten.mov" "vits" 756 "shorten-depth-vits-756.mp4"
run "shorten.mov" "vitb" 518 "shorten-depth-vitb-518.mp4"
run "shorten.mov" "vitl" 518 "shorten-depth-vitl-518.mp4"

echo "ALL DONE"
ls -lh public/sea-society/video/*depth*.mp4
