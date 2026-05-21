#!/usr/bin/env node
/**
 * One-off: take the source hero PNG and emit a high-quality WebP optimised
 * for LCP. We resize down to 2560px wide (covers any 2x DPR viewport up to
 * ~1280px CSS width — i.e. every device that matters), and use quality 82
 * which is the cliff in the WebP rate-distortion curve for photographic
 * content. Output replaces the local copy used by the homepage hero.
 *
 * Run: `node scripts/convert-hero.mjs`
 */
import sharp from "sharp";
import { stat } from "node:fs/promises";

const input = "public/images/hero/el-verde.png";
const output = "public/images/hero/el-verde.webp";

const srcStat = await stat(input);
console.log(`source: ${input} (${(srcStat.size / 1024 / 1024).toFixed(2)} MB)`);

await sharp(input)
  .resize({ width: 2560, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toFile(output);

const outStat = await stat(output);
console.log(
  `output: ${output} (${(outStat.size / 1024).toFixed(0)} KB, ${(
    (1 - outStat.size / srcStat.size) *
    100
  ).toFixed(1)}% smaller)`,
);
