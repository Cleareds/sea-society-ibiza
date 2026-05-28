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

  const byVideo: Record<string, typeof variants> = {};
  for (const v of variants) {
    (byVideo[v.video] ||= []).push(v);
  }

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
          Each card opens a full homepage using the same video as the
          background, with different typography, cursor behaviour and
          colour grade. Hover the cursor across the hero, scroll, watch
          how each one breathes differently.
        </p>

        {Object.entries(byVideo).map(([video, list]) => (
          <section key={video} className="mt-16">
            <h2 className="font-serif text-2xl text-[var(--color-on-surface)] md:text-3xl">
              {video === "open-sea" ? "shorten.mov — open sea" : "shorten_hero.mov — Ibiza cliffs"}
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
              {list.map((v) => (
                <li key={v.slug} className="rounded-2xl bg-[var(--color-surface-container-low)] p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
                    {v.tag}
                  </p>
                  <h3 className="mt-3 font-serif text-xl text-[var(--color-on-surface)]">
                    {v.headlineParts.lead}
                    <span className="brand-accent">{v.headlineParts.accent}</span>
                    {v.headlineParts.trail}
                  </h3>
                  <dl className="mt-4 space-y-1 text-xs text-[var(--color-on-surface-variant)]">
                    <Pair k="typography" v={v.typography} />
                    <Pair k="zoomEnd" v={v.canvas.zoomEnd ?? 0.55} />
                    <Pair k="parallaxX" v={v.canvas.parallaxX ?? 0.010} />
                    <Pair k="cursorLight" v={v.canvas.cursorLightStrength ?? 0.18} />
                    <Pair k="shimmer" v={v.canvas.shimmerStrength ?? 0.10} />
                    <Pair k="saturation" v={v.canvas.saturation ?? 1.0} />
                  </dl>
                  <Link
                    href={lp(`/preview-video/${v.slug}`)}
                    className="mt-6 inline-block rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
                  >
                    Open variant →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

function Pair({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{k}</dt>
      <dd className="font-mono">{String(v)}</dd>
    </div>
  );
}
