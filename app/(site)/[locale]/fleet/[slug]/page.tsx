import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "@/components/site/Section";
import { BoatCard } from "@/components/site/BoatCard";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { Gallery } from "@/components/site/Gallery";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { boatProductLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getBoatBySlug, getBoats, getSettings } from "@/lib/data";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const boats = await getBoats();
  return locales.flatMap((locale) => boats.map((b) => ({ locale, slug: b.slug })));
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

  const related = all.filter((b) => b.id !== boat.id && b.type === boat.type).slice(0, 3);

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

      <section className="relative isolate min-h-[60vh] w-full overflow-hidden bg-[var(--color-primary)] pt-24 pb-16 md:pt-32 md:pb-24">
        <Image
          src={boat.heroImage}
          alt={`${boat.name} on the water near Ibiza`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55" />
        <div className="relative z-10 mx-auto max-w-(--spacing-container-max) px-5 md:px-10">
          <Breadcrumb
            items={[
              { name: t("breadcrumb.home"), href: lp("/") },
              { name: t("breadcrumb.fleet"), href: lp("/fleet") },
              { name: boat.name },
            ]}
          />
          <h1 className="mt-6 font-serif text-5xl text-white md:text-7xl">{boat.name}</h1>
          <p className="mt-3 max-w-xl font-serif text-xl italic text-white/90 md:text-2xl">
            {boat.tagline}
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Gallery images={boat.gallery} boatName={boat.name} />

            <ul className="mt-8 flex flex-wrap gap-2">
              {[
                `${boat.lengthM} m`,
                `${boat.guests} guests`,
                boat.type.replace("_", " "),
                `${boat.brand} · ${boat.buildYear}`,
                t("fleet.fromPrice", { amount: boat.priceFrom.toLocaleString("en-GB") }),
              ].map((p) => (
                <li
                  key={p}
                  className="rounded-full bg-[var(--color-surface-container)] px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface)]"
                >
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-10 max-w-2xl text-base leading-relaxed text-[var(--color-on-surface)]">
              <p className="font-serif text-2xl text-[var(--color-on-surface)]">
                {boat.description}
              </p>
              <p className="mt-6 text-[var(--color-on-surface-variant)]">{boat.longDescription}</p>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <section aria-labelledby="included-h">
                <h2
                  id="included-h"
                  className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]"
                >
                  {t("boat.whatsIncluded")}
                </h2>
                <ul className="mt-4 grid gap-2">
                  {boat.whatIncluded.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="specs-h">
                <h2
                  id="specs-h"
                  className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]"
                >
                  {t("boat.specifications")}
                </h2>
                <dl className="mt-4 divide-y divide-[var(--color-outline-variant)]">
                  {boat.specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-2 text-sm">
                      <dt className="text-[var(--color-on-surface-variant)]">{s.label}</dt>
                      <dd className="font-medium text-[var(--color-on-surface)]">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl bg-[var(--color-surface-container-low)] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  {t("boat.checkAvailability")}
                </p>
                <p className="mt-3 font-serif text-2xl text-[var(--color-on-surface)]">
                  {t("boat.tellDates")}
                </p>
                <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                  {t("boat.confirmWithin", { name: boat.name })}
                </p>
                <div className="mt-6">
                  <EnquiryForm
                    defaultBoatName={boat.name}
                    defaultBoatId={boat.id}
                    sourcePage={`/fleet/${boat.slug}`}
                    variant="stacked"
                  />
                </div>
                <div className="mt-6 border-t border-[var(--color-outline-variant)]/40 pt-4">
                  <WhatsAppCTA
                    number={settings.whatsappNumber}
                    boatName={boat.name}
                    variant="inline"
                    label={t("boat.orWhatsApp")}
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
