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
  const titleByLocale: Record<typeof lc, string> = {
    en: "Meet the Founders — Sea Society Ibiza",
    es: "Conoce a las fundadoras — Sea Society Ibiza",
    fr: "Les fondatrices — Sea Society Ibiza",
    nl: "Maak kennis met de oprichtsters — Sea Society Ibiza",
  };
  const descByLocale: Record<typeof lc, string> = {
    en: "Sea Society is built by three Belgian women — Lauren, Dorine and Leentje — who curate unforgettable charter experiences from Botafoc Marina, Ibiza, in partnership with Ibimar.",
    es: "Sea Society está creada por tres mujeres belgas — Lauren, Dorine y Leentje — que curan experiencias inolvidables de charter desde Botafoc Marina, Ibiza, junto a nuestro socio Ibimar.",
    fr: "Sea Society est créée par trois Belges — Lauren, Dorine et Leentje — qui orchestrent des expériences de charter inoubliables depuis Marina Botafoc, Ibiza, en partenariat avec Ibimar.",
    nl: "Sea Society wordt gerund door drie Belgische vrouwen — Lauren, Dorine en Leentje — die onvergetelijke charterervaringen samenstellen vanuit Marina Botafoc, Ibiza, in samenwerking met Ibimar.",
  };
  return pageMetadata({
    title: titleByLocale[lc],
    description: descByLocale[lc],
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
  fr: {
    heroTitle: "Les fondatrices",
    paragraphs: [
      "Sea Society est née d'une passion partagée pour les expériences inoubliables, les rencontres qui comptent et la magie de la vie sur l'eau.",
      "Derrière la plateforme, trois Belges convaincues qu'affréter un yacht devrait être bien plus que simplement réserver un bateau. Avec notre partenaire de confiance Ibimar, nous orchestrons des expériences qui transforment une journée en mer en une histoire que l'on a envie de raconter.",
      "Que vous cherchiez la mise en scène parfaite pour une demande en mariage, une matinée bien-être, une expérience avec chef privé ou simplement des conseils sur les meilleurs coins secrets d'Ibiza, nous sommes là pour vous aider.",
      "Nous supervisons personnellement la plateforme Sea Society, son marketing, ses collaborations et sa communauté, et nous sommes toujours à un message près pour toute question sur les expériences présentées sur notre site.",
    ],
    founders: [
      {
        name: "Lauren",
        image: "/sea-society/site/founders/lauren.webp",
        role: "Photographe, marketeuse et créatrice de contenu.",
        bio: "Lauren est la conteuse visuelle derrière Sea Society. Toujours en quête de la lumière parfaite, de moments authentiques et de destinations inspirantes, elle donne vie au style Sea Society à travers la photographie et le contenu. Si vous êtes tombé sous le charme d'une image sur notre site ou Instagram, il y a de fortes chances que Lauren était derrière l'objectif.",
      },
      {
        name: "Dorine",
        image: "/sea-society/site/founders/dorine.webp",
        role: "Spécialiste des ventes et chasseuse de collaborations.",
        bio: "Dorine connecte sans cesse les gens, les marques et les idées. Avec un talent naturel pour la vente et les relations, elle est toujours à l'affût de partenariats uniques, d'expériences singulières et de nouvelles façons de rendre Sea Society encore plus spécial.",
      },
      {
        name: "Leentje",
        image: "/sea-society/site/founders/leentje.webp",
        role: "Créatrice de contenu, marketeuse et observatrice des tendances.",
        bio: "Toujours à l'écoute des dernières tendances et plateformes, Leentje façonne la voix de Sea Society. En tant que créatrice de contenu et marketeuse, elle s'attache à donner vie aux expériences, à l'énergie et à l'art de vivre de la marque à travers un storytelling authentique. Son objectif : créer du contenu qui aide les gens à se connecter au monde derrière Sea Society et à faire partie du voyage.",
      },
    ],
    welcomeTitle: "Bienvenue chez Sea Society.",
    welcomeSub: "Une communauté construite autour de moments inoubliables en mer.",
  },
  nl: {
    heroTitle: "Maak kennis met de oprichtsters",
    paragraphs: [
      "Sea Society is geboren uit een gedeelde passie voor onvergetelijke ervaringen, betekenisvolle ontmoetingen en de magie van het leven op het water.",
      "Achter het platform staan drie Belgische vrouwen die geloven dat een jacht charteren over veel meer moet gaan dan simpelweg een boot boeken. Samen met onze vertrouwde partner Ibimar stellen we ervaringen samen die een dag op zee veranderen in een verhaal dat het vertellen waard is.",
      "Of u nu de perfecte huwelijksaanzoek-setting zoekt, een wellnessochtend, een ervaring met een privéchef of gewoon advies over de mooiste verborgen plekken van Ibiza — we helpen u graag.",
      "We zien persoonlijk toe op het Sea Society-platform, de marketing, de samenwerkingen en de community, en zijn altijd bereikbaar voor vragen over de ervaringen die op onze website staan.",
    ],
    founders: [
      {
        name: "Lauren",
        image: "/sea-society/site/founders/lauren.webp",
        role: "Fotograaf, marketeer en content creator.",
        bio: "Lauren is de visuele verteller achter Sea Society. Altijd op jacht naar het perfecte licht, authentieke momenten en inspirerende bestemmingen, brengt ze de Sea Society-levensstijl tot leven via fotografie en content. Als u verliefd bent geworden op een beeld op onze website of Instagram, dan stond Lauren waarschijnlijk achter de camera.",
      },
      {
        name: "Dorine",
        image: "/sea-society/site/founders/dorine.webp",
        role: "Sales specialist en jaagster op samenwerkingen.",
        bio: "Dorine verbindt voortdurend mensen, merken en ideeën. Met een natuurlijk talent voor sales en relatieopbouw is ze altijd op zoek naar unieke partnerships, bijzondere ervaringen en nieuwe manieren om Sea Society nog specialer te maken.",
      },
      {
        name: "Leentje",
        image: "/sea-society/site/founders/leentje.webp",
        role: "Content creator, marketeer en trend watcher.",
        bio: "Altijd afgestemd op de nieuwste trends en platforms helpt Leentje de stem van Sea Society vormgeven. Als content creator en marketeer richt ze zich op het tot leven brengen van de ervaringen, de energie en de levensstijl van het merk via authentieke storytelling. Haar doel: content creëren die mensen helpt connecteren met de wereld achter Sea Society en deel laat uitmaken van de reis.",
      },
    ],
    welcomeTitle: "Welkom bij Sea Society.",
    welcomeSub: "Een community gebouwd rond onvergetelijke momenten op zee.",
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
          locale={lc}
          handle={settings.instagramHandle}
          href={settings.instagramUrl}
          tiles={settings.journeyImages}
        />
      </div>
    </>
  );
}
