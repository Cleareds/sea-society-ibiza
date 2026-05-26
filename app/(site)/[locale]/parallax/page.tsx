import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ParallaxHero } from "@/components/site/ParallaxHero";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Sea Society — preview",
  description: "Parallax home preview",
  robots: { index: false, follow: false },
};

export default async function ParallaxPreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const lp = (path: string) => localePath(lc, path);

  return (
    <main className="bg-[#0b1e22] text-white">
      <ParallaxHero>
        {/* All four screens share the sticky stage; copy fades per phase via the
            same --p variable using inline classes that pull from it. */}
        <div className="relative h-full w-full">
          {/* Screen 1 — initial reveal */}
          <div
            className="absolute inset-0 mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
            style={{
              opacity: "calc(1 - clamp(0, (var(--p) - 0.05) / 0.18, 1))",
            }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              Sea Society · Ibiza
            </p>
            <h1 className="mt-6 parallax-headline font-serif text-5xl leading-[1.05] md:text-7xl">
              Above the line where land meets sea.
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/75 md:text-lg">
              A boutique fleet, a coastline you only see from the water.
            </p>
            <p className="mt-12 text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
              Scroll
            </p>
          </div>

          {/* Screen 2 — middle of the bg-above slide */}
          <div
            className="absolute inset-0 mx-auto flex max-w-3xl flex-col items-center justify-center text-center"
            style={{
              opacity:
                "calc(clamp(0, (var(--p) - 0.22) / 0.12, 1) * (1 - clamp(0, (var(--p) - 0.45) / 0.12, 1)))",
            }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              Posidonia · Formentera
            </p>
            <h2 className="mt-6 parallax-headline font-serif text-4xl leading-tight md:text-6xl">
              Turquoise turns to deep blue.
            </h2>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
              We know every cove between Es Vedrà and S&rsquo;Espalmador — the shallow
              meadows, the hidden reefs, the right anchor at the right hour.
            </p>
          </div>

          {/* Screen 4 — boat reveal + CTA */}
          <div
            className="absolute inset-0 mx-auto flex max-w-3xl flex-col items-center justify-end pb-[18vh] text-center"
            style={{
              opacity: "clamp(0, (var(--p) - 0.82) / 0.1, 1)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              The fleet · 21 yachts
            </p>
            <h2 className="mt-6 parallax-headline font-serif text-5xl leading-[1.05] md:text-7xl">
              Step on board.
            </h2>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
              Day charters, sunset cruises and multi-day Balearic crossings — all
              from Marina Botafoc.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href={lp("/fleet")}>Explore the fleet</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/10">
                <Link href={lp("/contact")}>Plan your charter</Link>
              </Button>
            </div>
          </div>
        </div>
      </ParallaxHero>

      {/* After the parallax: a plain handover section so the page doesn't end
          abruptly. Real home sections (fleet teaser, etc) can slot in here. */}
      <section className="bg-[var(--color-surface)] px-5 py-24 text-[var(--color-on-surface)] md:px-10 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Continue
          </p>
          <h3 className="mt-4 font-serif text-3xl md:text-5xl">
            The rest of the story lives in the fleet.
          </h3>
          <p className="mt-6 text-base text-[var(--color-on-surface-variant)]">
            Each yacht has its own page — hero photo, top-five stats from the
            owner&rsquo;s brochure, day and high-season pricing, direct enquiry.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href={lp("/fleet")}>See all 21 yachts</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
