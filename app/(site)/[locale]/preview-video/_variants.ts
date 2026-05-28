import type { Typography, CanvasOverrides } from "@/components/site/HomeVideoScene";

export type Layout = "bottom-left" | "center" | "right-band";

export interface Variant {
  slug: string;
  video: "open-sea" | "cliffs" | "vertical";
  tag: string;
  typography: Typography;
  layout?: Layout;
  headlineParts: { lead: string; accent: string; trail?: string };
  sub: string;
  canvas: CanvasOverrides;
  /** Scroll runway height in viewports. Longer = slower scrub. */
  scrubViewports?: number;
  /** Vertical pan through the source video as user scrolls. */
  panMode?: "none" | "vertical";
}

const SHORTEN = {
  full: "/sea-society/video/shorten-scrub.mp4",
  mobile: "/sea-society/video/shorten-scrub-720.mp4",
  mask: "/sea-society/video/shorten-mask.png",
  poster: "/sea-society/video/shorten-poster.jpg",
  aspect: 16 / 9,
};

const HERO = {
  full: "/sea-society/video/shorten-hero-scrub.mp4",
  mobile: "/sea-society/video/shorten-hero-scrub-720.mp4",
  mask: "/sea-society/video/shorten-hero-mask.png",
  poster: "/sea-society/video/shorten-hero-poster.jpg",
  aspect: 16 / 9,
};

const VERTICAL = {
  full: "/sea-society/video/vertical-scrub.mp4",
  mobile: "/sea-society/video/vertical-scrub-720.mp4",
  mask: "/sea-society/video/vertical-mask.png",
  poster: "/sea-society/video/vertical-poster.jpg",
  aspect: 9 / 16,
};

export const videoSources = { "open-sea": SHORTEN, cliffs: HERO, vertical: VERTICAL } as const;

// Three variants — same scroll-scrub treatment, one per source video.
// The runway is intentionally LONG so fast scrollers don't blow past
// the footage in a glance; scrubViewports is the per-variant knob.
export const variants: Variant[] = [
  {
    slug: "open-sea",
    video: "open-sea",
    tag: "Open sea · scroll to scrub",
    typography: "editorial-serif",
    layout: "bottom-left",
    headlineParts: {
      lead: "Ibiza is ",
      accent: "different",
      trail: " from the sea.",
    },
    sub: "Scroll. The frame answers. Scroll back, it returns.",
    canvas: {
      cursorLightStrength: 0.14,
      shimmerStrength: 0.08,
      brightnessLift: 1.10,
      saturation: 1.06,
      contrast: 1.02,
      parallaxX: 0.008,
      parallaxY: 0.004,
    },
    scrubViewports: 5.0,
  },
  {
    slug: "cliffs",
    video: "cliffs",
    tag: "Cliffs · scroll to scrub",
    typography: "editorial-serif",
    layout: "bottom-left",
    headlineParts: {
      lead: "The Mediterranean, ",
      accent: "as you should see it",
      trail: ".",
    },
    sub: "Scroll. The frame answers. Scroll back, it returns.",
    canvas: {
      cursorLightStrength: 0.14,
      shimmerStrength: 0.08,
      brightnessLift: 1.10,
      saturation: 1.10,
      contrast: 1.02,
      parallaxX: 0.008,
      parallaxY: 0.004,
    },
    scrubViewports: 4.0,
  },
  {
    slug: "vertical",
    video: "vertical",
    tag: "Vertical · pan + scrub",
    typography: "editorial-serif",
    layout: "bottom-left",
    headlineParts: {
      lead: "From above the ",
      accent: "Mediterranean",
      trail: ".",
    },
    sub: "Scroll to descend. The view changes with you.",
    canvas: {
      cursorLightStrength: 0.14,
      shimmerStrength: 0.08,
      brightnessLift: 1.10,
      saturation: 1.10,
      contrast: 1.02,
      parallaxX: 0.006,
      parallaxY: 0.003,
    },
    scrubViewports: 4.0,
    panMode: "vertical",
  },
];
