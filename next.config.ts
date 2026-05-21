import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin tracing to this project so Next doesn't pick up a parent yarn.lock.
  outputFileTracingRoot: __dirname,
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
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
