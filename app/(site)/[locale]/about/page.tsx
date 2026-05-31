import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { InstagramGrid } from "@/components/site/InstagramGrid";
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
    title: "Meet the Founders — Sea Society Ibiza",
    description:
      "Sea Society is built by three Belgian women — Lauren, Dorine and Leentje — who curate unforgettable charter experiences from Botafoc Marina, Ibiza, in partnership with Ibimar.",
    path: "/about",
    locale: isLocale(locale) ? locale : "en",
  });
}

const founders = [
  {
    name: "Lauren",
    role: "Photographer, marketer & content creator.",
    bio: "Lauren is the visual storyteller behind Sea Society. Always chasing the perfect light, authentic moments and inspiring destinations, she brings the Sea Society lifestyle to life through photography and content. If you've fallen in love with an image on our website or Instagram, chances are Lauren was behind the camera.",
  },
  {
    name: "Dorine",
    role: "Sales specialist & collaboration hunter.",
    bio: "Dorine is constantly connecting people, brands and ideas. With a natural talent for sales and relationship building, she's always on the lookout for unique partnerships, exciting experiences and new ways to make Sea Society even more special.",
  },
  {
    name: "Leentje",
    role: "Content creator, marketer & trend watcher.",
    bio: "Always tuned into the latest trends, emerging platforms and cultural moments, Leentje helps shape the voice and personality of Sea Society. Her focus goes beyond creating content — she strives to make people feel what's behind the brand. Through storytelling, community building and authentic communication, she brings the energy, emotions and experiences of Sea Society closer to its audience. She believes the strongest brands aren't just seen, they're felt. And that's exactly what she aims to create with every piece of content.",
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
        title="Meet the Founders"
        imageSrc="/sea-society/site/about-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.about") },
        ]}
      />

      <Section>
        <Reveal className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-[var(--color-on-surface)] md:text-lg">
          <p>
            Sea Society was born from a shared passion for unforgettable
            experiences, meaningful connections and the magic of life
            on the water.
          </p>
          <p>
            Behind the platform are three Belgian women who believe that
            chartering a yacht should be about much more than simply
            booking a boat. Together with our trusted partner Ibimar, we
            curate experiences that turn a day at sea into a story worth
            telling.
          </p>
          <p>
            Whether you&apos;re looking for the perfect proposal setup, a
            wellness morning, a private chef experience or simply advice
            on the best hidden spots around Ibiza, we&apos;re here to help.
          </p>
          <p>
            We personally oversee the Sea Society platform, its
            marketing, collaborations and community, and we&apos;re always
            just a message away for any questions about the experiences
            featured on our website.
          </p>
        </Reveal>
      </Section>

      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <Reveal>
          <ul className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {founders.map((f) => (
              <li
                key={f.name}
                className="rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-8"
              >
                <h2 className="font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
                  {f.name}
                </h2>
                <p className="mt-2 text-sm italic text-[var(--color-primary)]">
                  {f.role}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  {f.bio}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section bleed className="bg-[#f4f4f4]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            Welcome to Sea Society.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            A community built around unforgettable moments at sea.
          </p>
        </Reveal>
      </Section>

      <div className="pt-12 md:pt-20">
        <InstagramGrid
          handle={settings.instagramHandle}
          href={settings.instagramUrl}
          tiles={settings.journeyImages}
        />
      </div>
    </>
  );
}
