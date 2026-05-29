/**
 * Comparison variants that use per-frame DA-V2 depth videos instead of
 * the heuristic static mask. Sea procedural motion + cursor effects are
 * gated by live depth, so the moving yacht stays masked correctly.
 *
 * Each source video gets multiple model/resolution combos for visual
 * comparison. Existing /preview-video routes stay untouched.
 */
import type { Typography, CanvasOverrides } from "@/components/site/HomeVideoScene";

export type Layout = "bottom-left" | "center" | "right-band";

export interface DepthVariant {
  slug: string;
  source: "shorten" | "shorten-hero" | "vertical";
  /** Which DA-V2 model + max-side combo generated this depth video. */
  preset: { encoder: "vits" | "vitb" | "vitl"; maxSide: 518 | 756 };
  tag: string;
  typography: Typography;
  layout?: Layout;
  headlineParts: { lead: string; accent: string; trail?: string };
  sub: string;
  canvas: CanvasOverrides;
  /** Water depth band — pixels with normalized depth in this range are
   *  treated as sea. Outside the band = static foreground. Tune per
   *  scene to match the dominant sea depth in the source. */
  depthRange: [number, number];
  /** Depth value above which a pixel is treated as yacht (static).
   *  Tuned per source from the actual depth distribution. */
  yachtDepth?: number;
  /** Screen-Y (0 bottom, 1 top) where the horizon sits. Top of viewport
   *  above this stays static. */
  horizonY?: number;
  scrubViewports?: number;
  panMode?: "none" | "vertical";
}

interface ColorSource {
  full: string;
  mobile: string;
  poster: string;
  aspect: number;
  mask: string;  // fallback if depth video not yet generated
}

export const colorSources: Record<DepthVariant["source"], ColorSource> = {
  "shorten": {
    full: "/sea-society/video/shorten-scrub.mp4",
    mobile: "/sea-society/video/shorten-scrub-720.mp4",
    poster: "/sea-society/video/shorten-poster.jpg",
    aspect: 16 / 9,
    mask: "/sea-society/video/shorten-mask.png",
  },
  "shorten-hero": {
    full: "/sea-society/video/shorten-hero-scrub.mp4",
    mobile: "/sea-society/video/shorten-hero-scrub-720.mp4",
    poster: "/sea-society/video/shorten-hero-poster.jpg",
    aspect: 16 / 9,
    mask: "/sea-society/video/shorten-hero-mask.png",
  },
  "vertical": {
    full: "/sea-society/video/vertical-scrub.mp4",
    mobile: "/sea-society/video/vertical-scrub-720.mp4",
    poster: "/sea-society/video/vertical-poster.jpg",
    aspect: 9 / 16,
    mask: "/sea-society/video/vertical-mask.png",
  },
};

export function depthVideoSrc(v: DepthVariant): string {
  return `/sea-society/video/${v.source}-depth-${v.preset.encoder}-${v.preset.maxSide}.mp4`;
}

// Default copy + canvas tuning per source — kept identical across the
// depth-comparison variants so the depth source is the only differing
// dimension.
const COPY = {
  "shorten": {
    headlineParts: { lead: "Ibiza is ", accent: "different", trail: " from the sea." },
    sub: "Per-frame DA-V2 depth · scroll to scrub.",
    layout: "bottom-left" as Layout,
    canvas: {
      cursorLightStrength: 0.20,
      shimmerStrength: 0.22,
      brightnessLift: 1.10,
      saturation: 1.06,
      contrast: 1.02,
      parallaxX: 0.012,
      parallaxY: 0.006,
      waterMotion: 0.014,        // was 0.006 — 2.3× stronger so the
                                 // sea visibly breathes on a paused
                                 // frame
    },
    scrubViewports: 6.0,
    yachtDepth: 0.93,            // tightened from 0.88 — only the very
                                 // brightest hull pixels lock, so the
                                 // procedural wave displacement no
                                 // longer bleeds onto hull edges
    horizonY: 0.62,
  },
  "shorten-hero": {
    headlineParts: { lead: "The Mediterranean, ", accent: "as you should see it", trail: "." },
    sub: "Per-frame DA-V2 depth · scroll to scrub.",
    layout: "bottom-left" as Layout,
    canvas: {
      cursorLightStrength: 0.20,
      shimmerStrength: 0.22,
      brightnessLift: 1.10,
      saturation: 1.10,
      contrast: 1.02,
      parallaxX: 0.012,
      parallaxY: 0.006,
      waterMotion: 0.014,
    },
    scrubViewports: 5.0,
    yachtDepth: 0.92,
    horizonY: 0.60,
  },
  "vertical": {
    headlineParts: { lead: "From above the ", accent: "Mediterranean", trail: "." },
    sub: "Per-frame DA-V2 depth · scroll to descend.",
    layout: "bottom-left" as Layout,
    canvas: {
      cursorLightStrength: 0.20,
      shimmerStrength: 0.22,
      brightnessLift: 1.10,
      saturation: 1.10,
      contrast: 1.02,
      parallaxX: 0.010,
      parallaxY: 0.005,
      waterMotion: 0.014,
    },
    scrubViewports: 5.0,
    panMode: "vertical" as const,
    yachtDepth: 0.92,
    horizonY: 0.55,
  },
};

const PRESETS: DepthVariant["preset"][] = [
  { encoder: "vits", maxSide: 518 },
  { encoder: "vits", maxSide: 756 },
  { encoder: "vitb", maxSide: 518 },
  { encoder: "vitl", maxSide: 518 },
];

// Per-source default water-depth range. Tuned against the depth
// distribution of the actual generated depth videos: yacht peaks above
// 0.85, sky drops below 0.15, sea fills the broad middle band.
const DEPTH_RANGE: Record<DepthVariant["source"], [number, number]> = {
  "shorten": [0.20, 0.78],
  "shorten-hero": [0.20, 0.78],
  "vertical": [0.20, 0.80],
};

export const variants: DepthVariant[] = [];
const sources: DepthVariant["source"][] = ["shorten", "shorten-hero", "vertical"];
for (const source of sources) {
  const copy = COPY[source];
  for (const preset of PRESETS) {
    const presetTag = `${preset.encoder.toUpperCase()} @${preset.maxSide}`;
    variants.push({
      slug: `${source}-${preset.encoder}-${preset.maxSide}`,
      source,
      preset,
      tag: `${source} · ${presetTag}`,
      typography: "editorial-serif",
      headlineParts: copy.headlineParts,
      sub: copy.sub,
      layout: copy.layout,
      canvas: copy.canvas,
      depthRange: DEPTH_RANGE[source],
      yachtDepth: "yachtDepth" in copy ? copy.yachtDepth : 0.85,
      horizonY: "horizonY" in copy ? copy.horizonY : 0.65,
      scrubViewports: copy.scrubViewports,
      panMode: "panMode" in copy ? copy.panMode : "none",
    });
  }
}
