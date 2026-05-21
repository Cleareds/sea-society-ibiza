import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { MarkdownBody } from "@/components/site/MarkdownBody";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getExperiences } from "@/lib/data";
import { addOns } from "@/lib/data/dummy";
import { photo } from "@/lib/data/dummy/images";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "Experiences",
    description:
      "Day trips, sunset cruises, multi-day Balearic charters and special occasions. Plus add-ons: catering, water toys, photographer, florals, champagne.",
    path: "/experiences",
  });
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
        ])}
      />

      <PageHero
        eyebrow="What you can do at sea"
        title="Experiences"
        sub="From a three-hour sunset cruise to a week across the Balearics — every charter is yours."
        imageSrc={photo.sunsetSailing}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Experiences" }]}
      />

      <Section>
        <ul className="space-y-20 md:space-y-32">
          {experiences.map((x, i) => (
            <li key={x.id} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image
                    src={x.heroImage}
                    alt={`${x.title} — ${x.intro}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    loading={i > 0 ? "lazy" : "eager"}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  0{i + 1}
                </p>
                <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
                  {x.title}
                </h2>
                <p className="mt-4 font-serif text-xl italic text-[var(--color-on-surface-variant)]">
                  {x.intro}
                </p>
                <div className="mt-6">
                  <MarkdownBody source={x.body} />
                </div>
                <Button asChild className="mt-8" size="md">
                  <Link href="/contact">Plan this experience</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section bleed className="bg-[var(--color-surface-container-low)]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            Make it yours
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
            Add-ons
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-on-surface-variant)]">
            Tell us what the day needs to be and we will arrange it. A few of the most-asked-for.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {addOns.map((a) => (
              <li
                key={a.title}
                className="rounded-2xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-6"
              >
                <h3 className="font-serif text-2xl text-[var(--color-on-surface)]">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  {a.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
