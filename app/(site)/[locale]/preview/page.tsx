import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeImmersiveScene } from "@/components/site/HomeImmersiveScene";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: "Preview — WebGL Home",
  description: "Internal preview of the WebGL-driven home hero.",
  robots: { index: false, follow: false },
};

/**
 * Internal preview route for the WebGL homepage refactor. Lives at
 * /en/preview so we can review next to the live homepage at /en.
 */
export default async function HomePreviewPage({
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
    getFeaturedBoats(3),
  ]);

  const featuredWithLabels = featured.map((b) => ({
    boat: b,
    fromLabel: t("fleet.fromPrice", {
      amount: b.priceFrom.toLocaleString("en-GB"),
    }),
  }));

  return (
    <main className="bg-[#06141a] text-white">
      <HomeImmersiveScene
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
      />

      {/* Journey block continues on the dark canvas surface. The grid
          tiles themselves are full-bleed photos, so the only place the
          dark background reads through is the title row — which we
          render in the dark-tone variant for contrast. */}
      <div id="after-hero" className="relative z-10 bg-[#06141a]">
        <div className="pt-16 md:pt-24">
          <InstagramGrid
            handle={settings.instagramHandle}
            href={settings.instagramUrl}
            tone="dark"
          />
        </div>
      </div>
    </main>
  );
}
