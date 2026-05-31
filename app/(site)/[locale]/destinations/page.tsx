import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { BookHereCTA } from "@/components/site/BookHereCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSettings } from "@/lib/data";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getDestinationsCopy } from "./copy";
import { IslandTabs } from "./IslandTabs";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lc = isLocale(locale) ? locale : "en";
  const c = getDestinationsCopy(lc);
  return pageMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/destinations",
    locale: lc,
  });
}

function SpotCard({ name, bullets }: { name: string; bullets: string[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h3 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
        {name}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);
  const settings = await getSettings();
  const c = getDestinationsCopy(lc);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("nav.destinations"), path: lp("/destinations") },
        ])}
      />

      <PageHero
        title={c.heroTitle}
        imageSrc="/sea-society/site/destinations-hero.webp"
        imageObjectPosition="center top"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.destinations") },
        ]}
      />

      {/* 1. Intro */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl italic leading-relaxed text-[var(--color-on-surface)] md:text-3xl">
            {c.introLead}
          </p>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            {c.introBody}
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.22em] text-[var(--color-primary)]">
            {c.introTagline}
          </p>
        </Reveal>
      </Section>

      {/* 2. Ibiza — side-by-side. Portrait image LEFT stretches to
          match the content column's height (items-stretch + h-full +
          fill on the inner Image). Right column holds the title and
          a two-tab strip: "From the sea" (coves grid) or "Beach
          clubs" — only one panel rendered at a time, so the content
          column has a stable shape the image can mirror. */}
      <Section>
        <Reveal className="grid items-stretch gap-12 md:grid-cols-12 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5 md:aspect-auto md:min-h-[600px]">
            <Image
              src="/sea-society/site/dest-ibiza.webp"
              alt="Ibiza coastline from the water"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              {c.ibizaEyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              {c.ibizaTitle}
            </h2>
            <IslandTabs
              id="ibiza"
              labels={{ sea: c.seaTabLabel, clubs: c.clubsTabLabel }}
              sea={
                <>
                  <p className="text-base text-[var(--color-on-surface-variant)] md:text-lg">
                    {c.ibizaSub}
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {c.ibizaCoves.map((cove) => (
                      <SpotCard key={cove.name} {...cove} />
                    ))}
                  </div>
                </>
              }
              clubs={
                <>
                  <p className="text-base text-[var(--color-on-surface-variant)] md:text-lg">
                    {c.ibizaClubsSub}
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {c.ibizaClubs.map((club) => (
                      <SpotCard key={club.name} {...club} />
                    ))}
                  </div>
                </>
              }
            />
          </div>
        </Reveal>
      </Section>

      {/* 3. Formentera — same model, mirrored: text LEFT, image RIGHT.
          Same two-tab structure (sea / clubs). Cala Duo's long-form
          card spans md:col-span-2 inside the clubs tab. */}
      <Section bleed className="bg-[#f4f4f4]">
        <Reveal className="grid items-stretch gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7 md:order-1">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              {c.formenteraEyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              {c.formenteraTitle}
            </h2>
            <IslandTabs
              id="formentera"
              labels={{ sea: c.seaTabLabel, clubs: c.clubsTabLabel }}
              sea={
                <div className="grid gap-4 sm:grid-cols-2">
                  {c.formenteraCoves.map((cove) => (
                    <SpotCard key={cove.name} {...cove} />
                  ))}
                </div>
              }
              clubs={
                <div className="grid gap-6 md:grid-cols-2">
                  {c.formenteraClubs.map((club) => (
                    <SpotCard key={club.name} {...club} />
                  ))}
                  <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2 md:p-8">
                    <h3 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
                      {c.calaDuoTitle}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                      {c.calaDuoLead}
                    </p>
                    <ul className="mt-4 grid gap-2 text-sm text-[var(--color-on-surface-variant)] md:grid-cols-2 md:text-base">
                      {c.calaDuoBullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                      {c.calaDuoOutro}
                    </p>
                  </div>
                </div>
              }
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5 md:order-2 md:aspect-auto md:min-h-[600px]">
            <Image
              src="/sea-society/site/dest-formentera.webp"
              alt="Formentera turquoise water and white sand"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Section>

      {/* 4. Recommended route */}
      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            {c.routeEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            {c.routeTitle}
          </h2>

          <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-on-surface)] md:text-base">
            {c.routeStops.map((stop, i) => (
              <li key={stop} className="flex items-center gap-x-3">
                <span>{stop}</span>
                {i < c.routeStops.length - 1 && (
                  <span aria-hidden className="text-[var(--color-primary)]">→</span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl text-[var(--color-on-surface)] md:text-2xl">
                {c.routeCombinesTitle}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                {c.routeCombines.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[var(--color-on-surface)] md:text-2xl">
                {c.topFiveTitle}
              </h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                {c.topFiveSub}
              </p>
              <ol className="mt-4 space-y-2 text-sm text-[var(--color-on-surface)] md:text-base">
                {c.topFive.map((spot, i) => (
                  <li key={spot} className="flex items-baseline gap-3">
                    <span className="font-serif text-lg text-[var(--color-primary)] md:text-xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{spot}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 5. A MUST experience — Pas des Trucadors */}
      <Section bleed className="bg-[#000000] text-white">
        <Reveal className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5">
            <Image
              src="/sea-society/site/dest-formentera-2.webp"
              alt="Pas des Trucadors sandbar between S'Espalmador and Ses Illetes"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              {c.pasEyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              {c.pasTitle}
            </h2>
            {c.pasBody.map((p, i) => (
              <p key={i} className="mt-6 text-base leading-relaxed text-white/85 md:text-lg">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </Section>


      {/* 8. Sea Society Tip closing */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
            {c.tipEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            {c.tipTitle}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            {c.tipBody}
          </p>
          <p className="mt-4 font-serif text-xl italic leading-relaxed text-[var(--color-on-surface)] md:text-2xl">
            {c.tipItalic}
          </p>
          <div className="mt-10 flex justify-center">
            <BookHereCTA
              number={settings.whatsappNumber}
              tone="dark"
              size="lg"
              label={c.tipCta}
              placement="destinations_tip_cta"
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
