import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { BookHereCTA } from "@/components/site/BookHereCTA";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqPageLd } from "@/lib/seo/jsonld";
import { pageMetadataWithSeo } from "@/lib/seo/metadata";
import { getFaqs, getSettings } from "@/lib/data";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getContactCopy } from "./copy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lc = isLocale(locale) ? locale : "en";
  const c = getContactCopy(lc);
  return pageMetadataWithSeo("contact", {
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/contact",
    locale: lc,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);
  const c = getContactCopy(lc);

  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: t("breadcrumb.home"), path: lp("/") },
            { name: t("nav.contact"), path: lp("/contact") },
          ]),
          faqPageLd(faqs),
        ]}
      />

      <PageHero
        title={
          <>
            {c.heroBefore}<span className="brand-accent">{c.heroAccent}</span>{c.heroAfter}
          </>
        }
        imageSrc="/sea-society/site/contact-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.contact") },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* FAQs (main column) */}
          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              {c.faqEyebrow}
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              {c.faqTitle}
            </h2>
            <p className="mt-4 max-w-xl text-[var(--color-on-surface-variant)]">
              {c.faqIntro}
            </p>

            <Accordion type="single" collapsible className="mt-10 w-full">
              {faqs.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="border-b border-[var(--color-outline-variant)]/40">
                  <AccordionTrigger className="py-5 text-left text-base md:text-lg">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[var(--color-on-surface-variant)]">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact info + WhatsApp CTA (sidebar) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
                {c.sidebarEyebrow}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
                {c.sidebarHeadingBefore}<span className="brand-accent">{c.sidebarHeadingAccent}</span>{c.sidebarHeadingAfter}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                {c.sidebarBody}
              </p>
              <div className="mt-6">
                <BookHereCTA
                  number={settings.whatsappNumber}
                  tone="dark"
                  size="lg"
                  label={t("cta.bookWhatsApp")}
                  placement="contact_sidebar"
                />
              </div>

              <dl className="mt-8 space-y-4 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    {t("contact.marina")}
                  </dt>
                  <dd className="mt-1">{settings.address}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    {t("contact.email")}
                  </dt>
                  <dd className="mt-1">
                    <a className="hover:text-[var(--color-primary)]" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
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
