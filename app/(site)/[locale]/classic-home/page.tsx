import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { BoatCard } from "@/components/site/BoatCard";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { Reveal } from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteLd, fleetItemListLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getFeaturedBoats, getSettings } from "@/lib/data";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const HOME_HERO = "/sea-society/site/home-hero.webp";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const md = pageMetadata({
    title: "Classic home — Luxury yacht charter in Ibiza",
    description: "The static-photo home layout, kept for reference.",
    path: "/classic-home",
    locale: isLocale(locale) ? locale : "en",
  });
  return { ...md, robots: { index: false, follow: false } };
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
  const lp = (path: string) => localePath(lc, path);

  const [settings, featured] = await Promise.all([
    getSettings(),
    getFeaturedBoats(3),
  ]);

  return (
    <>
      <JsonLd data={[websiteLd(), fleetItemListLd(featured)]} />

      <Hero
        eyebrow=""
        headline={
          <>
            Ibiza is <span className="brand-accent">different</span>
            <br /> From the Sea.
          </>
        }
        sub={
          <>
            From the moment you step aboard at Botafoc Marina,<br />
            to the moment you watch the sun dissolve into the<br />
            Mediterranean, every detail is handled.
          </>
        }
        imageSrc={HOME_HERO}
        imageAlt="Looking out at Es Vedra rock at golden hour from a quiet anchorage off Ibiza's south coast."
        whatsappNumber={settings.whatsappNumber}
        ctaLabel="Book here"
        scrollLabel={t("cta.scroll")}
      />

      {/* Everything below scrolls over the sticky hero image. */}
      <div id="after-hero" className="relative z-10 bg-[var(--color-surface)]">
        {/* The fleet — 3 yachts + link to /fleet. Left-aligned to keep
            the editorial reading rhythm. */}
        <Section className="bg-[var(--color-surface-container-low)]" bleed>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-baseline">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
                  {t("home.featured.eyebrow")}
                </p>
                <h2 className="mt-3 max-w-3xl font-serif text-4xl text-[var(--color-on-surface)] md:text-6xl">
                  Explore the <span className="brand-accent">fleet</span>
                </h2>
              </div>
            </div>

            <ul className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
              {featured.slice(0, 3).map((b, i) => (
                <li key={b.id}>
                  <BoatCard
                    boat={b}
                    locale={lc}
                    priority={i < 2}
                    fromLabel={t("fleet.fromPrice", {
                      amount: b.priceFrom.toLocaleString("en-GB"),
                    })}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                href={lp("/fleet")}
                className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.3em] text-[var(--color-primary)] transition-colors hover:text-[var(--color-on-surface)]"
              >
                See the full fleet
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </Section>

        {/* Follow the journey — full-bleed photo wall. No bottom padding
            so the next section (footer) sits flush. */}
        <div className="pt-12 md:pt-20">
          <InstagramGrid handle={settings.instagramHandle} href={settings.instagramUrl} />
        </div>
      </div>
    </>
  );
}
