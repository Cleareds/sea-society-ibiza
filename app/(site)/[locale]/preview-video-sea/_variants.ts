/**
 * Comparison routes for the synthetic-sea shader. Sea pixels are
 * replaced by a Gerstner-driven sea (waves + Fresnel + sun glint +
 * foam), gated by the per-frame DA-V2 depth mask so yacht / mountains
 * / sky stay photographic.
 *
 * Existing /preview-video and /preview-video-depth routes are
 * untouched.
 */

export interface SeaVariant {
  slug: string;
  source: "shorten" | "shorten-hero" | "vertical";
  tag: string;
  /** Pick a depth video for the mask; defaults to vits-518 (smallest). */
  depthPreset: { encoder: "vits" | "vitb" | "vitl"; maxSide: 518 | 756 };
  headlineParts: { lead: string; accent: string; trail?: string };
  sub: string;
  /** Synthetic-sea colour palette per variant. */
  shallow: [number, number, number];
  deep: [number, number, number];
  foam: [number, number, number];
  sunDir: [number, number, number];
  depthRange: [number, number];
  scrubViewports?: number;
  panMode?: "none" | "vertical";
}

const COLORS = {
  // Turquoise palette — close to Mediterranean afternoon.
  TURQUOISE: {
    shallow: [0.32, 0.78, 0.85] as [number, number, number],
    deep: [0.02, 0.10, 0.22] as [number, number, number],
    foam: [0.96, 0.99, 1.00] as [number, number, number],
  },
  // Evening / golden-hour cool palette — for shorten.mov.
  EVENING: {
    shallow: [0.22, 0.42, 0.55] as [number, number, number],
    deep: [0.02, 0.07, 0.15] as [number, number, number],
    foam: [0.95, 0.92, 0.86] as [number, number, number],
  },
};

export const colorSources = {
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
} as const;

export function depthVideoForVariant(v: SeaVariant): string {
  return `/sea-society/video/${v.source}-depth-${v.depthPreset.encoder}-${v.depthPreset.maxSide}.mp4`;
}

export const variants: SeaVariant[] = [
  {
    slug: "open-sea",
    source: "shorten",
    tag: "Open sea · synthetic Gerstner sea",
    depthPreset: { encoder: "vitl", maxSide: 518 },
    headlineParts: {
      lead: "Ibiza is ",
      accent: "different",
      trail: " from the sea.",
    },
    sub: "Synthetic sea surface · scroll to scrub.",
    shallow: COLORS.EVENING.shallow,
    deep: COLORS.EVENING.deep,
    foam: COLORS.EVENING.foam,
    sunDir: [0.55, 0.20, 0.80],
    depthRange: [0.20, 0.78],
    scrubViewports: 6.0,
  },
  {
    slug: "cliffs",
    source: "shorten-hero",
    tag: "Cliffs · synthetic Gerstner sea",
    depthPreset: { encoder: "vitl", maxSide: 518 },
    headlineParts: {
      lead: "The Mediterranean, ",
      accent: "as you should see it",
      trail: ".",
    },
    sub: "Synthetic sea surface · scroll to scrub.",
    shallow: COLORS.TURQUOISE.shallow,
    deep: COLORS.TURQUOISE.deep,
    foam: COLORS.TURQUOISE.foam,
    sunDir: [0.40, 0.40, 0.82],
    depthRange: [0.20, 0.78],
    scrubViewports: 5.0,
  },
  {
    slug: "vertical",
    source: "vertical",
    tag: "Vertical · synthetic Gerstner sea",
    depthPreset: { encoder: "vitl", maxSide: 518 },
    headlineParts: {
      lead: "From above the ",
      accent: "Mediterranean",
      trail: ".",
    },
    sub: "Synthetic sea surface · scroll to descend.",
    shallow: COLORS.TURQUOISE.shallow,
    deep: COLORS.TURQUOISE.deep,
    foam: COLORS.TURQUOISE.foam,
    sunDir: [0.20, 0.30, 0.93],
    depthRange: [0.20, 0.80],
    scrubViewports: 5.0,
    panMode: "vertical",
  },
];
