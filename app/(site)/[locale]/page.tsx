import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { StatsBar } from "@/components/site/StatsBar";
import { BoatCard } from "@/components/site/BoatCard";
import { Testimonials } from "@/components/site/Testimonials";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteLd, fleetItemListLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  getDestinations,
  getExperiences,
  getFeaturedBoats,
  getSettings,
} from "@/lib/data";
import { photo } from "@/lib/data/dummy/images";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

const HOME_HERO = "/images/hero/el-verde.webp";

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
  const lp = (path: string) => localePath(lc, path);

  const [settings, featured, experiences, destinations] = await Promise.all([
    getSettings(),
    getFeaturedBoats(6),
    getExperiences(),
    getDestinations(),
  ]);

  return (
    <>
      <JsonLd data={[websiteLd(), fleetItemListLd(featured)]} />

      <Hero
        headline={settings.heroHeadline}
        sub={settings.heroSub}
        imageSrc={HOME_HERO}
        imageAlt="Es Vedra rock at golden hour off the south coast of Ibiza, with a fleet of luxury yachts at anchor on the turquoise sea."
        primaryLabel={t("cta.exploreTheFleet")}
        primaryHref={lp("/fleet")}
        secondaryLabel={t("cta.planYourCharter")}
        secondaryHref={lp("/contact")}
        scrollLabel={t("cta.scroll")}
      />

      {/* Everything below the hero scrolls over the sticky hero image. */}
      <div id="after-hero" className="relative z-10 bg-[var(--color-surface)]">
        {/* Intro */}
        <Section>
          <Reveal className="grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                {t("home.intro.eyebrow")}
              </p>
              <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[var(--color-on-surface)] md:text-5xl">
                {t("home.intro.title")}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
                {t("home.intro.body")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary" size="md">
                  <Link href={lp("/fleet")}>{t("cta.browseFleet")}</Link>
                </Button>
                <WhatsAppCTA
                  number={settings.whatsappNumber}
                  variant="inline"
                  label={t("cta.messageWhatsApp")}
                />
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5">
              <Image
                src={photo.yachtAerial}
                alt="Aerial view of a luxury yacht circling in shallow turquoise water near Ibiza."
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Section>

        {/* Stats */}
        <Section spacing="tight">
          <Reveal>
            <StatsBar stats={settings.stats} />
          </Reveal>
        </Section>

        {/* Featured fleet */}
        <Section bleed className="bg-[var(--color-surface-container-low)]">
          <Reveal>
            <div className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  {t("home.featured.eyebrow")}
                </p>
                <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                  {t("home.featured.title")}
                </h2>
              </div>
              <Link
                href={lp("/fleet")}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {t("home.featured.all")}
              </Link>
            </div>

            <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
              {featured.map((b, i) => (
                <li key={b.id} className="w-[78%] flex-none snap-start md:w-auto">
                  <BoatCard boat={b} locale={lc} priority={i < 2} fromLabel={t("fleet.fromPrice", { amount: b.priceFrom.toLocaleString("en-GB") })} />
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>

        {/* Experiences teaser */}
        <Section>
          <Reveal className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                {t("home.experiences.eyebrow")}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                {t("home.experiences.title")}
              </h2>
            </div>
            <Link
              href={lp("/experiences")}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              {t("home.experiences.all")}
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {experiences.slice(0, 3).map((x, i) => (
              <Reveal
                as="li"
                key={x.id}
                delay={i * 120}
                className="overflow-hidden rounded-2xl bg-[var(--color-surface-container-low)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={x.heroImage}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-2xl text-[var(--color-on-surface)]">{x.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{x.intro}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>

        {/* Destinations teaser */}
        <Section bleed className="bg-[var(--color-surface-container-low)]">
          <Reveal>
            <div className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  {t("home.destinations.eyebrow")}
                </p>
                <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                  {t("home.destinations.title")}
                </h2>
              </div>
              <Link
                href={lp("/destinations")}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {t("home.destinations.all")}
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {destinations.map((d) => (
                <li
                  key={d.id}
                  className="group overflow-hidden rounded-2xl bg-[var(--color-surface)]"
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={d.heroImage}
                      alt={`${d.title} — ${d.intro}`}
                      fill
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-[var(--color-on-surface)]">{d.title}</h3>
                    <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">{d.intro}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>

        {/* Testimonials */}
        <Section>
          <Reveal>
            <Testimonials items={settings.testimonials} />
          </Reveal>
        </Section>

        {/* Instagram placeholder grid */}
        <Section spacing="tight">
          <InstagramGrid handle={settings.instagramHandle} href={settings.instagramUrl} />
        </Section>

        {/* Enquiry CTA */}
        <Section bleed className="bg-[var(--color-primary)] text-[var(--color-on-primary)]">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-center text-xs uppercase tracking-[0.25em] text-white/70">
              {t("home.enquiry.eyebrow")}
            </p>
            <h2 className="mt-4 text-center font-serif text-4xl leading-tight md:text-5xl">
              {t("home.enquiry.title")}
            </h2>
            <div className="mt-10 rounded-3xl bg-[var(--color-surface)] p-6 text-[var(--color-on-surface)] md:p-10">
              <EnquiryForm sourcePage="/" />
            </div>
            <p className="mt-6 text-center text-sm text-white/80">
              {t("home.enquiry.orWhatsApp")}{" "}
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline"
              >
                WhatsApp
              </a>
              .
            </p>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
