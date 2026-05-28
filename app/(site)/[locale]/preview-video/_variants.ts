import type { Typography, CanvasOverrides } from "@/components/site/HomeVideoScene";
// Layout is declared below; this comment is here so the file still
// surfaces the union if it gets re-imported elsewhere.

export type Layout = "bottom-left" | "center" | "right-band";

export interface Variant {
  /** Slug appended after /preview-video/. */
  slug: string;
  /** Which source video to use. */
  video: "open-sea" | "cliffs";
  /** Display label for the small tag on the page. */
  tag: string;
  /** Typography preset. */
  typography: Typography;
  /** Layout — where the headline + copy + CTA sits in the viewport. */
  layout?: Layout;
  /** Headline copy (JSX is built on the page using `brand-accent` class). */
  headlineParts: { lead: string; accent: string; trail?: string };
  sub: string;
  canvas: CanvasOverrides;
}

const SHORTEN = {
  full: "/sea-society/video/shorten.mp4",
  mobile: "/sea-society/video/shorten-720.mp4",
  mask: "/sea-society/video/shorten-mask.png",
  poster: "/sea-society/video/shorten-poster.jpg",
  // 1920 / 1080
  aspect: 16 / 9,
};

const HERO = {
  full: "/sea-society/video/shorten-hero.mp4",
  mobile: "/sea-society/video/shorten-hero-720.mp4",
  mask: "/sea-society/video/shorten-hero-mask.png",
  poster: "/sea-society/video/shorten-hero-poster.jpg",
  aspect: 16 / 9,
};

export const videoSources = { "open-sea": SHORTEN, cliffs: HERO } as const;

export const variants: Variant[] = [
  // --------------------------------------------------------------------
  // EXTRA — built after the first six. Different shader effects
  // (ripple, vignette) and a centred layout for comparison.
  // --------------------------------------------------------------------
  {
    slug: "open-sea-d",
    video: "open-sea",
    tag: "Open sea · D · interactive ripple",
    typography: "editorial-serif",
    layout: "bottom-left",
    headlineParts: {
      lead: "Move with the ",
      accent: "sea",
      trail: ".",
    },
    sub: "Hover anywhere on the water. The frame answers.",
    canvas: {
      cursorLightStrength: 0.16,
      shimmerStrength: 0.12,
      brightnessLift: 1.15,
      saturation: 1.08,
      contrast: 1.04,
      parallaxX: 0.012,
      parallaxY: 0.006,
      zoomEnd: 0.60,
      rippleStrength: 0.008,        // cursor ripples the water
      vignette: 0.0,
    },
  },
  {
    slug: "open-sea-e",
    video: "open-sea",
    tag: "Open sea · E · luxe vignette",
    typography: "classical",
    layout: "center",
    headlineParts: { lead: "Sea Society", accent: " Ibiza", trail: "" },
    sub: "Private charters · Botafoc Marina",
    canvas: {
      cursorLightStrength: 0.10,
      shimmerStrength: 0.06,
      brightnessLift: 1.05,
      tint: [0.97, 0.99, 1.05],
      saturation: 0.95,
      contrast: 1.08,
      parallaxX: 0.006,
      parallaxY: 0.003,
      zoomEnd: 0.80,
      vignette: 0.50,               // luxe darken at edges so the
                                    // centred copy lands cleanly
    },
  },
  {
    slug: "cliffs-d",
    video: "cliffs",
    tag: "Cliffs · D · ripple",
    typography: "mixed-weight",
    layout: "bottom-left",
    headlineParts: {
      lead: "A coastline ",
      accent: "you can touch",
      trail: ".",
    },
    sub: "Cliff anchorages, quiet coves, water that responds to where you are.",
    canvas: {
      cursorLightStrength: 0.20,
      shimmerStrength: 0.14,
      brightnessLift: 1.12,
      saturation: 1.14,
      contrast: 1.06,
      parallaxX: 0.012,
      parallaxY: 0.006,
      zoomEnd: 0.50,
      rippleStrength: 0.010,
    },
  },
  {
    slug: "cliffs-e",
    video: "cliffs",
    tag: "Cliffs · E · centred vignette",
    typography: "oversized-minimal",
    layout: "center",
    headlineParts: { lead: "", accent: "Anchor", trail: " anywhere." },
    sub: "Es Vedra · Es Calo · Cabrera.",
    canvas: {
      cursorLightStrength: 0.12,
      shimmerStrength: 0.10,
      brightnessLift: 1.08,
      tint: [1.02, 1.00, 0.97],
      saturation: 1.05,
      contrast: 1.06,
      parallaxX: 0.008,
      parallaxY: 0.004,
      zoomEnd: 0.65,
      vignette: 0.45,
    },
  },
  // --------------------------------------------------------------------
  // OPEN SEA (shorten.mov) — dark hull, evening light, cinematic distance.
  // --------------------------------------------------------------------
  {
    slug: "open-sea-a",
    video: "open-sea",
    tag: "Open sea · A · editorial",
    typography: "editorial-serif",
    headlineParts: {
      lead: "Ibiza is ",
      accent: "different",
      trail: " from the sea.",
    },
    sub: "From the moment you step aboard at Botafoc Marina to the moment you watch the sun dissolve into the Mediterranean, every detail is handled.",
    canvas: {
      cursorLightStrength: 0.18,
      shimmerStrength: 0.10,
      brightnessLift: 1.15,
      tint: [0.98, 1.00, 1.04],   // very subtle cool tint
      saturation: 1.08,
      contrast: 1.04,
      parallaxX: 0.010,
      parallaxY: 0.005,
      zoomEnd: 0.55,
      zoomCenter: [0.5, 0.52],
    },
  },
  {
    slug: "open-sea-b",
    video: "open-sea",
    tag: "Open sea · B · oversized minimal",
    typography: "oversized-minimal",
    headlineParts: {
      lead: "Built for the ",
      accent: "open water",
      trail: ".",
    },
    sub: "Botafoc Marina · day & multi-day charters · Ibiza, Formentera, Mallorca.",
    canvas: {
      cursorLightStrength: 0.10,    // calmer cursor effect
      shimmerStrength: 0.07,
      brightnessLift: 1.05,         // restrained brightness — let the video breathe
      tint: [0.96, 0.99, 1.06],     // cooler — pushes the evening light
      saturation: 0.92,             // slightly desaturated for cinematic feel
      contrast: 1.10,
      parallaxX: 0.006,             // gentler parallax — minimal aesthetic
      parallaxY: 0.003,
      zoomEnd: 0.80,                // barely zooms — the framing is the framing
      zoomCenter: [0.5, 0.5],
    },
  },
  {
    slug: "open-sea-c",
    video: "open-sea",
    tag: "Open sea · C · mixed weight",
    typography: "mixed-weight",
    headlineParts: {
      lead: "A ",
      accent: "quieter",
      trail: " way to charter.",
    },
    sub: "Curated yachts. A captain who knows the islands. Nothing else to think about.",
    canvas: {
      cursorLightStrength: 0.22,    // more pronounced cursor follow
      shimmerStrength: 0.14,        // brighter shimmer — the sea sparkles more
      brightnessLift: 1.20,
      tint: [1.02, 1.00, 0.96],     // warm — late golden hour push
      saturation: 1.15,
      contrast: 1.05,
      parallaxX: 0.014,             // stronger horizon swing
      parallaxY: 0.007,
      zoomEnd: 0.45,                // deeper zoom — the sea fills the frame
      zoomCenter: [0.45, 0.55],
    },
  },

  // --------------------------------------------------------------------
  // CLIFFS (shorten_hero.mov) — bright lagoon, red cliffs, white yacht.
  // --------------------------------------------------------------------
  {
    slug: "cliffs-a",
    video: "cliffs",
    tag: "Cliffs · A · editorial",
    typography: "editorial-serif",
    headlineParts: {
      lead: "The Mediterranean, ",
      accent: "as you should see it",
      trail: ".",
    },
    sub: "Hidden coves, cliff anchorages and bright Formentera sandbanks — your day at sea, planned around the wind.",
    canvas: {
      cursorLightStrength: 0.16,
      shimmerStrength: 0.12,
      brightnessLift: 1.12,
      tint: [1.00, 1.00, 1.00],     // neutral — the source already pops
      saturation: 1.10,
      contrast: 1.04,
      parallaxX: 0.010,
      parallaxY: 0.005,
      zoomEnd: 0.55,
      zoomCenter: [0.5, 0.55],
    },
  },
  {
    slug: "cliffs-b",
    video: "cliffs",
    tag: "Cliffs · B · classical",
    typography: "classical",
    headlineParts: {
      lead: "Sea Society ",
      accent: "Ibiza",
      trail: "",
    },
    sub: "Private charters · since 2005 · Botafoc Marina",
    canvas: {
      cursorLightStrength: 0.08,    // very restrained — classical look
      shimmerStrength: 0.06,
      brightnessLift: 1.08,
      tint: [1.02, 0.99, 0.97],     // warmer red push on the cliffs
      saturation: 1.04,
      contrast: 1.08,
      parallaxX: 0.005,
      parallaxY: 0.003,
      zoomEnd: 0.85,
      zoomCenter: [0.5, 0.55],
    },
  },
  {
    slug: "cliffs-c",
    video: "cliffs",
    tag: "Cliffs · C · oversized minimal",
    typography: "oversized-minimal",
    headlineParts: {
      lead: "Anchor ",
      accent: "anywhere",
      trail: ".",
    },
    sub: "Es Vedra · Cala d'Hort · Es Caló · Cabrera.",
    canvas: {
      cursorLightStrength: 0.20,
      shimmerStrength: 0.16,        // stronger sun-glint on the bright sea
      brightnessLift: 1.10,
      tint: [0.98, 1.02, 1.05],     // pushes the turquoise
      saturation: 1.18,
      contrast: 1.06,
      parallaxX: 0.012,
      parallaxY: 0.006,
      zoomEnd: 0.50,
      zoomCenter: [0.45, 0.60],
    },
  },
];
