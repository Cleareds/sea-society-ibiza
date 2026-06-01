import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getTermsCopy } from "./copy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lc = isLocale(locale) ? locale : "en";
  const c = getTermsCopy(lc);
  return pageMetadata({
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/terms",
    locale: lc,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);
  const c = getTermsCopy(lc);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("footer.terms"), path: lp("/terms") },
        ])}
      />

      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        imageSrc="/sea-society/site/about-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("footer.terms") },
        ]}
      />

      <Section>
        <article className="mx-auto max-w-3xl space-y-8 leading-relaxed text-[var(--color-on-surface)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
            {c.effectiveDate}
          </p>

          <div className="space-y-5 text-base text-[var(--color-on-surface-variant)] md:text-lg">
            {c.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {c.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
                {section.heading}
              </h2>
              {section.body.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base"
                >
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="ml-1 space-y-2 text-sm text-[var(--color-on-surface-variant)] md:text-base">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
