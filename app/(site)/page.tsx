import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { StatsBar } from "@/components/site/StatsBar";
import { BoatCard } from "@/components/site/BoatCard";
import { Testimonials } from "@/components/site/Testimonials";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
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

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Luxury yacht charter in Ibiza & Formentera",
    description:
      "19 luxury yachts from Botafoc Marina, Ibiza. Day trips, sunset cruises and multi-day Balearic charters — handled by Ibimar with 20+ years on the water.",
    path: "/",
  });
}

export default async function HomePage() {
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
        imageSrc={photo.esVedra}
        imageAlt="Es Vedra rock rising from a turquoise sea off the south coast of Ibiza, with yachts at anchor."
      />

      {/* Intro */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              The experience
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[var(--color-on-surface)] md:text-5xl">
              A day on the water. A memory for life.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
              From the moment you step aboard at Botafoc Marina to the moment you watch the sun
              dissolve into the Mediterranean, every detail is handled. The captain knows where the
              other boats aren&apos;t. The chef knows what the sea wants you to eat. You just bring
              the people.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="md">
                <Link href="/fleet">Browse the fleet</Link>
              </Button>
              <WhatsAppCTA
                number={settings.whatsappNumber}
                variant="inline"
                label="Message us on WhatsApp"
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
        </div>
      </Section>

      {/* Stats */}
      <Section spacing="tight">
        <StatsBar stats={settings.stats} />
      </Section>

      {/* Featured fleet */}
      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <div>
          <div className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                Discover your vessel
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                Featured fleet
              </h2>
            </div>
            <Link
              href="/fleet"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              All 19 boats →
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {featured.map((b, i) => (
              <li key={b.id} className="w-[78%] flex-none snap-start md:w-auto">
                <BoatCard boat={b} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Experiences teaser */}
      <Section>
        <div className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              For every kind of day
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Experiences
            </h2>
          </div>
          <Link
            href="/experiences"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            All experiences →
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {experiences.slice(0, 3).map((x) => (
            <li
              key={x.id}
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
            </li>
          ))}
        </ul>
      </Section>

      {/* Destinations teaser */}
      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <div>
          <div className="flex flex-col items-baseline justify-between gap-3 md:flex-row">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                Where you&apos;ll go
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                Destinations
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              All destinations →
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
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <Testimonials items={settings.testimonials} />
      </Section>

      {/* Instagram placeholder grid */}
      <Section spacing="tight">
        <InstagramGrid handle={settings.instagramHandle} href={settings.instagramUrl} />
      </Section>

      {/* Enquiry CTA */}
      <Section bleed className="bg-[var(--color-primary)] text-[var(--color-on-primary)]">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-white/70">
            Your charter starts with a message.
          </p>
          <h2 className="mt-4 text-center font-serif text-4xl leading-tight md:text-5xl">
            Tell us your dates and group — we&apos;ll handle the rest.
          </h2>
          <div className="mt-10 rounded-3xl bg-[var(--color-surface)] p-6 text-[var(--color-on-surface)] md:p-10">
            <EnquiryForm sourcePage="/" />
          </div>
          <p className="mt-6 text-center text-sm text-white/80">
            Or message us directly on{" "}
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
        </div>
      </Section>
    </>
  );
}
