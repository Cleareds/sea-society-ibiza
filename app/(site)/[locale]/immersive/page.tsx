import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImmersiveHero } from "@/components/site/ImmersiveHero";
import { isLocale, localePath, type Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Sea Society — Private Mediterranean escapes",
  description:
    "Curated yacht experiences shaped around privacy, beauty, and effortless escape.",
  robots: { index: false, follow: false },
};

export default async function ImmersivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const lp = (path: string) => localePath(lc, path);

  return (
    <main className="bg-[#06141a] text-white">
      <ImmersiveHero ctaHref1={lp("/fleet")} ctaHref2={lp("/fleet")} />

      {/* Hand-off content so the page doesn't end at the hero. */}
      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            The fleet
          </p>
          <h2 className="mt-4 font-serif text-3xl text-white md:text-5xl">
            21 yachts, one Mediterranean.
          </h2>
          <p className="mt-6 text-base text-white/70">
            Day charters, sunset cruises and multi-day Balearic crossings — all
            from Marina Botafoc.
          </p>
        </div>
      </section>
    </main>
  );
}
