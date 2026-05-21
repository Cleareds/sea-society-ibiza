import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { photo } from "@/lib/data/dummy/images";
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
    title: "Privacy policy",
    description:
      "How Sea Society Ibiza by Ibimar collects, uses and protects your data. GDPR-aligned template — to be reviewed by counsel before launch.",
    path: "/privacy",
    locale: isLocale(locale) ? locale : "en",
  });
}

// TODO: lawyer review before launch.
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const t = getMessages(lc);
  const lp = (path: string) => localePath(lc, path);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("footer.privacy"), path: lp("/privacy") },
        ])}
      />

      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        imageSrc={photo.marina}
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("footer.privacy") },
        ]}
      />

      <Section>
        <article className="prose-ssi mx-auto max-w-3xl space-y-8 leading-relaxed text-[var(--color-on-surface)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
            Last updated: 21 May 2026 · TODO: lawyer review
          </p>

          <section>
            <h2 className="font-serif text-3xl">1. Who we are</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              Sea Society Ibiza is a trading name of Ibimar, operating from Botafoc Marina, 07800
              Ibiza, Spain. We are the data controller for personal data processed via
              seasocietyibiza.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">2. What we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-[var(--color-on-surface-variant)]">
              <li>
                <strong>Enquiry form data</strong>: name, email, optional phone, dates, group size,
                boat preference, message.
              </li>
              <li>
                <strong>WhatsApp messages</strong>: the contents of any message you send us via
                WhatsApp Business.
              </li>
              <li>
                <strong>Cookies</strong>: only what you consent to via the cookie banner —
                necessary, analytics (Google Analytics) and/or marketing (Meta Pixel).
              </li>
              <li>
                <strong>Server logs</strong>: IP address and request metadata for security and
                rate-limiting, retained 30 days.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl">3. Why we use it</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              To respond to your charter enquiry, deliver the charter you book, send a confirmation
              email if you opt in, and (with your consent) measure site performance and ad
              effectiveness.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">4. Your rights</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              You have the right to access, rectify or erase your personal data, and to withdraw
              consent at any time. Email{" "}
              <a className="underline" href="mailto:hello@seasocietyibiza.com">
                hello@seasocietyibiza.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">5. Sharing</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              We share enquiry data with the captain assigned to your charter. We do not sell
              personal data. Sub-processors: Supabase (database), Resend (email), Google Analytics,
              Meta Pixel — the last two only if you consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">6. Retention</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              Enquiries: up to 24 months after the season they relate to. Booking records: as
              required by Spanish tax law (typically six years).
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
