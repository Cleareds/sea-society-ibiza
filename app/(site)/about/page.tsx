import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { MarkdownBody } from "@/components/site/MarkdownBody";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSettings } from "@/lib/data";
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

export default async function AboutPage() {
  const settings = await getSettings();
  const { about } = settings;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        eyebrow={about.heroEyebrow || "The story"}
        title={about.heroTitle || "A platform built on twenty years at the dock."}
        sub={about.heroSub}
        imageSrc={photo.marina}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <article className="md:col-span-8">
            <MarkdownBody source={about.body} />
            <div className="mt-10">
              <Button asChild>
                <Link href="/fleet">See the fleet</Link>
              </Button>
            </div>
          </article>
          <aside className="md:col-span-4">
            <div className="rounded-3xl bg-[var(--color-surface-container-low)] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                Get in touch
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                    Marina
                  </dt>
                  <dd className="mt-1">{settings.address}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a className="hover:text-[var(--color-primary)]" href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
                    Phone
                  </dt>
                  <dd className="mt-1">
                    <a className="hover:text-[var(--color-primary)]" href={`tel:${settings.phone}`}>
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
