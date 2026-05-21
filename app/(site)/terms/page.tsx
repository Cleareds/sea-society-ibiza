import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { photo } from "@/lib/data/dummy/images";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Terms & cookie policy",
    description:
      "Terms governing the use of seasocietyibiza.com and our cookie policy. Template — to be reviewed by counsel before launch.",
    path: "/terms",
  });
}

// TODO: lawyer review before launch.
export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ])}
      />

      <PageHero
        eyebrow="Legal"
        title="Terms & cookie policy"
        imageSrc={photo.yachtBow}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Terms" }]}
      />

      <Section>
        <article className="mx-auto max-w-3xl space-y-8 leading-relaxed text-[var(--color-on-surface)]">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
            Last updated: 21 May 2026 · TODO: lawyer review
          </p>

          <section>
            <h2 className="font-serif text-3xl">1. About the site</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              seasocietyibiza.com is operated by Ibimar (Sea Society Ibiza), Botafoc Marina, 07800
              Ibiza, Spain. By using the site you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">2. Enquiries vs. bookings</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              Submitting the enquiry form or messaging us on WhatsApp is a request, not a binding
              booking. A charter is confirmed only when we issue a written quote that you accept and
              the deposit (typically 50%) clears.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">3. Charter terms</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              The full charter contract, security deposit, weather policy and cancellation terms are
              shared in the quote. The captain has final authority on routing and safety.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">4. Intellectual property</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              All content on this site (including photography, copy and design) is owned by Ibimar
              or licensed for use. You may not republish without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">5. Cookies</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              We use three categories of cookies, controlled by the banner on first visit:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-[var(--color-on-surface-variant)]">
              <li>
                <strong>Necessary</strong>: keeps the site working (cookie consent itself, session,
                CSRF). Always on.
              </li>
              <li>
                <strong>Analytics</strong>: Google Analytics 4. Off by default; opt in via the
                banner.
              </li>
              <li>
                <strong>Marketing</strong>: Meta Pixel. Off by default; opt in via the banner.
              </li>
            </ul>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              You can change your preferences at any time by clearing the{" "}
              <code className="rounded bg-[var(--color-surface-container)] px-1 py-0.5 text-xs">
                ssi-consent-v1
              </code>{" "}
              cookie.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">6. Liability</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              The site is provided as-is. We take care that information about boats, pricing and
              availability is accurate, but everything is confirmed in the formal quote.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl">7. Governing law</h2>
            <p className="mt-3 text-[var(--color-on-surface-variant)]">
              These terms are governed by Spanish law. Disputes are subject to the courts of Ibiza.
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
