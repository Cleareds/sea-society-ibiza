import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AxeDev } from "@/components/site/AxeDev";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seasocietyibiza.com";

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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#006565",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        {/* Preconnect to the image CDN — opens TCP + TLS early so LCP image loads sooner */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
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
