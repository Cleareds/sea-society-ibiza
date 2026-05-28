import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "node:path";
import fs from "node:fs";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { variants, depthVideoSrc, type DepthVariant } from "./_variants";

export const metadata: Metadata = {
  title: "Preview — Depth Comparison",
  description: "Compare DA-V2 per-frame depth quality across model + resolution.",
  robots: { index: false, follow: false },
};

export default async function PreviewDepthIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const lp = (p: string) => localePath(lc, p);

  // Group by source video; sort presets by encoder size then maxSide.
  const grouped: Record<string, DepthVariant[]> = {};
  for (const v of variants) {
    (grouped[v.source] ||= []).push(v);
  }

  function hasDepth(v: DepthVariant): boolean {
    const rel = depthVideoSrc(v);
    return fs.existsSync(path.join(process.cwd(), "public", rel.replace(/^\//, "")));
  }

  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-(--spacing-container-max)">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Internal preview
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-6xl">
          Depth comparison
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-on-surface-variant)]">
          Same scroll-scrub treatment as the regular preview-video pages,
          but masks come from per-frame Depth-Anything-V2 inference
          instead of the static heuristic. Compare model + resolution
          combos to find the best quality / size tradeoff.
        </p>

        {Object.entries(grouped).map(([source, vs]) => (
          <section key={source} className="mt-16">
            <h2 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
              {source === "shorten"
                ? "shorten.mov — open sea"
                : source === "shorten-hero"
                  ? "shorten_hero.mov — Ibiza cliffs"
                  : "vertical one.mov — portrait drone"}
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {vs.map((v) => {
                const live = hasDepth(v);
                return (
                  <li
                    key={v.slug}
                    className={`rounded-2xl p-5 ${
                      live
                        ? "bg-[var(--color-surface-container-low)]"
                        : "bg-[var(--color-surface-container-low)]/60"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
                      {v.preset.encoder.toUpperCase()} @{v.preset.maxSide}
                    </p>
                    <p className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
                      {live ? "✓ depth generated" : "⏳ pending"}
                    </p>
                    <Link
                      href={lp(`/preview-video-depth/${v.slug}`)}
                      className="mt-5 inline-block rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white"
                    >
                      Open →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
