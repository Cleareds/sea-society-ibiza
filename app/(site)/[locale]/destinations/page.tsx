import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
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
    title: "Destinations — Ibiza & Formentera by boat",
    description:
      "A Sea Society local guide to the Balearics: best coves, hidden anchorages, the day-charter route around Ibiza & Formentera, and the beach clubs we keep going back to.",
    path: "/destinations",
    locale: isLocale(locale) ? locale : "en",
  });
}

// ----- Content (kept inline so the page is one file to edit) ---------

const ibizaCoves = [
  {
    name: "Cala Comte",
    bullets: [
      "Famous for its crystal-clear turquoise water and small offshore islets.",
      "One of the best swimming and snorkeling spots on the island.",
      "Spectacular sunset views.",
    ],
  },
  {
    name: "Cala d'Hort & Es Vedrà",
    bullets: [
      "Ibiza's most iconic coastal scenery.",
      "Dramatic views of the legendary rocky island rising from the sea.",
      "Excellent anchorage for sunset.",
    ],
  },
  {
    name: "Atlantis (Sa Pedrera)",
    bullets: [
      "A unique landscape of carved rock pools and natural swimming basins.",
      "Much easier to access by boat than on foot.",
      "Great for snorkeling and photography.",
    ],
  },
  {
    name: "Cala Salada & Cala Saladeta",
    bullets: [
      "Surrounded by pine-covered cliffs.",
      "Calm, transparent water and a more secluded atmosphere.",
      "Particularly beautiful in the morning.",
    ],
  },
  {
    name: "Benirràs",
    bullets: [
      "Known for its distinctive offshore rock formation.",
      "Excellent anchorage for an afternoon swim.",
      "Beautiful sunset setting.",
    ],
  },
];

const formenteraCoves = [
  {
    name: "Ses Illetes",
    bullets: [
      "Frequently ranked among Europe's most beautiful beaches.",
      "Powder-white sand and Caribbean-like water.",
      "A must-visit by boat.",
    ],
  },
  {
    name: "S'Espalmador",
    bullets: [
      "A small uninhabited island between Ibiza and Formentera.",
      "Accessible only by boat.",
      "Some of the clearest water in the Mediterranean.",
    ],
  },
  {
    name: "Caló des Mort",
    bullets: [
      "Tiny cove surrounded by rocky cliffs.",
      "Stunning turquoise water.",
      "One of the most photogenic spots on the island.",
    ],
  },
  {
    name: "Cala Saona",
    bullets: [
      "Protected bay framed by red cliffs.",
      "Excellent swimming and sunset anchorage.",
      "Popular with yachts and sailing boats.",
    ],
  },
  {
    name: "Cala en Baster",
    bullets: [
      "More rugged and less crowded.",
      "Sea caves, rock formations, and excellent snorkeling.",
      "A hidden gem compared to the more famous beaches.",
    ],
  },
];

const routeStops = [
  "Ibiza",
  "S'Espalmador",
  "Ses Illetes",
  "Caló des Mort",
  "Es Vedrà",
  "Sunset at Cala Comte",
];

const routeCombines = [
  "The clearest waters around Formentera",
  "White-sand beaches and secluded swimming spots",
  "Ibiza's most iconic landmark (Es Vedrà)",
  "One of the best sunsets in the Balearic Islands",
];

const topFive = [
  "S'Espalmador",
  "Ses Illetes",
  "Es Vedrà / Cala d'Hort",
  "Cala Comte",
  "Caló des Mort",
];

const ibizaClubs = [
  {
    name: "Casa Jondal",
    bullets: [
      "Arguably the most sought-after lunch reservation on Ibiza.",
      "Exceptional seafood and elevated Mediterranean cuisine.",
      "Many guests arrive directly from their yachts.",
      "Elegant and fashionable without feeling overly clubby.",
    ],
  },
  {
    name: "Blue Marlin Ibiza",
    bullets: [
      "Ibiza's most famous yacht-side beach club.",
      "Expect superyachts, DJs, cocktails, and a glamorous crowd.",
      "Great for lunch that transitions into an afternoon party.",
      "Best day of the week: Sunday.",
    ],
  },
  {
    name: "Amante Ibiza",
    bullets: [
      "Spectacular cliffside setting overlooking a secluded bay.",
      "More romantic and relaxed than the larger beach clubs.",
      "Excellent Mediterranean cuisine and stunning views.",
      "Ideal for couples or a quieter luxury experience.",
    ],
  },
  {
    name: "El Silencio Ibiza",
    bullets: [
      "Stylish design-focused beach club with an international crowd.",
      "Excellent cocktails and creative Mediterranean cuisine.",
      "Beautiful anchorage and a more contemporary atmosphere.",
    ],
  },
];

// Cala Duo gets its own richer prose layout below; the two simpler
// Formentera clubs are bullet cards like Ibiza.
const formenteraClubs = [
  {
    name: "Beso Beach Formentera",
    bullets: [
      "One of the most iconic beach clubs in the Balearics.",
      "Chic barefoot luxury, great music, and a lively atmosphere.",
      "Arrive by tender from your boat anchored off Ses Illetes.",
      "Famous for long lunches that often turn into afternoon celebrations.",
    ],
  },
  {
    name: "Juan y Andrea",
    bullets: [
      "A classic yacht lunch destination.",
      "Excellent fresh seafood, lobster, and Mediterranean cuisine.",
      "Located directly on the stunning sands of Ses Illetes.",
      "A favourite among yacht owners and celebrities for decades.",
    ],
  },
];

// ----- Reusable bullet card ------------------------------------------

function SpotCard({
  name,
  bullets,
}: {
  name: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h3 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
        {name}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----- Page ----------------------------------------------------------

export default async function DestinationsPage({
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
          { name: t("nav.destinations"), path: lp("/destinations") },
        ])}
      />

      <PageHero
        title="Discover Ibiza & Formentera Through Local Eyes"
        imageSrc="/sea-society/site/destinations-hero.webp"
        imageObjectPosition="center top"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.destinations") },
        ]}
      />

      {/* 1. Intro */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-2xl italic leading-relaxed text-[var(--color-on-surface)] md:text-3xl">
            The best memories don&apos;t always happen on the water.
          </p>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            Over the years, we&apos;ve discovered hidden beach clubs,
            unforgettable restaurants, secret coves and beautiful spots that
            make these islands so special. From long lunches overlooking the
            sea to sunset drinks in places you won&apos;t find in most travel
            guides, these are the locations we genuinely love and recommend.
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.22em] text-[var(--color-primary)]">
            Think of this as your personal Sea Society guide to the Balearics.
          </p>
        </Reveal>
      </Section>

      {/* 2. Ibiza from the Sea */}
      <Section>
        <Reveal>
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl">
            <Image
              src="/sea-society/site/dest-ibiza.webp"
              alt="Ibiza coastline from the water"
              fill
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              From the sea
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Ibiza
            </h2>
            <p className="mt-4 text-base text-[var(--color-on-surface-variant)] md:text-lg">
              Best experienced from the water:
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {ibizaCoves.map((c) => (
              <SpotCard key={c.name} {...c} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 3. Formentera from the Sea */}
      <Section bleed className="bg-[#f4f4f4]">
        <Reveal>
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl">
            <Image
              src="/sea-society/site/dest-formentera.webp"
              alt="Formentera turquoise water and white sand"
              fill
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              From the sea
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Formentera
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {formenteraCoves.map((c) => (
              <SpotCard key={c.name} {...c} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 4. Recommended route */}
      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Recommended boat route · full day
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            Our signature Sea Society loop.
          </h2>

          <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-on-surface)] md:text-base">
            {routeStops.map((stop, i) => (
              <li key={stop} className="flex items-center gap-x-3">
                <span>{stop}</span>
                {i < routeStops.length - 1 && (
                  <span aria-hidden className="text-[var(--color-primary)]">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl text-[var(--color-on-surface)] md:text-2xl">
                What this route combines
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                {routeCombines.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl text-[var(--color-on-surface)] md:text-2xl">
                Top 5 wow-factor anchorages
              </h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                For a luxury day on a yacht
              </p>
              <ol className="mt-4 space-y-2 text-sm text-[var(--color-on-surface)] md:text-base">
                {topFive.map((spot, i) => (
                  <li key={spot} className="flex items-baseline gap-3">
                    <span className="font-serif text-lg text-[var(--color-primary)] md:text-xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{spot}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 5. A MUST Sea Society Experience — Pas des Trucadors */}
      <Section bleed className="bg-[#000000] text-white">
        <Reveal className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5">
            <Image
              src="/sea-society/site/dest-formentera-2.webp"
              alt="Pas des Trucadors sandbar between S'Espalmador and Ses Illetes"
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              A must · Sea Society experience
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Pas des Trucadors.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/85 md:text-lg">
              Between S&apos;Espalmador and the northern tip of Ses Illetes
              lies a shallow sandbar known as Pas des Trucadors. On very calm
              days, many people walk or wade across it — the water is usually
              anywhere from knee-deep to waist-deep, depending on sea
              conditions and wind. The crossing is not always possible:
              currents and water levels can change.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
              From a boat, it looks like two islands connected by a strip of
              white sand surrounded by crystal-clear turquoise water. This is
              one of the most photographed locations in the Balearic Islands.
              The combination of white sand, transparent water and the
              feeling of walking through the sea creates a scene that many
              visitors compare to the Maldives or the Caribbean.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* 6. Ibiza beach clubs */}
      <Section>
        <Reveal>
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl">
            <Image
              src="/sea-society/site/dest-ibiza-2.webp"
              alt="Ibiza beach-club coastline"
              fill
              sizes="(min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Beach clubs · Ibiza
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              The ones we keep going back to.
            </h2>
            <p className="mt-4 text-base text-[var(--color-on-surface-variant)] md:text-lg">
              All reachable by boat — most accept tender drop-offs from your
              anchorage.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {ibizaClubs.map((c) => (
              <SpotCard key={c.name} {...c} />
            ))}
          </div>
        </Reveal>
      </Section>

      {/* 7. Formentera beach clubs */}
      <Section bleed className="bg-[#f4f4f4]">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              Beach clubs · Formentera
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Lunch on the water, the long way.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {formenteraClubs.map((c) => (
              <SpotCard key={c.name} {...c} />
            ))}
            {/* Cala Duo — long-form card spanning two columns on desktop */}
            <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2 md:p-8">
              <h3 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
                Cala Duo
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                One of the most talked-about new openings in Formentera over
                the last couple of seasons. It took over the former Sa Sequi
                location, right on the water near La Savina, and quickly
                positioned itself as a more glamorous, higher-energy
                alternative to places like Beso Beach. Think:
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-[var(--color-on-surface-variant)] md:grid-cols-2 md:text-base">
                {["Sunset DJs", "Yacht crowd", "Sushi, seafood, champagne", "Barefoot luxury with a stronger party atmosphere"].map((b) => (
                  <li key={b} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#000000]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base">
                A lot of visitors describe it as the closest thing Formentera
                has had to a true Ibiza-style beach club while still keeping
                the island&apos;s aesthetic. Some travellers even mention it
                as the main alternative when Beso Beach Formentera is fully
                booked. Don&apos;t forget to check out the Cala Duo staff —
                they seem like they&apos;ve been scouted from the runway ;-)
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 8. Sea Society Tip — closing CTA */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
            The Sea Society tip
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            Not sure where to go?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            Our team is always happy to share personalised recommendations
            based on your trip — whether you&apos;re looking for a romantic
            dinner, a hidden beach, the best sushi on the island or a beach
            club with the perfect atmosphere.
          </p>
          <p className="mt-4 font-serif text-xl italic leading-relaxed text-[var(--color-on-surface)] md:text-2xl">
            Because the best experiences are often the ones that aren&apos;t
            on the itinerary yet.
          </p>
          <div className="mt-10 flex justify-center">
            <BookHereCTA
              number={settings.whatsappNumber}
              tone="dark"
              size="lg"
              label="Ask Sea Society"
              placement="destinations_tip_cta"
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
