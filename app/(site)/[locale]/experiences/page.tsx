import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { MarkdownBody } from "@/components/site/MarkdownBody";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, experienceItemListLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getExperiences } from "@/lib/data";
import { addOns } from "@/lib/data/dummy";
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
  const meta = pageMetadata({
    title: "Experiences",
    description:
      "Day trips, sunset cruises, multi-day Balearic charters and special occasions. Plus add-ons: catering, water toys, photographer, florals, champagne.",
    path: "/experiences",
    locale: isLocale(locale) ? locale : "en",
  });
  // Hidden from search engines while the section is being finalised.
  return { ...meta, robots: { index: false, follow: false } };
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);
  const experiences = await getExperiences();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: t("breadcrumb.home"), path: lp("/") },
            { name: t("nav.experiences"), path: lp("/experiences") },
          ]),
          experienceItemListLd(experiences),
        ]}
      />

      <PageHero
        title={t("nav.experiences")}
        imageSrc="/sea-society/site/experiences-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.experiences") },
        ]}
      />

      <Section>
        <ul className="space-y-20 md:space-y-32">
          {experiences.map((x, i) => (
            <li key={x.id} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <Link
                  href={lp(`/experiences/${x.slug}`)}
                  className="group block"
                  aria-label={`Read about ${x.title}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                    <Image
                      src={x.heroImage}
                      alt={`${x.title} — ${x.intro}`}
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      loading={i > 0 ? "lazy" : "eager"}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  0{i + 1}
                </p>
                <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                  <Link
                    href={lp(`/experiences/${x.slug}`)}
                    className="transition-colors hover:text-[var(--color-primary)]"
                  >
                    {x.title}
                  </Link>
                </h2>
                <p className="mt-4 font-serif text-xl italic text-[var(--color-on-surface-variant)]">
                  {x.intro}
                </p>
                <div className="mt-6">
                  <MarkdownBody source={x.body} />
                </div>
                <Button asChild className="mt-8" size="md">
                  <Link href={lp(`/experiences/${x.slug}`)}>Read more</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Make it yours
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
            Add-ons
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-on-surface-variant)]">
            Tell us what the day needs to be and we will arrange it. A few of the most-asked-for.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {addOns.map((a) => (
              <li
                key={a.title}
                className="rounded-2xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-6"
              >
                <h3 className="font-serif text-2xl text-[var(--color-on-surface)]">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  {a.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
