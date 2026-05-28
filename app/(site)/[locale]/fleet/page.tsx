import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/site/Section";
import { BoatCard } from "@/components/site/BoatCard";
import { FilterBar } from "@/components/site/FilterBar";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, fleetItemListLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getBoats } from "@/lib/data";
// (photo dummy refs replaced by /sea-society/site/* assets)
import type { Boat, BoatType } from "@/lib/data/types";
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
    title: "The Fleet",
    description:
      "Explore 19 luxury yachts available for charter from Botafoc Marina, Ibiza. Filter by type, capacity, brand and budget.",
    path: "/fleet",
    locale: isLocale(locale) ? locale : "en",
  });
}

interface SearchParams {
  type?: string;
  minGuests?: string;
  minLength?: string;
  maxLength?: string;
  maxPrice?: string;
  brand?: string;
}

function applyFilters(boats: Boat[], sp: SearchParams): Boat[] {
  return boats.filter((b) => {
    if (sp.type && b.type !== (sp.type as BoatType)) return false;
    if (sp.minGuests && b.guests < Number(sp.minGuests)) return false;
    if (sp.minLength && b.lengthM < Number(sp.minLength)) return false;
    if (sp.maxLength && b.lengthM > Number(sp.maxLength)) return false;
    if (sp.maxPrice && b.priceFrom > Number(sp.maxPrice)) return false;
    if (sp.brand && b.brand.toLowerCase() !== sp.brand.toLowerCase()) return false;
    return true;
  });
}

export default async function FleetPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);
  const sp = await searchParams;
  const allBoats = await getBoats();
  const boats = applyFilters(allBoats, sp);
  const brands = Array.from(new Set(allBoats.map((b) => b.brand))).sort();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: t("breadcrumb.home"), path: lp("/") },
            { name: t("breadcrumb.fleet"), path: lp("/fleet") },
          ]),
          fleetItemListLd(boats),
        ]}
      />

      <section className="relative isolate h-[52vh] min-h-[400px] w-full overflow-hidden bg-[#06141a]">
        <Image
          src="/sea-society/site/fleet-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 brand-image-overlay" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 text-white md:px-10 md:pb-20">
          <div className="mx-auto w-full max-w-(--spacing-container-max)">
            <div className="brand-breadcrumb">
              <Breadcrumb
                items={[
                  { name: t("breadcrumb.home"), href: lp("/") },
                  { name: t("breadcrumb.fleet") },
                ]}
                onImage
              />
            </div>
            <h1 className="brand-headline mt-5 max-w-3xl text-[clamp(2.25rem,7vw,4.5rem)] md:text-6xl">
              {t("fleet.title")}
            </h1>
            <p className="brand-sub mt-4 max-w-xl text-base md:text-lg">{t("fleet.subtitle")}</p>
          </div>
        </div>
      </section>

      <Section>
        <FilterBar brands={brands} locale={lc} />

        <p className="mt-6 text-sm text-[var(--color-on-surface-variant)]">
          {boats.length} {boats.length === 1 ? t("fleet.boatSingular") : t("fleet.boatPlural")}{" "}
          {t("fleet.matching", { count: boats.length })}
        </p>

        {boats.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[var(--color-outline)] p-10 text-center">
            <p className="font-serif text-2xl text-[var(--color-on-surface)]">
              {t("fleet.noResults")}
            </p>
            <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
              {t("fleet.noResultsHint")}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link href={lp("/fleet")}>{t("fleet.reset")}</Link>
              </Button>
              <Button asChild>
                <Link href={lp("/contact")}>{t("nav.contact")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boats.map((b, i) => (
              <li key={b.id}>
                <BoatCard
                  boat={b}
                  locale={lc}
                  priority={i < 3}
                  fromLabel={t("fleet.fromPrice", { amount: b.priceFrom.toLocaleString("en-GB") })}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
