import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin tracing to this project so Next doesn't pick up a parent yarn.lock.
  outputFileTracingRoot: __dirname,

  // Stable in Next 16. Babel-based auto-memoisation: cuts client-side
  // re-render cost on the interactive bits (LocaleSwitcher, EnquiryForm,
  // CookieBanner, admin forms) with zero source changes.
  reactCompiler: true,

  // Source maps disabled at the moment — re-enable after the
  // [locale] serverless bundle drops well below Vercel's 300 MB
  // ceiling. Maps don't ship in the lambda directly but they
  // measurably enlarge the build trace + standalone output, and we're
  // tight on headroom right now.
  productionBrowserSourceMaps: false,

  images: {
    // Skip Vercel's image-optimization proxy entirely. Uploaded boat
    // imagery is already pre-encoded to WebP in two sizes by the upload
    // pipeline (app/api/admin/upload-image), and the static hero is a
    // hand-tuned WebP — no on-the-fly transformation needed. Keeps Vercel
    // image-optimization billing at zero.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  // Belt-and-braces security headers for all non-static responses. The
  // middleware (proxy.ts) sets the same headers — Vercel's edge swallows
  // the middleware-set headers on cached responses, hence the duplication.
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // The admin shell should never be indexed even if a stray link lands
        // outside our metadata.robots config.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
