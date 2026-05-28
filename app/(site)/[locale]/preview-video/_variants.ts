import type { Typography, CanvasOverrides } from "@/components/site/HomeVideoScene";

export type Layout = "bottom-left" | "center" | "right-band";

export interface Variant {
  slug: string;
  video: "open-sea" | "cliffs";
  tag: string;
  typography: Typography;
  layout?: Layout;
  headlineParts: { lead: string; accent: string; trail?: string };
  sub: string;
  canvas: CanvasOverrides;
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

export const videoSources = { "open-sea": SHORTEN, cliffs: HERO } as const;

// Two variants only — same scroll-scrub treatment, one per source video.
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
    sub: "Scroll. Every pixel is the boat one frame later. Scroll back, it returns.",
    canvas: {
      cursorLightStrength: 0.14,
      shimmerStrength: 0.08,
      brightnessLift: 1.10,
      saturation: 1.06,
      contrast: 1.02,
      parallaxX: 0.008,
      parallaxY: 0.004,
    },
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
    sub: "Scroll. Every pixel is the boat one frame later. Scroll back, it returns.",
    canvas: {
      cursorLightStrength: 0.14,
      shimmerStrength: 0.08,
      brightnessLift: 1.10,
      saturation: 1.10,
      contrast: 1.02,
      parallaxX: 0.008,
      parallaxY: 0.004,
    },
  },
];
