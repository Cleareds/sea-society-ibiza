import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { photo } from "@/lib/data/dummy/images";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: "About — Sea Society Ibiza by Ibimar",
    description:
      "Sea Society Ibiza is a luxury charter platform built on Ibimar's 20-year operation at Botafoc Marina. One number, nineteen boats.",
    path: "/about",
  });
}

const pillars = [
  {
    h: "One fleet, one number",
    p: "Most charter sites are aggregators with no skin in the game. Sea Society is the customer-facing layer of Ibimar's actual fleet — booking, captain, boat, all the same conversation.",
  },
  {
    h: "Twenty years in the marina",
    p: "Ibimar has operated out of Botafoc since the early 2000s. The captains know which coves fill up, which restaurants will pick up the phone on the day, which weather pattern means lunch in Cala d'Hort.",
  },
  {
    h: "Brokered, not bartered",
    p: "We do not list boats we cannot operate. Every yacht on the site can be taken out tomorrow if the weather and your dates align.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        eyebrow="The story"
        title="A platform built on twenty years at the dock."
        sub="Sea Society Ibiza is by Ibimar — a Botafoc Marina operation that has spent two decades getting the small things right."
        imageSrc={photo.marina}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              The proposition
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Charter is a service, not a marketplace.
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--color-on-surface-variant)]">
              Most charter platforms exist to broker your booking and step aside. We exist because
              the boat, the captain and the marina are already ours — what you book is what we
              operate. That is the only honest way to deliver a day at sea in Ibiza.
            </p>
            <Button asChild className="mt-8">
              <Link href="/fleet">See the fleet</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={photo.yachtDeck}
              alt="Detail of a luxury yacht's teak deck and chrome railing in the Ibiza light."
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </Section>

      <Section className="-mx-5 bg-[var(--color-surface-container-low)] px-5 md:-mx-10 md:px-10">
        <div className="mx-auto max-w-(--spacing-container-max)">
          <ul className="grid gap-8 md:grid-cols-3">
            {pillars.map((p, i) => (
              <li key={p.h}>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-[var(--color-on-surface)]">{p.h}</h3>
                <p className="mt-3 text-[var(--color-on-surface-variant)]">{p.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
              The marina
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-5xl">
              Botafoc.
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--color-on-surface-variant)]">
              Marina Botafoc sits across the bay from Dalt Vila, ten minutes from the airport and
              a five-minute walk from Talamanca. Every charter departs from here. Your captain
              shares a pin the morning of, which is the only logistics you have to think about.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-5">
            <Image
              src={photo.marina}
              alt="Botafoc Marina at sunset, Ibiza Town in the background."
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
