import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { WhatsAppCTA } from "@/components/site/WhatsAppCTA";
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
import { MarkdownBody } from "@/components/site/MarkdownBody";
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
    title: "Contact & FAQ",
    description:
      "Send a charter enquiry — or message us directly on WhatsApp. We respond within a few hours from Botafoc Marina, Ibiza.",
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
  const contact = mergeI18n(settings.contact, settings.contactI18n, lc);

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
        eyebrow={contact.heroEyebrow || t("contact.orMessageDirect")}
        title={contact.heroTitle || t("home.enquiry.title")}
        sub={contact.heroSub}
        imageSrc={photo.ibizaSea}
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.contact") },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] p-6 md:p-10">
              <EnquiryForm sourcePage="/contact" />
            </div>
          </div>

          <aside className="lg:col-span-5">
            {contact.body ? (
              <MarkdownBody source={contact.body} />
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  {t("contact.orMessageDirect")}
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[var(--color-on-surface)]">
                  {t("contact.fasterWhatsApp")}
                </h2>
                <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
                  {t("contact.whatsAppHint")}
                </p>
              </>
            )}
            <WhatsAppCTA
              number={settings.whatsappNumber}
              variant="inline"
              label={t("cta.openWhatsApp")}
              className="mt-6"
            />

            <dl className="mt-10 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  {t("contact.email")}
                </dt>
                <dd className="mt-1">
                  <a className="hover:text-[var(--color-primary)]" href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  {t("contact.phone")}
                </dt>
                <dd className="mt-1">
                  <a className="hover:text-[var(--color-primary)]" href={`tel:${settings.phone}`}>
                    {settings.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  {t("contact.marina")}
                </dt>
                <dd className="mt-1 not-italic">{settings.address}</dd>
              </div>
            </dl>

            <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-outline-variant)]/40">
              <iframe
                title={t("contact.mapTitle")}
                src="https://www.openstreetmap.org/export/embed.html?bbox=1.4480%2C38.9080%2C1.4640%2C38.9180&amp;layer=mapnik&amp;marker=38.91342%2C1.45526"
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block border-0"
              />
              <p className="border-t border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] px-3 py-2 text-[10px] text-[var(--color-on-surface-variant)]">
                {t("contact.mapAttribution")}
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            {t("contact.faqEyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
            {t("contact.faqTitle")}
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-8 text-sm text-[var(--color-on-surface-variant)]">
            {t("contact.moreQuestions")}{" "}
            <Link href={lp("/contact")} className="underline">
              {t("contact.sendMessage")}
            </Link>
            {t("contact.personally")}
          </p>
        </div>
      </Section>
    </>
  );
}
