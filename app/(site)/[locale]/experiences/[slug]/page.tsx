import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Anchor } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { BookHereCTA } from "@/components/site/BookHereCTA";
import { MarkdownBody } from "@/components/site/MarkdownBody";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbLd,
  experienceTripLd,
} from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getExperienceBySlug, getExperiences, getSettings } from "@/lib/data";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const items = await getExperiences();
    return locales.flatMap((locale) =>
      items.map((x) => ({ locale, slug: x.slug })),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lcForMeta = isLocale(locale) ? locale : "en";
  const exp = await getExperienceBySlug(slug, lcForMeta);
  if (!exp) return { title: "Experience not found" };
  const meta = pageMetadata({
    title: exp.metaTitle || exp.title,
    description: exp.metaDescription || exp.intro || exp.body.slice(0, 160),
    path: `/experiences/${exp.slug}`,
    image: exp.heroImage,
    locale: isLocale(locale) ? locale : "en",
  });
  // Hidden from search engines while the section is being finalised.
  return { ...meta, robots: { index: false, follow: false } };
}

const eurFmt = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);

  const [exp, all, settings] = await Promise.all([
    getExperienceBySlug(slug, lc),
    getExperiences(lc),
    getSettings(),
  ]);
  if (!exp) notFound();

  const related = all.filter((x) => x.id !== exp.id).slice(0, 3);
  const facts = [
    exp.duration && { icon: Clock, label: "Duration", value: exp.duration },
    exp.groupSize && { icon: Users, label: "Group", value: exp.groupSize },
    exp.priceFrom && {
      icon: Anchor,
      label: "From",
      value: `€${eurFmt.format(exp.priceFrom)}`,
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }>;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: t("breadcrumb.home"), path: lp("/") },
            { name: t("nav.experiences"), path: lp("/experiences") },
            { name: exp.title, path: lp(`/experiences/${exp.slug}`) },
          ]),
          experienceTripLd(exp),
        ]}
      />

      {/* Hero — full-bleed photo + name + Book here CTA (bottom-right on
          desktop, stacked below on mobile). Same layout pattern as
          /fleet/[slug] so the two detail templates feel siblings. */}
      <section className="relative isolate min-h-[80vh] w-full overflow-hidden bg-[#06141a]">
        {exp.heroImage && (
          <Image
            src={exp.heroImage}
            alt={exp.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 brand-image-overlay" />
        <div className="relative z-10 flex min-h-[80vh] flex-col px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-24">
          <div className="mx-auto w-full max-w-(--spacing-container-max) brand-breadcrumb">
            <Breadcrumb
              items={[
                { name: t("breadcrumb.home"), href: lp("/") },
                { name: t("nav.experiences"), href: lp("/experiences") },
                { name: exp.title },
              ]}
              onImage
            />
          </div>
          <div className="mx-auto mt-auto flex w-full max-w-(--spacing-container-max) flex-col gap-8 text-white md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="min-w-0">
              <h1 className="brand-headline mt-4 text-5xl md:text-7xl">{exp.title}</h1>
              <p className="brand-sub mt-4 max-w-2xl font-serif text-xl italic md:text-2xl">
                {exp.intro}
              </p>
            </div>
            <div className="shrink-0 md:pb-2">
              <BookHereCTA
                number={settings.whatsappNumber}
                boatName={exp.title}
                size="lg"
                placement="experience_detail_hero"
                experienceSlug={exp.slug}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facts row — duration, group size, from-price. Mirrors the fleet
          highlights strip. Hidden if no facts populated. */}
      {facts.length > 0 && (
        <section className="border-b border-[var(--color-outline-variant)]/50 bg-[var(--color-surface)]">
          <div
            className={`mx-auto grid w-full max-w-(--spacing-container-max) gap-px bg-[var(--color-outline-variant)]/50 ${
              facts.length === 1
                ? "grid-cols-1"
                : facts.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center justify-center gap-2 bg-[var(--color-surface)] px-4 py-6 text-center md:py-8"
              >
                <f.icon className="h-6 w-6 text-[var(--color-primary)]" aria-hidden />
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  {f.label}
                </p>
                <p className="font-serif text-lg leading-tight text-[var(--color-on-surface)] md:text-xl">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-serif text-2xl leading-relaxed text-[var(--color-on-surface)] md:text-3xl">
              {exp.body}
            </p>
            {exp.longDescription && (
              <div className="mt-8 max-w-2xl">
                <MarkdownBody source={exp.longDescription} />
              </div>
            )}

            {exp.gallery.length > 0 && (
              <section aria-labelledby="gallery-h" className="mt-14">
                <h2
                  id="gallery-h"
                  className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]"
                >
                  Gallery
                </h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {exp.gallery.map((g) => (
                    <li key={g.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src={g.src}
                        alt={g.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl bg-[var(--color-surface-container-low)] p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
                  Book this experience
                </p>
                <p className="mt-3 font-serif text-2xl text-[var(--color-on-surface)]">
                  Tell us your dates.
                </p>
                {exp.priceFrom && (
                  <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                    From €{eurFmt.format(exp.priceFrom)}
                  </p>
                )}
                <p className="mt-6 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  Send us a WhatsApp with your dates and group size — we
                  respond within a few hours from Botafoc Marina.
                </p>
                <div className="mt-6">
                  <BookHereCTA
                    number={settings.whatsappNumber}
                    boatName={exp.title}
                    tone="dark"
                    size="lg"
                    label="Book via WhatsApp"
                    className="w-full"
                    placement="experience_detail_cta"
                    experienceSlug={exp.slug}
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
                Other experiences
              </h2>
              <Link
                href={lp("/experiences")}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                See all
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.id} className="overflow-hidden rounded-2xl bg-[var(--color-surface)]">
                  <Link href={lp(`/experiences/${r.slug}`)} className="group block">
                    <div className="relative aspect-[5/3] overflow-hidden">
                      {r.heroImage && (
                        <Image
                          src={r.heroImage}
                          alt={r.title}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl text-[var(--color-on-surface)] md:text-2xl">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
                        {r.intro}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </>
  );
}
