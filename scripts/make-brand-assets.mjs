#!/usr/bin/env node
/**
 * Optimise the brand assets dropped into designs/brand/ and write usable
 * variants into /public/brand/ + the existing favicon spots.
 *
 *   node scripts/make-brand-assets.mjs
 *
 * Source resolutions are huge (11415 x 2943 logo, 4091 x 5389 icon) —
 * shipping them as-is would mean MB-sized requests for assets that show
 * at ~200 CSS px. This script emits sharp-sized variants we can serve
 * directly without going through any image proxy.
 */
import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";

const BRAND_SRC = "designs/brand";
const OUT = "public/brand";

await mkdir(OUT, { recursive: true });
await mkdir("public/fonts", { recursive: true });

// === Wordmark logos (aspect ratio ~3.88:1) ===
const logos = [
  { src: `${BRAND_SRC}/Logo/SeaSociety-Logo-Black.png`, base: "wordmark-dark" },
  { src: `${BRAND_SRC}/Logo/SeaSociety-Logo-White.png`, base: "wordmark-light" },
];

for (const { src, base } of logos) {
  const widths = [320, 640, 1200];
  for (const w of widths) {
    const dest = `${OUT}/${base}-${w}.webp`;
    await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 92, effort: 5, alphaQuality: 100 })
      .toFile(dest);
    console.log(`✓ ${dest}`);
  }
  // A png fallback for environments that need one (email signatures, etc.).
  await sharp(src)
    .resize({ width: 640 })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${base}-640.png`);
  console.log(`✓ ${OUT}/${base}-640.png`);
}

// === Icon mark — taller than wide (4091 × 5389). Fit inside a square. ===
const icons = [
  { src: `${BRAND_SRC}/Icon/SS-Icon.png`, base: "icon-dark" },
  { src: `${BRAND_SRC}/Icon/SS-Icon-white.png`, base: "icon-light" },
];

for (const { src, base } of icons) {
  for (const size of [180, 256, 512]) {
    const dest = `${OUT}/${base}-${size}.webp`;
    await sharp(src)
      .resize({
        width: size,
        height: size,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 92, effort: 5, alphaQuality: 100 })
      .toFile(dest);
    console.log(`✓ ${dest}`);
  }
}

// === Favicon + apple-touch-icon (replace the placeholder squares) ===
// apple-touch-icon: 180×180 with the brand turquoise as background
await sharp(`${BRAND_SRC}/Icon/SS-Icon-white.png`)
  .resize({
    width: 140,
    height: 140,
    fit: "contain",
    background: { r: 0, g: 101, b: 101, alpha: 1 },
  })
  .extend({
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    background: { r: 0, g: 101, b: 101, alpha: 1 },
  })
  .png()
  .toFile("public/apple-touch-icon.png");
console.log("✓ public/apple-touch-icon.png");

// favicon.ico — 32×32 dark icon on transparent
await sharp(`${BRAND_SRC}/Icon/SS-Icon.png`)
  .resize({
    width: 32,
    height: 32,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile("public/favicon.ico");
console.log("✓ public/favicon.ico");

// favicon.svg — replace with a 256×256 PNG-embedded SVG so existing
// metadata.icons["icon"][svg] still resolves. We can't easily generate
// a vector SVG from the raster, but a small wrapper works for browsers
// that read the SVG type=… line.
await sharp(`${BRAND_SRC}/Icon/SS-Icon.png`)
  .resize({ width: 192, height: 192, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("public/icon-192.png");
console.log("✓ public/icon-192.png");

await sharp(`${BRAND_SRC}/Icon/SS-Icon.png`)
  .resize({ width: 512, height: 512, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("public/icon-512.png");
console.log("✓ public/icon-512.png");

// === Fonts: copy Starc Serif into /public/fonts/ ===
const fontSrc = `${BRAND_SRC}/Fonts/STARC SERIF/Other Font Files`;
await copyFile(`${fontSrc}/StarcSerifRegular.woff2`, "public/fonts/StarcSerifRegular.woff2");
await copyFile(`${fontSrc}/StarcSerifRegular.woff`, "public/fonts/StarcSerifRegular.woff");
console.log("✓ public/fonts/StarcSerifRegular.woff2 + .woff");
