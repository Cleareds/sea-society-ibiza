import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeImmersiveScene } from "@/components/site/HomeImmersiveScene";
import { InstagramFeed } from "@/components/site/InstagramFeed";
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
    <main className="text-white">
      <HomeImmersiveScene
        whatsappNumber={settings.whatsappNumber}
        featured={featuredWithLabels}
        locale={lc}
      />

      {/* Journey block — NO background. The canvas (sea) keeps reading
          through; the footer's own background takes over only when the
          user scrolls into it. Dark tone so the title reads white over
          the sea. */}
      <div id="after-hero" className="relative z-10">
        <div className="pt-16 md:pt-24">
          <InstagramFeed
            handle={settings.instagramHandle}
            href={settings.instagramUrl}
            tone="dark"
          />
        </div>
      </div>
    </main>
  );
}
