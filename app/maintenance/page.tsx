import type { Metadata, Viewport } from "next";
import { Logo } from "@/components/site/Logo";

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
      <div className="text-center">
        <Logo
          variant="light"
          height={32}
          alt="Sea Society Ibiza"
          className="mx-auto"
          priority
        />
        <p className="mt-14 font-serif text-3xl tracking-tight md:text-4xl">
          Coming soon…
        </p>
      </div>
    </main>
  );
}
