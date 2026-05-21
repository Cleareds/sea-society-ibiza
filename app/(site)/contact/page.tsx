import type { Metadata } from "next";
import Link from "next/link";
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
import { photo } from "@/lib/data/dummy/images";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Contact & FAQ",
    description:
      "Send a charter enquiry — or message us directly on WhatsApp. We respond within a few hours from Botafoc Marina, Ibiza.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          faqPageLd(faqs),
        ]}
      />

      <PageHero
        eyebrow="Get in touch"
        title="Your charter starts with a message."
        sub="Send the dates and group — we will come back within a few hours with availability."
        imageSrc={photo.ibizaSea}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] p-6 md:p-10">
              <EnquiryForm sourcePage="/contact" />
            </div>
          </div>

          <aside className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Or message directly
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--color-on-surface)]">
              Faster on WhatsApp.
            </h2>
            <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
              For dates within seven days, WhatsApp gets the fastest answer.
            </p>
            <WhatsAppCTA
              number={settings.whatsappNumber}
              variant="inline"
              label="Open WhatsApp"
              className="mt-6"
            />

            <dl className="mt-10 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  Email
                </dt>
                <dd className="mt-1">
                  <a className="hover:text-[var(--color-primary)]" href={`mailto:${settings.email}`}>
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a className="hover:text-[var(--color-primary)]" href={`tel:${settings.phone}`}>
                    {settings.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                  Marina
                </dt>
                <dd className="mt-1 not-italic">{settings.address}</dd>
              </div>
            </dl>

            <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-outline-variant)]/40">
              <iframe
                title="Botafoc Marina on the map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=1.4480%2C38.9080%2C1.4640%2C38.9180&amp;layer=mapnik&amp;marker=38.91342%2C1.45526"
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block border-0"
              />
              <p className="border-t border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] px-3 py-2 text-[10px] text-[var(--color-on-surface-variant)]">
                Map ©{" "}
                <a
                  href="https://www.openstreetmap.org/?mlat=38.91342&amp;mlon=1.45526#map=16/38.91342/1.45526"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  OpenStreetMap
                </a>{" "}
                contributors
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="-mx-5 bg-[var(--color-surface-container-low)] px-5 md:-mx-10 md:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Frequently asked
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
            Before you write
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
            More questions? <Link href="/contact" className="underline">Send a message</Link> — we answer each one personally.
          </p>
        </div>
      </Section>
    </>
  );
}
