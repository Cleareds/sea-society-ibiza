#!/usr/bin/env bash
# Resize + webp-convert the per-boat JPG sets from
# sea-society/FLOTA IBIMAR CHARTER/<n>. MODEL-NAME/ into
# public/sea-society/fleet-gallery/<slug>/<i>.webp at 1600px wide,
# quality 82. Skips deck-plan ("plano") shots. Up to 8 images / boat.
set -euo pipefail

ROOT="/Users/antonkravchuk/sidep/ibiza"
SRC_BASE="$ROOT/sea-society/FLOTA IBIMAR CHARTER"
DST_BASE="$ROOT/public/sea-society/fleet-gallery"
MAX_PER_BOAT=8

# folder name → DB slug
mappings=(
  "1. RIVA ARGO 90-ELLA|ella-riva-argo-90"
  "2. MANGUSTA 108-BELISA|belisa-mangusta-108"
  "3. PERSHING 90-INSPIRATION|inspiration-pershing-90"
  "4. SUNREEF 70+ - YOLO|yolo-sunreef-70"
  "5. ARCADIA 85 - ETERNITY 44|eternity-44-arcadia-85"
  "6. SUNSEEKER PREDATOR 84-ARIYAS|ariyas-sunseeker-predator-84"
  "7. SUNSEEKER PREDATOR 82-GEORGIA|georgia-sunseeker-predator-82"
  "8. PERSHING 72-SENSATION|sensation-pershing-72"
  "9. PRINCESS V72-RUBY TUESDAY|ruby-tuesday-princess-v72"
  "10. SUNSEEKER PREDATOR 74-BLACK JAX|black-jax-sunseeker-predator-74"
  "11. PERSHING 6X - DR. NO|dr-no-pershing-6x"
  "12. SUNSEEKER PREDATOR 72-N9|number-9-sunseeker-predator-72"
  "13. SUNSEEKER PREDATOR 68-TRANQUILITY|tranquility-iii-sunseeker-predator-68"
  "14. ASTONDOA 80-MAZU|mazu-astondoa-80"
  "15. PRINCESS V58 - CHLOE|chloe-princess-v58"
  "16 PRINCESS V58-SHAKA LAKA|shaka-laka-princess-v58"
  "17. RIVA RIVALE 52-INVICTUS|invictus-riva-rivale-52"
  "18. PRINCESS V53-MANBERO|manbero-ii-princess-v53"
  "19. VANDUTCH 40-MAJESTIC|majestic-vandutch-40"
  "20. SACS STRATOS 42 - FLOPPY|floppy-sacs-stratos-42"
  "21. NOAH29FB-DJANGO|django-noah-29fb"
)

mkdir -p "$DST_BASE"

for m in "${mappings[@]}"; do
  folder="${m%|*}"
  slug="${m#*|}"
  src="$SRC_BASE/$folder"
  dst="$DST_BASE/$slug"

  if [ ! -d "$src" ]; then
    echo "skip (missing): $folder" >&2
    continue
  fi

  mkdir -p "$dst"
  # Clean any previous run so re-runs don't accumulate stale files.
  rm -f "$dst"/*.webp

  i=1
  while IFS= read -r img; do
    [ $i -gt $MAX_PER_BOAT ] && break
    if cwebp -quiet -q 82 -resize 1600 0 "$img" -o "$dst/$i.webp"; then
      i=$((i+1))
    fi
  done < <(find "$src" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) ! -iname "*plano*" ! -iname "*plan*" | LC_ALL=C sort)

  printf "%-46s %d images → %s\n" "$slug" "$((i-1))" "$(du -sh "$dst" | awk '{print $1}')"
done

echo "---"
echo "Total: $(du -sh "$DST_BASE" | awk '{print $1}')"
