import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AxeDev } from "@/components/site/AxeDev";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// Brand serif — Sea Society's "Starc Serif", self-hosted from
// /public/fonts/. Only Regular is provided in the brand-book drop, so
// we declare a single weight.
const starcSerif = localFont({
  src: [
    {
      path: "../public/fonts/StarcSerifRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/StarcSerifRegular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-starc",
  display: "swap",
  preload: true,
  fallback: ["Fraunces", "ui-serif", "Georgia", "Times New Roman", "serif"],
});

// Fraunces stays loaded as the *italic* and *variable-weight* fallback.
// Starc Serif only ships a single Regular cut — any time the design calls
// for italic / 600 / 700, Fraunces takes over via the CSS fallback chain
// defined on `--font-serif` in globals.css. Without this Fraunces would
// disappear and the browser would render synthesised italics/bolds of
// the Starc Regular file, which looks terrible.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seasocietyibiza.com";

const supabaseHost = (() => {
  try {
    const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return u ? new URL(u).host : null;
  } catch {
    return null;
  }
})();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sea Society Ibiza | Luxury Yacht Charter",
    template: "%s — Sea Society Ibiza | Luxury Yacht Charter",
  },
  description:
    "Luxury yacht charter in Ibiza & Formentera. 19 boats from Botafoc Marina, handled by Ibimar with 20+ years on the water.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "x-default": "/" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  applicationName: "Sea Society Ibiza",
  appleWebApp: {
    title: "Sea Society Ibiza",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // <html lang> defaults to "en" so the root layout stays statically
  // renderable (no headers()/cookies() calls). The [locale] layout renders
  // <HtmlLang> which client-side updates document.documentElement.lang on
  // hydration.
  return (
    <html
      lang="en"
      className={`${inter.variable} ${starcSerif.variable} ${fraunces.variable}`}
    >
      <head>
        {/* Preconnects open TCP + TLS early — biggest LCP win for the hero image. */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {supabaseHost && (
          <>
            <link rel="preconnect" href={`https://${supabaseHost}`} crossOrigin="" />
            <link rel="dns-prefetch" href={`https://${supabaseHost}`} />
          </>
        )}
        <link rel="preconnect" href="https://wa.me" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <AxeDev />
      </body>
    </html>
  );
}
