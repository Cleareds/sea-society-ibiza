import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getDestinations } from "@/lib/data";
import { MarkdownBody } from "@/components/site/MarkdownBody";
// (photo dummy refs replaced by /sea-society/site/* assets)
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    title: "Destinations — Ibiza, Formentera, Mallorca",
    description:
      "Charter routes from Botafoc Marina to Ibiza's hidden coves, Formentera's shallows and Mallorca's untouched south.",
    path: "/destinations",
    locale: isLocale(locale) ? locale : "en",
  });
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
  const destinations = await getDestinations();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("nav.destinations"), path: lp("/destinations") },
        ])}
      />

      <PageHero
        title={t("nav.destinations")}
        imageSrc="/sea-society/site/destinations-hero.webp"
        imageObjectPosition="center top"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.destinations") },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl pb-12 md:pb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Cruising from Botafoc
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-on-surface)] md:text-xl">
            From Botafoc Marina, Ibiza opens onto three distinct cruising
            worlds. South to <strong>Formentera</strong> — the shallow
            turquoise of Ses Illetes and the protected anchorage at Espalmador,
            roughly 45 minutes by tender. West to <strong>Ibiza&apos;s own coast</strong>
            — Cala Bassa, Cala Comte, Cala Salada and the cliffs of Es Vedrà
            at sunset, all reachable inside a single day charter. North to{" "}
            <strong>Mallorca</strong> — overnight cruising for guests who want
            to swap islands without flying.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-on-surface-variant)]">
            Every itinerary is built around your guests, the weather window and
            the season&apos;s mood. Browse our{" "}
            <Link href={lp("/fleet")} className="underline decoration-[var(--color-primary)] decoration-2 underline-offset-4 hover:text-[var(--color-primary)]">
              fleet of 19 yachts
            </Link>{" "}
            or pick from{" "}
            <Link href={lp("/experiences")} className="underline decoration-[var(--color-primary)] decoration-2 underline-offset-4 hover:text-[var(--color-primary)]">
              curated experiences
            </Link>{" "}
            — day trips, sunset cruises, multi-day Balearic charters,
            celebrations and corporate events.
          </p>
        </div>

        <ul className="space-y-20 md:space-y-32">
          {destinations.map((d, i) => (
            <li
              key={d.id}
              id={d.slug}
              className="scroll-mt-32 grid items-center gap-10 md:grid-cols-12 md:gap-16"
            >
              <div className={i % 2 === 1 ? "md:col-span-6 md:order-2" : "md:col-span-6"}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image
                    src={d.heroImage}
                    alt={`${d.title} — ${d.intro}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    loading={i > 0 ? "lazy" : "eager"}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:col-span-6 md:order-1" : "md:col-span-6"}>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  Destination 0{i + 1}
                </p>
                <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                  {d.title}
                </h2>
                <p className="mt-4 font-serif text-xl italic text-[var(--color-on-surface-variant)]">
                  {d.intro}
                </p>
                <div className="mt-6">
                  <MarkdownBody source={d.body} />
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {d.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full bg-[var(--color-surface-container)] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--color-on-surface)]"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8" size="md">
                  <Link href={lp("/contact")}>{`Charter to ${d.title}`}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
