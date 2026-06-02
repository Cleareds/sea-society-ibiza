import type { Metadata } from "next";
import Image from "next/image";
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
  const lc = isLocale(locale) ? locale : "en";
  return pageMetadata({
    title:
      lc === "es"
        ? "Conoce a las fundadoras — Sea Society Ibiza"
        : "Meet the Founders — Sea Society Ibiza",
    description:
      lc === "es"
        ? "Sea Society está creada por tres mujeres belgas — Lauren, Dorine y Leentje — que curan experiencias inolvidables de charter desde Botafoc Marina, Ibiza, junto a nuestro socio Ibimar."
        : "Sea Society is built by three Belgian women — Lauren, Dorine and Leentje — who curate unforgettable charter experiences from Botafoc Marina, Ibiza, in partnership with Ibimar.",
    path: "/about",
    locale: lc,
  });
}

const aboutCopy = {
  en: {
    heroTitle: "Meet the Founders",
    paragraphs: [
      "Sea Society was born from a shared passion for unforgettable experiences, meaningful connections and the magic of life on the water.",
      "Behind the platform are three Belgian women who believe that chartering a yacht should be about much more than simply booking a boat. Together with our trusted partner Ibimar, we curate experiences that turn a day at sea into a story worth telling.",
      "Whether you're looking for the perfect proposal setup, a wellness morning, a private chef experience or simply advice on the best hidden spots around Ibiza, we're here to help.",
      "We personally oversee the Sea Society platform, its marketing, collaborations and community, and we're always just a message away for any questions about the experiences featured on our website.",
    ],
    founders: [
      {
        name: "Lauren",
        image: "/sea-society/site/founders/lauren.webp",
        role: "Photographer, marketer & content creator.",
        bio: "Lauren is the visual storyteller behind Sea Society. Always chasing the perfect light, authentic moments and inspiring destinations, she brings the Sea Society lifestyle to life through photography and content. If you've fallen in love with an image on our website or Instagram, chances are Lauren was behind the camera.",
      },
      {
        name: "Dorine",
        image: "/sea-society/site/founders/dorine.webp",
        role: "Sales specialist & collaboration hunter.",
        bio: "Dorine is constantly connecting people, brands and ideas. With a natural talent for sales and relationship building, she's always on the lookout for unique partnerships, exciting experiences and new ways to make Sea Society even more special.",
      },
      {
        name: "Leentje",
        image: "/sea-society/site/founders/leentje.webp",
        role: "Content creator, marketer & trend watcher.",
        bio: "Always tuned into the latest trends and platforms, Leentje helps shape the voice of Sea Society. As a content creator and marketer, she focuses on bringing the brand's experiences, energy and lifestyle to life through authentic storytelling. Her goal is to create content that helps people connect with the world behind Sea Society and feel part of the journey.",
      },
    ],
    welcomeTitle: "Welcome to Sea Society.",
    welcomeSub: "A community built around unforgettable moments at sea.",
  },
  es: {
    heroTitle: "Conoce a las fundadoras",
    paragraphs: [
      "Sea Society nació de una pasión compartida por las experiencias inolvidables, las conexiones auténticas y la magia de la vida en el mar.",
      "Detrás de la plataforma hay tres mujeres belgas convencidas de que alquilar un yate debería ser mucho más que reservar un barco. Junto a nuestro socio de confianza Ibimar, curamos experiencias que convierten un día en el mar en una historia para contar.",
      "Ya sea que busques la pedida de mano perfecta, una mañana de bienestar, una experiencia con chef privado o simplemente consejos sobre los mejores rincones secretos de Ibiza, estamos aquí para ayudarte.",
      "Supervisamos personalmente la plataforma Sea Society, su marketing, colaboraciones y comunidad, y siempre estamos a un mensaje de distancia para resolver cualquier duda sobre las experiencias que aparecen en nuestra web.",
    ],
    founders: [
      {
        name: "Lauren",
        image: "/sea-society/site/founders/lauren.webp",
        role: "Fotógrafa, marketer y creadora de contenido.",
        bio: "Lauren es la narradora visual detrás de Sea Society. Siempre persiguiendo la luz perfecta, momentos auténticos y destinos inspiradores, da vida al estilo Sea Society a través de la fotografía y el contenido. Si te has enamorado de alguna imagen en nuestra web o Instagram, lo más probable es que Lauren estuviera detrás de la cámara.",
      },
      {
        name: "Dorine",
        image: "/sea-society/site/founders/dorine.webp",
        role: "Especialista en ventas y cazadora de colaboraciones.",
        bio: "Dorine está constantemente conectando personas, marcas e ideas. Con un talento natural para las ventas y la creación de relaciones, siempre busca alianzas únicas, experiencias emocionantes y nuevas formas de hacer que Sea Society sea aún más especial.",
      },
      {
        name: "Leentje",
        image: "/sea-society/site/founders/leentje.webp",
        role: "Creadora de contenido, marketer y trend watcher.",
        bio: "Siempre atenta a las últimas tendencias y plataformas, Leentje ayuda a dar forma a la voz de Sea Society. Como creadora de contenido y marketer, se centra en dar vida a las experiencias, la energía y el estilo de vida de la marca a través de un storytelling auténtico. Su objetivo es crear contenido que ayude a la gente a conectar con el mundo detrás de Sea Society y sentirse parte del viaje.",
      },
    ],
    welcomeTitle: "Bienvenido a Sea Society.",
    welcomeSub: "Una comunidad construida en torno a momentos inolvidables en el mar.",
  },
} as const;

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
  const c = aboutCopy[lc];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: t("breadcrumb.home"), path: lp("/") },
          { name: t("nav.about"), path: lp("/about") },
        ])}
      />

      <PageHero
        title={c.heroTitle}
        imageSrc="/sea-society/site/about-hero.webp"
        breadcrumbs={[
          { name: t("breadcrumb.home"), href: lp("/") },
          { name: t("nav.about") },
        ]}
      />

      <Section>
        <Reveal className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-[var(--color-on-surface)] md:text-lg">
          {c.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </Section>

      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <Reveal>
          <ul className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {c.founders.map((f) => (
              <li
                key={f.name}
                className="overflow-hidden rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-surface-container)]">
                  <Image
                    src={f.image}
                    alt={f.name}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8">
                  <h2 className="font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
                    {f.name}
                  </h2>
                  <p className="mt-2 text-sm italic text-[var(--color-primary)]">
                    {f.role}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {f.bio}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section bleed className="bg-[#f4f4f4]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl">
            {c.welcomeTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            {c.welcomeSub}
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
