import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "node:path";
import fs from "node:fs";
import { HomeVideoScene } from "@/components/site/HomeVideoScene";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { variants, colorSources, depthVideoSrc } from "../_variants";

export const metadata: Metadata = {
  title: "Preview — Depth Comparison",
  description: "POC: per-frame DA-V2 depth, compared across model + resolution.",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return variants.flatMap((v) =>
    ["en", "nl", "fr", "es", "de"].map((locale) => ({ locale, slug: v.slug })),
  );
}

export default async function PreviewVideoDepthVariantPage({
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
  const depthRel = depthVideoSrc(variant);
  // Only pass the depth video if the file actually exists on disk —
  // otherwise the variant will gracefully fall back to the heuristic
  // mask (still scrub-scrolls, just less precise per frame).
  const depthAbsPath = path.join(process.cwd(), "public", depthRel.replace(/^\//, ""));
  const depthExists = fs.existsSync(depthAbsPath);

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
        yachtDepthThreshold={variant.yachtDepth ?? 0.85}
        horizonY={variant.horizonY ?? 0.65}
        videoAspect={color.aspect}
        posterSrc={color.poster}
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
        headline={headline}
        sub={variant.sub}
        typography={variant.typography}
        layout={variant.layout}
        canvas={variant.canvas}
        variantTag={
          variant.tag + (depthExists ? " · LIVE depth" : " · PENDING depth")
        }
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
