import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { MarkdownBody } from "@/components/site/MarkdownBody";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSettings } from "@/lib/data";
import { photo } from "@/lib/data/dummy/images";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { mergeI18n } from "@/lib/i18n/merge";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    title: "About — Sea Society Ibiza by Ibimar",
    description:
      "Sea Society Ibiza is a luxury charter platform built on Ibimar's 20-year operation at Botafoc Marina. One number, nineteen boats.",
    path: "/about",
    locale: isLocale(locale) ? locale : "en",
  });
}

export default async function AboutPage({
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
  const about = mergeI18n(settings.about, settings.aboutI18n, lc);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("nav.about"), path: lp("/about") },
        ])}
      />

      <PageHero
        eyebrow={about.heroEyebrow || "The story"}
        title={about.heroTitle || "A platform built on twenty years at the dock."}
        sub={about.heroSub}
        imageSrc={photo.marina}
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.about") },
        ]}
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <article className="md:col-span-8">
            <MarkdownBody source={about.body} />
            <div className="mt-10">
              <Button asChild>
                <Link href={lp("/fleet")}>{t("cta.browseFleet")}</Link>
              </Button>
            </div>
          </article>
          <aside className="md:col-span-4">
            <div className="rounded-3xl bg-[var(--color-surface-container-low)] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                {t("contact.orMessageDirect")}
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                    {t("contact.marina")}
                  </dt>
                  <dd className="mt-1">{settings.address}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                    {t("contact.email")}
                  </dt>
                  <dd className="mt-1">
                    <a className="hover:text-[var(--color-primary)]" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                    {t("contact.phone")}
                  </dt>
                  <dd className="mt-1">
                    <a className="hover:text-[var(--color-primary)]" href={`tel:${settings.phone}`}>
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
