import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import path from "node:path";
import fs from "node:fs";
import { HomeWater3DScene } from "@/components/site/HomeWater3DScene";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteLd, fleetItemListLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const COLOR_SRC = {
  full: "/sea-society/video/shorten-scrub.mp4",
  mobile: "/sea-society/video/shorten-scrub-720.mp4",
  poster: "/sea-society/video/shorten-poster.jpg",
  aspect: 16 / 9,
  mask: "/sea-society/video/shorten-mask.png",
};
const DEPTH_REL = "/sea-society/video/shorten-depth-vitl-518.mp4";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    title: "Luxury yacht charter in Ibiza & Formentera",
    description:
      "19 luxury yachts from Botafoc Marina, Ibiza. Day trips, sunset cruises and multi-day Balearic charters — handled by Ibimar with 20+ years on the water.",
    path: "/",
    image: "/sea-society/site/home-hero.webp",
    locale: isLocale(locale) ? locale : "en",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;

  const t = getMessages(lc);
  const [settings, featured] = await Promise.all([
    getSettings(),
    getFeaturedBoats(3, lc),
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
  const headlineMap = {
    en: (
      <>
        Ibiza is <span className={accentClass}>different</span>
        <br />
        From the Sea.
      </>
    ),
    es: (
      <>
        Ibiza es <span className={accentClass}>diferente</span>
        <br />
        desde el mar.
      </>
    ),
    fr: (
      <>
        Ibiza est <span className={accentClass}>différente</span>
        <br />
        vue de la mer.
      </>
    ),
    nl: (
      <>
        Ibiza is <span className={accentClass}>anders</span>
        <br />
        vanaf de zee.
      </>
    ),
  } as const;
  const headline = headlineMap[lc];
  const subMap = {
    en: (
      <>
        From the moment you step aboard at Botafoc Marina,
        <br className="hidden md:inline" />
        {" "}to the moment you watch the sun dissolve into the
        <br className="hidden md:inline" />
        {" "}Mediterranean, every detail is handled.
      </>
    ),
    es: (
      <>
        Desde el momento en que subes a bordo en Marina Botafoc,
        <br className="hidden md:inline" />
        {" "}hasta el momento en que ves el sol disolverse en
        <br className="hidden md:inline" />
        {" "}el Mediterráneo, cada detalle está cuidado.
      </>
    ),
    fr: (
      <>
        Du moment où vous montez à bord à Marina Botafoc,
        <br className="hidden md:inline" />
        {" "}jusqu'à celui où vous regardez le soleil se fondre
        <br className="hidden md:inline" />
        {" "}dans la Méditerranée, chaque détail est pris en charge.
      </>
    ),
    nl: (
      <>
        Vanaf het moment dat u aan boord stapt in Marina Botafoc,
        <br className="hidden md:inline" />
        {" "}tot het moment waarop u de zon ziet oplossen in
        <br className="hidden md:inline" />
        {" "}de Middellandse Zee, wordt elk detail verzorgd.
      </>
    ),
  } as const;
  const sub = subMap[lc];
  // Localised in-scene featured-cards heading. The accent word lives
  // inside the span so its colour treatment matches the brand system.
  const featuredMap = {
    en: (<><span className={accentClass}>Explore</span> the fleet</>),
    es: (<><span className={accentClass}>Descubre</span> la flota</>),
    fr: (<><span className={accentClass}>Découvrez</span> la flotte</>),
    nl: (<><span className={accentClass}>Ontdek</span> de vloot</>),
  } as const;
  const featuredTitle = featuredMap[lc];
  const seeAllMap: Record<typeof lc, string> = {
    en: "See all",
    es: "Ver todo",
    fr: "Tout voir",
    nl: "Alles bekijken",
  };
  const seeAllLabel = seeAllMap[lc];

  return (
    <main className="text-white">
      <JsonLd data={[websiteLd(), fleetItemListLd(featured)]} />
      <HomeWater3DScene
        videoSrc={COLOR_SRC.full}
        videoSrcMobile={COLOR_SRC.mobile}
        maskSrc={COLOR_SRC.mask}
        depthVideoSrc={depthExists ? DEPTH_REL : undefined}
        depthVideoSrcMobile={depthExists ? DEPTH_REL : undefined}
        yachtDepthThreshold={0.72}
        horizonY={0.58}
        videoAspect={COLOR_SRC.aspect}
        posterSrc={COLOR_SRC.poster}
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
        headline={headline}
        accentClassName="wave-accent"
        headlineClassName="md:max-w-[1600px]"
        sub={sub}
        bookHereLabel={t("cta.bookHere")}
        scrollLabel={t("cta.scroll")}
        featuredTitle={featuredTitle}
        seeAllLabel={seeAllLabel}
        typography="editorial-serif"
        layout="bottom-left"
        canvas={{}}
        scrubViewports={4.0}
        panMode="none"
        instagramHandle={settings.instagramHandle}
        instagramHref={settings.instagramUrl}
        instagramSlot={
          <InstagramGrid
            locale={lc}
            handle={settings.instagramHandle}
            href={settings.instagramUrl}
            tiles={settings.journeyImages}
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
