import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqPageLd } from "@/lib/seo/jsonld";
import { pageMetadataWithSeo } from "@/lib/seo/metadata";
import { getFaqs } from "@/lib/data";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { Faq } from "@/lib/data/types";
import { getFaqCopy } from "./copy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lc = isLocale(locale) ? locale : "en";
  const c = getFaqCopy(lc);
  return pageMetadataWithSeo("faq", {
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/faq",
    locale: lc,
  });
}

/** Group FAQs by category, preserving the order categories first appear. */
function groupByCategory(faqs: Faq[]): Array<{ category: string; items: Faq[] }> {
  const groups: Array<{ category: string; items: Faq[] }> = [];
  for (const f of faqs) {
    const key = f.category || "";
    let g = groups.find((x) => x.category === key);
    if (!g) {
      g = { category: key, items: [] };
      groups.push(g);
    }
    g.items.push(f);
  }
  return groups;
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const c = getFaqCopy(lc);
  const lp = (path: string) => localePath(lc, path);

  const faqs = await getFaqs();
  const groups = groupByCategory(faqs);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: t("breadcrumb.home"), path: lp("/") },
            { name: t("nav.faq"), path: lp("/faq") },
          ]),
          ...(faqs.length > 0 ? [faqPageLd(faqs)] : []),
        ]}
      />

      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        sub={c.heroSub}
        imageSrc="/images/boats/inspiration-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.faq") },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {groups.length === 0 ? (
            <p className="text-base text-[var(--color-on-surface-variant)]">{c.empty}</p>
          ) : (
            <div className="space-y-14">
              {groups.map((group) => (
                <section key={group.category || "general"} aria-label={group.category}>
                  {group.category && (
                    <h2 className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                      {c.categoryLabels[group.category] ?? group.category}
                    </h2>
                  )}
                  <div className="mt-4 divide-y divide-[var(--color-outline-variant)]/50 border-y border-[var(--color-outline-variant)]/50">
                    {group.items.map((f) => (
                      <details key={f.id} className="group py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-[var(--color-on-surface)] md:text-xl [&::-webkit-details-marker]:hidden">
                          {f.question}
                          <span
                            aria-hidden
                            className="shrink-0 text-[var(--color-primary)] transition-transform duration-200 group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <div className="mt-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                          {f.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <div className="mt-16 rounded-3xl bg-[var(--color-surface-container-low)] p-8 text-center md:p-10">
            <p className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
              {c.contactPrompt}
            </p>
            <Link
              href={lp("/contact")}
              className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black focus-visible:outline-none"
            >
              {c.contactCta}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
