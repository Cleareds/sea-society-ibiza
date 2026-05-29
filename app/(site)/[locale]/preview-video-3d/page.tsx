import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { variants } from "./_variants";

export const metadata: Metadata = {
  title: "Preview — 3D water variants",
  description: "Compare 3D water hero presets across lighting + camera.",
  robots: { index: false, follow: false },
};

export default async function PreviewVideo3DIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lp = (p: string) => localePath(locale as Locale, p);

  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-5 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-(--spacing-container-max)">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
          Internal preview
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[var(--color-on-surface)] md:text-6xl">
          3D water variants
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-on-surface-variant)]">
          Same source clip + DA-V2 depth across all four. Only the sun
          direction, sea colour palette, wave amplitude and camera
          geometry change. Open each in a separate tab to compare.
        </p>
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {variants.map((v) => (
            <li key={v.slug} className="rounded-2xl bg-[var(--color-surface-container-low)] p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
                {v.tag}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-[var(--color-on-surface)] capitalize">
                {v.slug.replace(/-/g, " ")}
              </h3>
              <Link
                href={lp(`/preview-video-3d/${v.slug}`)}
                className="mt-6 inline-block rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
              >
                Open →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
