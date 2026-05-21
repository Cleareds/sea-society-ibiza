#!/usr/bin/env node
/**
 * Render the brand SVG into a 180×180 PNG apple-touch-icon plus a 32×32
 * favicon.ico. Run once when the favicon changes.
 *
 *   node scripts/make-apple-icon.mjs
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile("public/favicon.svg");

await sharp(svg, { density: 720 })
  .resize(180, 180)
  .png()
  .toFile("public/apple-touch-icon.png");
console.log("✓ apple-touch-icon.png (180×180)");

await sharp(svg, { density: 720 })
  .resize(32, 32)
  .toFormat("png")
  .toFile("public/favicon.ico");
console.log("✓ favicon.ico (32×32)");
