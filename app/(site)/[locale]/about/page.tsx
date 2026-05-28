import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { BookHereCTA } from "@/components/site/BookHereCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSettings } from "@/lib/data";
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
    title: "About — Sea Society Ibiza by Ibimar",
    description:
      "Sea Society Ibiza is a luxury charter platform built on Ibimar's 20-year operation at Botafoc Marina. Meet the crew, the partnership, and the marina at the heart of every charter.",
    path: "/about",
    locale: isLocale(locale) ? locale : "en",
  });
}

const crew = [
  {
    name: "Capt. Marc Vidal",
    role: "Fleet Captain · 18 years",
    bio: "Born in Sant Antoni. Holds a 200-ton master licence. Knows every cove on the west coast by feel — and which ones to skip when the meltemi turns.",
  },
  {
    name: "Sofia Reyes",
    role: "Charter Director",
    bio: "Runs the day-of operation: catering, water toys, dock timings, special requests. Came from a Mallorca-side superyacht background.",
  },
  {
    name: "Tomeu Riera",
    role: "Workshop & Maintenance Lead",
    bio: "Twenty years at the dock with Ibimar. Every engine, prop and trim system in the fleet passes through his hands twice a year.",
  },
];

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

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("nav.about"), path: lp("/about") },
        ])}
      />

      <PageHero
        title="Built on twenty years at the dock."
        imageSrc="/sea-society/site/about-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.about") },
        ]}
      />

      {/* Brand story */}
      <Section>
        <Reveal className="grid items-start gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              The brand
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              One <span className="brand-accent">platform</span>.<br />
              Endless experiences at sea.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
              <p>
                Sea Society Ibiza was created to give guests one number, one
                conversation, and access to every yacht in the fleet. The brand
                is new. The operation behind it is not.
              </p>
              <p>
                Every booking still goes through Ibimar's twenty years of
                Botafoc relationships — captains, harbourmasters, caterers,
                photographers, transfer providers. The difference is that you
                no longer have to navigate any of that yourself.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5">
            <Image
              src="/sea-society/site/dest-formentera.webp"
              alt="Yacht anchored off a Formentera sandbank in clear turquoise water."
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Section>

      {/* Ibimar partnership */}
      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <Reveal className="grid items-start gap-12 md:grid-cols-12 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5 md:order-1">
            <Image
              src="/sea-society/site/about-hero.webp"
              alt="Botafoc Marina at golden hour — Ibimar yachts at their berths."
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-7 md:order-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              The partnership
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              In partnership with <span className="brand-accent">Ibimar</span>.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
              <p>
                Ibimar is a family-run operation that has held berths at
                Botafoc Marina since 2005 and now manages 21 yachts across
                day-charter, sunset, and multi-day Balearic itineraries.
              </p>
              <p>
                Sea Society Ibiza is Ibimar's premium charter platform: one
                point of contact, one curated fleet, one operator that owns the
                entire experience — from the WhatsApp message that starts a
                charter through to the chef and floristry on the day.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Crew */}
      <Section>
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
            The crew
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
            The people who run your day.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            Three names you will hear repeatedly across the planning, the
            charter, and the follow-up. Every booking flows through them.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {crew.map((c) => (
              <li
                key={c.name}
                className="rounded-2xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-6"
              >
                <h3 className="font-serif text-2xl text-[var(--color-on-surface)]">
                  {c.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  {c.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  {c.bio}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Botafoc Marina */}
      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <Reveal className="grid items-start gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Home port
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Botafoc <span className="brand-accent">Marina</span>.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
              <p>
                Marina Botafoc is the deep-water marina on the eastern edge of
                Ibiza Town — ten minutes from the airport, walking distance
                from Pacha and the old town, and the home berth of every yacht
                in our fleet.
              </p>
              <p>
                Charters depart and return here. Provisioning, catering and
                transfers all source from Marina Botafoc's preferred partners,
                and our office is on the pier — the same one your captain will
                meet you on.
              </p>
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    Address
                  </dt>
                  <dd className="mt-1">{settings.address}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    Office
                  </dt>
                  <dd className="mt-1">
                    <a
                      className="hover:text-[var(--color-primary)]"
                      href={`mailto:${settings.email}`}
                    >
                      {settings.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-8">
              <BookHereCTA
                number={settings.whatsappNumber}
                tone="dark"
                label="Book your charter"
              />
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5">
            <Image
              src="/sea-society/site/fleet-hero.webp"
              alt="A yacht running parallel to Ibiza's coastline near Botafoc."
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Section>

      {/* Instagram feed — same as homepage */}
      <div className="pt-12 md:pt-20">
        <InstagramGrid
          handle={settings.instagramHandle}
          href={settings.instagramUrl}
        />
      </div>
    </>
  );
}
