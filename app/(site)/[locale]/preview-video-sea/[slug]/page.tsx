import type { Metadata } from "next";
import Image from "next/image";
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

  // Open-sea route: the brand-accent focus word gets the wave fill
  // (white text with a light turquoise wave scrolling through it).
  // The h2 'Explore the fleet' inside the scene picks up the same
  // class via accentClassName.
  const useWave = variant.slug === "open-sea";
  const accentClass = useWave ? "brand-accent wave-accent" : "brand-accent";
  const headline = (
    <>
      Ibiza is <span className={accentClass}>different</span>
      <br />
      From the Sea.
    </>
  );
  const sub = (
    <>
      From the moment you step aboard at Botafoc Marina,
      <br className="hidden md:inline" />
      {" "}to the moment you watch the sun dissolve into the
      <br className="hidden md:inline" />
      {" "}Mediterranean, every detail is handled.
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
        seaBlend={0.30}
        videoAspect={color.aspect}
        posterSrc={color.poster}
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
        headline={headline}
        accentClassName={useWave ? "wave-accent" : undefined}
        headlineClassName="md:max-w-[1600px]"
        sub={sub}
        typography="editorial-serif"
        layout="bottom-left"
        canvas={{
          cursorLightStrength: 0.18,
          shimmerStrength: 0.18,   // procedural caustic on top of synth
          brightnessLift: 1.10,
          saturation: 1.06,
          contrast: 1.02,
          parallaxX: 0.010,
          parallaxY: 0.005,
          waterMotion: 0.012,      // sea moves under cursor + paused
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
            accentClassName={useWave ? "wave-accent" : undefined}
          />
        }
        brandCloseSlot={
          variant.slug === "open-sea" ? (
            <Image
              src="/brand/icon-light-512.webp"
              alt="Sea Society Ibiza"
              width={140}
              height={140}
              className="h-28 w-28 object-contain opacity-90 md:h-36 md:w-36"
            />
          ) : undefined
        }
      />
    </main>
  );
}
