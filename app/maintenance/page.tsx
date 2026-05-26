import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Coming soon — Sea Society Ibiza",
  description: "Sea Society Ibiza launches soon.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#006565",
};

/**
 * Maintenance / coming-soon shell. Middleware (proxy.ts) rewrites every
 * request to this page when MAINTENANCE_MODE=true and the visitor
 * doesn't match a bypass rule (IP allowlist or cookie set via
 * `?preview=<token>`). Lives outside the (site)/[locale] tree so it
 * doesn't render the header / footer / cookie banner.
 */
export default function MaintenancePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-primary)] px-5 text-white">
      <div className="flex flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand vector */}
        <img
          src="/brand/seasociety-logo.svg"
          alt="Sea Society Ibiza"
          className="block w-[min(92vw,1100px)] h-auto"
          decoding="async"
          fetchPriority="high"
        />
        <p className="mt-12 font-serif text-base tracking-[0.18em] uppercase opacity-70 md:text-lg">
          Coming soon
        </p>
      </div>
    </main>
  );
}
