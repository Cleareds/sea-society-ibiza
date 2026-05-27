import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Ruler, Users, BedDouble, Gauge, Calendar, Cog, Bath, Anchor } from "lucide-react";
import { Section } from "@/components/site/Section";
import { BoatCard } from "@/components/site/BoatCard";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { BookHereCTA } from "@/components/site/BookHereCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { boatProductLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getBoatBySlug, getBoats, getSettings } from "@/lib/data";
import type { HighlightIcon } from "@/lib/data/types";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

// ISR — rebuild each boat page hourly; allow ANY slug to render dynamically
// on first hit (then cache it). With dynamicParams=false we 404'd new boats
// in production any time the build was older than the Supabase dataset.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const boats = await getBoats();
    return locales.flatMap((locale) => boats.map((b) => ({ locale, slug: b.slug })));
  } catch {
    // If the build can't reach Supabase, return [] — every slug will be
    // rendered dynamically on first request instead of failing the build.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const boat = await getBoatBySlug(slug);
  if (!boat) return { title: "Boat not found" };
  return pageMetadata({
    title: boat.metaTitle || boat.name,
    description: boat.metaDescription || boat.description,
    path: `/fleet/${boat.slug}`,
    image: boat.heroImage,
    locale: isLocale(locale) ? locale : "en",
  });
}

const HIGHLIGHT_ICONS: Record<HighlightIcon, React.ComponentType<{ className?: string }>> = {
  length: Ruler,
  guests: Users,
  cabins: BedDouble,
  speed: Gauge,
  year: Calendar,
  engine: Cog,
  bathrooms: Bath,
  anchor: Anchor,
};

const eurFmt = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export default async function BoatDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);

  const [boat, all, settings] = await Promise.all([
    getBoatBySlug(slug),
    getBoats(),
    getSettings(),
  ]);
  if (!boat) notFound();

  const related = all.filter((b) => b.id !== boat.id).slice(0, 3);
  const highlights = boat.highlights ?? [];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: t("breadcrumb.home"), path: lp("/") },
            { name: t("breadcrumb.fleet"), path: lp("/fleet") },
            { name: boat.name, path: lp(`/fleet/${boat.slug}`) },
          ]),
          boatProductLd(boat),
        ]}
      />

      {/* Hero — full-bleed boat photo + name + model + tagline */}
      <section className="relative isolate min-h-[80vh] w-full overflow-hidden bg-[#06141a]">
        <Image
          src={boat.heroImage}
          alt={`${boat.name} — ${boat.modelName ?? boat.brand}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 brand-image-overlay" />
        <div className="relative z-10 flex min-h-[80vh] flex-col px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24">
          <div className="mx-auto w-full max-w-(--spacing-container-max) brand-breadcrumb">
            <Breadcrumb
              items={[
                { name: t("breadcrumb.home"), href: lp("/") },
                { name: t("breadcrumb.fleet"), href: lp("/fleet") },
                { name: boat.name },
              ]}
              onImage
            />
          </div>
          <div className="mx-auto mt-auto w-full max-w-(--spacing-container-max) text-white">
            {boat.modelName && (
              <p className="brand-eyebrow md:text-sm">M/Y · {boat.modelName}</p>
            )}
            <h1 className="brand-headline mt-4 text-5xl md:text-7xl">{boat.name}</h1>
            <p className="brand-sub mt-4 max-w-2xl font-serif text-xl italic md:text-2xl">
              {boat.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights — top 5 stats, prominent right under the hero */}
      {highlights.length > 0 && (
        <section className="border-b border-[var(--color-outline-variant)]/50 bg-[var(--color-surface)]">
          <div className="mx-auto grid w-full max-w-(--spacing-container-max) grid-cols-2 gap-px bg-[var(--color-outline-variant)]/50 md:grid-cols-5">
            {highlights.slice(0, 5).map((h) => {
              const Icon = HIGHLIGHT_ICONS[h.icon] ?? Ruler;
              return (
                <div
                  key={h.label + h.value}
                  className="flex flex-col items-center justify-center gap-2 bg-[var(--color-surface)] px-4 py-6 text-center md:py-8"
                >
                  <Icon className="h-6 w-6 text-[var(--color-primary)]" aria-hidden />
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    {h.label}
                  </p>
                  <p className="font-serif text-lg leading-tight text-[var(--color-on-surface)] md:text-xl">
                    {h.value}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-serif text-2xl leading-relaxed text-[var(--color-on-surface)] md:text-3xl">
              {boat.description}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
              {boat.longDescription}
            </p>

            {/* Full specifications — icon grid styled like the PDF brochure */}
            <section aria-labelledby="specs-h" className="mt-14">
              <h2
                id="specs-h"
                className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]"
              >
                {t("boat.specifications")}
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {boat.specs.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-[var(--color-surface-container-low)] p-5"
                  >
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                      {s.label}
                    </p>
                    <p className="mt-2 text-base font-medium text-[var(--color-on-surface)]">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing — low / high season, mirroring the brochure */}
            {boat.priceHigh && (
              <section aria-labelledby="price-h" className="mt-14">
                <h2
                  id="price-h"
                  className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]"
                >
                  Day charter
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--color-outline-variant)] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                      Low season
                    </p>
                    <p className="mt-3 font-serif text-3xl text-[var(--color-on-surface)]">
                      €{eurFmt.format(boat.priceFrom)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">Day + VAT</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                      High season
                    </p>
                    <p className="mt-3 font-serif text-3xl text-[var(--color-on-surface)]">
                      €{eurFmt.format(boat.priceHigh)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">Day + VAT</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[var(--color-on-surface-variant)]">
                  Overnight stays&rsquo; prices on demand. Fuel, tips and extras not included.
                </p>
              </section>
            )}

            <section aria-labelledby="included-h" className="mt-14">
              <h2
                id="included-h"
                className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]"
              >
                {t("boat.whatsIncluded")}
              </h2>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {boat.whatIncluded.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl bg-[var(--color-surface-container-low)] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
                  Book this yacht
                </p>
                <p className="mt-3 font-serif text-2xl text-[var(--color-on-surface)]">
                  Tell us your dates.
                </p>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                  From €{eurFmt.format(boat.priceFrom)} / day + VAT
                  {boat.baseHarbour ? ` · ${boat.baseHarbour}` : ""}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  Send us a WhatsApp with your dates and group size — we
                  respond within a few hours from Botafoc Marina.
                </p>
                <div className="mt-6">
                  <BookHereCTA
                    number={settings.whatsappNumber}
                    boatName={boat.name}
                    tone="dark"
                    size="lg"
                    label="Book via WhatsApp"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section bleed className="bg-[var(--color-surface-container-low)]">
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
                {t("boat.similar")}
              </h2>
              <Link
                href={lp("/fleet")}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                {t("boat.allBoats")}
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <li key={b.id}>
                  <BoatCard
                    boat={b}
                    locale={lc}
                    fromLabel={t("fleet.fromPrice", {
                      amount: b.priceFrom.toLocaleString("en-GB"),
                    })}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </>
  );
}
