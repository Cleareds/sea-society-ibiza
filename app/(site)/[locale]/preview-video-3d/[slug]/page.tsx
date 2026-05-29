import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import path from "node:path";
import fs from "node:fs";
import { HomeWater3DScene } from "@/components/site/HomeWater3DScene";
import { InstagramFeed } from "@/components/site/InstagramFeed";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { variants } from "../_variants";

export const metadata: Metadata = {
  title: "Preview — 3D Water",
  description: "POC: 3D water plane with Gerstner vertex displacement.",
  robots: { index: false, follow: false },
};

const COLOR_SRC = {
  full: "/sea-society/video/shorten-scrub.mp4",
  mobile: "/sea-society/video/shorten-scrub-720.mp4",
  poster: "/sea-society/video/shorten-poster.jpg",
  aspect: 16 / 9,
  mask: "/sea-society/video/shorten-mask.png",
};
const DEPTH_REL = "/sea-society/video/shorten-depth-vitl-518.mp4";

export function generateStaticParams() {
  return variants.flatMap((v) =>
    ["en", "nl", "fr", "es", "de"].map((locale) => ({ locale, slug: v.slug })),
  );
}

export default async function PreviewVideo3DPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const variant = variants.find((v) => v.slug === slug);
  if (!variant) notFound();
  const lc = locale as Locale;

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

  const depthAbs = path.join(process.cwd(), "public", DEPTH_REL.replace(/^\//, ""));
  const depthExists = fs.existsSync(depthAbs);

  const accentClass = "brand-accent wave-accent";
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
      <HomeWater3DScene
        videoSrc={COLOR_SRC.full}
        videoSrcMobile={COLOR_SRC.mobile}
        maskSrc={COLOR_SRC.mask}
        depthVideoSrc={depthExists ? DEPTH_REL : undefined}
        depthVideoSrcMobile={depthExists ? DEPTH_REL : undefined}
        yachtDepthThreshold={0.72}
        horizonY={0.58}
        seaShallowColor={variant.shallow}
        seaDeepColor={variant.deep}
        seaFoamColor={variant.foam}
        seaSunDir={variant.sunDir}
        skyColor={variant.skyColor}
        waveScale={variant.waveScale}
        cameraHeight={variant.cameraHeight}
        cameraDolly={variant.cameraDolly}
        videoAspect={COLOR_SRC.aspect}
        posterSrc={COLOR_SRC.poster}
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
        headline={headline}
        accentClassName="wave-accent"
        headlineClassName="md:max-w-[1600px]"
        sub={sub}
        typography="editorial-serif"
        layout="bottom-left"
        canvas={{}}
        variantTag={variant.tag}
        scrubViewports={4.0}
        panMode="none"
        instagramHandle={settings.instagramHandle}
        instagramHref={settings.instagramUrl}
        instagramSlot={
          <InstagramFeed
            handle={settings.instagramHandle}
            href={settings.instagramUrl}
            tone="dark"
            accentClassName="wave-accent"
          />
        }
        brandCloseSlot={
          <Image
            src="/brand/icon-light-512.webp"
            alt="Sea Society Ibiza"
            width={140}
            height={140}
            className="h-28 w-28 object-contain opacity-90 md:h-36 md:w-36"
          />
        }
      />
    </main>
  );
}
