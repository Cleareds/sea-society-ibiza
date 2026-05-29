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
  // Turquoise palette — close to Mediterranean afternoon. 'deep'
  // lifted from near-black to a mid-teal so the synth blend keeps
  // the photo's turquoise instead of dragging it dark.
  TURQUOISE: {
    shallow: [0.38, 0.82, 0.87] as [number, number, number],
    deep: [0.10, 0.32, 0.42] as [number, number, number],
    foam: [0.96, 0.99, 1.00] as [number, number, number],
  },
  // Evening / golden-hour cool palette — for shorten.mov.
  // 'deep' lifted from near-black so the blend with the photo doesn't
  // crush the sea pixels to dark.
  EVENING: {
    shallow: [0.32, 0.52, 0.62] as [number, number, number],
    deep: [0.10, 0.22, 0.32] as [number, number, number],
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
];
