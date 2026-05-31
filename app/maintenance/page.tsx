import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Coming soon — Sea Society Ibiza",
  description: "Sea Society Ibiza launches soon.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
        {/*
          We use the SVG as a CSS mask on a solid white element. Loading the
          SVG via <img> renders it in an isolated context where `fill="currentColor"`
          falls back to black — masking solves that without inlining the markup.
          Aspect ratio mirrors the SVG viewBox (2739.13 / 706.19 ≈ 3.88).
        */}
        <div
          role="img"
          aria-label="Sea Society Ibiza"
          className="bg-white w-[min(92vw,1100px)] aspect-[3.88/1]"
          style={{
            WebkitMaskImage: "url(/brand/seasociety-logo.svg)",
            maskImage: "url(/brand/seasociety-logo.svg)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
        <p className="mt-12 font-serif text-base tracking-[0.18em] uppercase opacity-70 md:text-lg">
          Coming soon
        </p>
      </div>
    </main>
  );
}
