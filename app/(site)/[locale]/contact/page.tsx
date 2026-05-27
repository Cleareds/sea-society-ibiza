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
import { pageMetadata } from "@/lib/seo/metadata";
import { getFaqs, getSettings } from "@/lib/data";
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
    title: "Contact & FAQ",
    description:
      "Frequently asked questions about Sea Society Ibiza charters — pricing, what's included, departure, weather policy. Send us a WhatsApp to book.",
    path: "/contact",
    locale: isLocale(locale) ? locale : "en",
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
        eyebrow="Talk to us"
        title={
          <>
            Have a <span className="brand-accent">question</span>?
          </>
        }
        sub="Pricing, routes, group sizes, special-occasion requests — read the most-asked questions below, or send us a WhatsApp directly."
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
              FAQ
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Frequently asked.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--color-on-surface-variant)]">
              Most enquiries cover the same handful of things — pricing,
              what is included, where we depart from, what happens if the
              weather turns. Everything is below.
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
                Contact
              </p>
              <h3 className="mt-3 font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
                Ready to <span className="brand-accent">book</span>?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                Send us a WhatsApp with your dates and group size. We
                respond within a few hours from Botafoc Marina.
              </p>
              <div className="mt-6">
                <BookHereCTA
                  number={settings.whatsappNumber}
                  tone="dark"
                  size="lg"
                  label="Book via WhatsApp"
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
