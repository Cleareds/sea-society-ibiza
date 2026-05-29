import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "node:path";
import fs from "node:fs";
import { HomeVideoScene } from "@/components/site/HomeVideoScene";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { variants, colorSources, depthVideoForVariant } from "../_variants";

export const metadata: Metadata = {
  title: "Preview — Synthetic Sea",
  description: "POC: synthetic Gerstner-driven sea shader, masked by per-frame depth.",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return variants.flatMap((v) =>
    ["en", "nl", "fr", "es", "de"].map((locale) => ({ locale, slug: v.slug })),
  );
}

export default async function PreviewSeaVariantPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const variant = variants.find((v) => v.slug === slug);
  if (!variant) notFound();

  const t = getMessages(lc);
  const [settings, featured] = await Promise.all([
    getSettings(),
    getFeaturedBoats(3),
  ]);
  const featuredWithLabels = featured.map((b) => ({
    boat: b,
    fromLabel: t("fleet.fromPrice", {
      amount: b.priceFrom.toLocaleString("en-GB"),
    }),
  }));

  const color = colorSources[variant.source];
  const depthRel = depthVideoForVariant(variant);
  const depthExists = fs.existsSync(
    path.join(process.cwd(), "public", depthRel.replace(/^\//, "")),
  );

  const { lead, accent, trail } = variant.headlineParts;
  const headline = (
    <>
      {lead}
      <span className="brand-accent">{accent}</span>
      {trail}
    </>
  );

  return (
    <main className="text-white">
      <HomeVideoScene
        videoSrc={color.full}
        videoSrcMobile={color.mobile}
        maskSrc={color.mask}
        depthVideoSrc={depthExists ? depthRel : undefined}
        depthVideoSrcMobile={depthExists ? depthRel : undefined}
        depthWaterLo={variant.depthRange[0]}
        depthWaterHi={variant.depthRange[1]}
        seaMode="synthetic"
        seaShallowColor={variant.shallow}
        seaDeepColor={variant.deep}
        seaFoamColor={variant.foam}
        seaSunDir={variant.sunDir}
        videoAspect={color.aspect}
        posterSrc={color.poster}
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
        headline={headline}
        sub={variant.sub}
        typography="editorial-serif"
        layout="bottom-left"
        canvas={{
          cursorLightStrength: 0.12,
          shimmerStrength: 0.0,   // shader handles its own sun glint
          brightnessLift: 1.10,
          saturation: 1.06,
          contrast: 1.02,
          parallaxX: 0.008,
          parallaxY: 0.004,
          waterMotion: 0.0,        // synthetic sea has its own motion
        }}
        variantTag={variant.tag}
        scrubViewports={variant.scrubViewports}
        panMode={variant.panMode}
        instagramHandle={settings.instagramHandle}
        instagramHref={settings.instagramUrl}
        instagramSlot={
          <InstagramFeed
            handle={settings.instagramHandle}
            href={settings.instagramUrl}
            tone="dark"
          />
        }
      />
    </main>
  );
}
