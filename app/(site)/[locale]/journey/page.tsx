import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParallaxJourney } from "@/components/site/ParallaxJourney";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadataWithSeo } from "@/lib/seo/metadata";

export const revalidate = 3600;

const JOURNEY_LAYERS = {
  /** Stage 1 — looking down at clouds from above (aerial). The opening
   *  shot of the descent into Ibiza. */
  sky: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=2400&q=82&auto=format&fit=crop",
  /** Stage 2 — Botafoc Marina aerial (Ibiza, verified). Replaces the
   *  off-brand Bavarian Alps photo with something on-island. */
  mid: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=2400&q=82&auto=format&fit=crop",
  /** Stage 3 — Es Vedra at golden hour with the fleet (local file). */
  sea: "/images/hero/el-verde.webp",
  /** Drifting cloud overlay — sun rays through clouds, blended via
   *  mix-blend-mode: screen so only the bright pixels show through.
   *  Drifts diagonally (more vertical motion) across the whole journey. */
  cloudsOverlay:
    "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=2400&q=78&auto=format&fit=crop",
} as const;

// Copy lives inline for now — easy to lift into messages/*.json later if the
// page becomes a permanent fixture rather than an experiment.
const COPY = {
  eyebrow: "Sea Society Ibiza · A journey",
  cue: "Scroll",
  stage1: {
    kicker: "Above the clouds",
    title: "Begin in the sky.",
    body:
      "Every Ibiza summer starts the same way — a colour you first see from a window seat, somewhere over the Mediterranean.",
  },
  stage2: {
    kicker: "Down through the landscape",
    title: "Find your way down.",
    body:
      "Mountains soften into cliffs. Cliffs soften into coves. The island arrives slowly, then all at once.",
  },
  stage3: {
    kicker: "And finally — the sea",
    title: "Ibiza, from the water.",
    body:
      "Where every day begins again. Step aboard at Botafoc, and the rest is sunlight, salt, and twenty years of knowing where to go.",
  },
  final: {
    kicker: "Your charter starts here",
    title: "Now choose the boat.",
    primary: "Explore the fleet",
    secondary: "Plan your charter",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadataWithSeo("journey", {
    title: "A journey, from the sky to the sea",
    description:
      "A cinematic descent through clouds, mountains and Mediterranean light — and into Sea Society Ibiza's fleet at Botafoc Marina.",
    path: "/journey",
    locale: isLocale(locale) ? locale : "en",
  });
}

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ParallaxJourney locale={locale as Locale} layers={JOURNEY_LAYERS} texts={COPY} />;
}
