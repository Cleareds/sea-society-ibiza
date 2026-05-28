import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { variants } from "./_variants";

export const metadata: Metadata = {
  title: "Preview — Video Variants",
  description: "Compare the POC video hero variants side by side.",
  robots: { index: false, follow: false },
};

export default async function PreviewVideoIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const lp = (p: string) => localePath(lc, p);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-(--spacing-container-max)">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Internal preview
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-6xl">
          Video hero variants
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-on-surface-variant)]">
          Scroll-scrubbed video hero — scroll forward to advance the
          clip, scroll back to rewind. Two source clips, identical
          treatment for a fair comparison.
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {variants.map((v) => (
            <li key={v.slug} className="rounded-2xl bg-[var(--color-surface-container-low)] p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
                {v.tag}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-[var(--color-on-surface)]">
                {v.headlineParts.lead}
                <span className="brand-accent">{v.headlineParts.accent}</span>
                {v.headlineParts.trail}
              </h3>
              <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
                {v.sub}
              </p>
              <Link
                href={lp(`/preview-video/${v.slug}`)}
                className="mt-6 inline-block rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
              >
                Open {v.video === "open-sea" ? "open-sea" : "cliffs"} variant →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

