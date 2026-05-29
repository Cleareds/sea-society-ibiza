import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeVideoScene } from "@/components/site/HomeVideoScene";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { variants, videoSources } from "../_variants";

export const metadata: Metadata = {
  title: "Preview — Video Hero",
  description: "POC: video-backed homepage hero with depth-aware WebGL effects.",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return variants.flatMap((v) =>
    ["en", "nl", "fr", "es", "de"].map((locale) => ({ locale, slug: v.slug })),
  );
}

export default async function PreviewVideoVariantPage({
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

  const src = videoSources[variant.video];
  const headline = (
    <>
      Ibiza is <span className="brand-accent">different</span>
      <br />
      From the Sea.
    </>
  );
  const sub = (
    <>
      From the moment you step aboard at Botafoc Marina,<br />
      to the moment you watch the sun dissolve into the<br />
      Mediterranean, every detail is handled.
    </>
  );

  return (
    <main className="text-white">
      <HomeVideoScene
        videoSrc={src.full}
        videoSrcMobile={src.mobile}
        maskSrc={src.mask}
        videoAspect={src.aspect}
        posterSrc={src.poster}
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
        headline={headline}
        sub={sub}
        typography={variant.typography}
        layout={variant.layout}
        canvas={variant.canvas}
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
