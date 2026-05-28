import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * OG / social-share image. Renders the Es Vedra hero as the background
 * with a cinematic darkening overlay + the Sea Society wordmark and a
 * short tagline. Optional ?title= / ?subtitle= overrides for
 * page-specific cards.
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Sea Society Ibiza").slice(0, 120);
  const subtitle = (
    searchParams.get("subtitle") ??
    "Luxury yacht charter from Botafoc Marina"
  ).slice(0, 200);

  const heroUrl = `${origin}/sea-society/site/home-hero.webp`;
  const wordmarkUrl = `${origin}/brand/wordmark-light-1200.webp`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#06141a",
          color: "#fcf9f8",
        }}
      >
        {/* Hero photo cover-fit; biased so Es Vedra reads centre-frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroUrl}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "30% 35%",
          }}
        />
        {/* Darkening overlay for legibility — top-down + foot. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 72,
          }}
        >
          {/* Wordmark, top-left. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wordmarkUrl}
            alt=""
            width={280}
            height={64}
            style={{ width: 280, height: "auto" }}
          />
          {/* Title block, bottom-left. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 8,
                textTransform: "uppercase",
                opacity: 0.85,
              }}
            >
              Sea Society Ibiza · by Ibimar
            </div>
            <div
              style={{
                fontSize: 76,
                fontFamily: "serif",
                lineHeight: 1.05,
                fontWeight: 600,
                maxWidth: 980,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 28,
                opacity: 0.92,
                maxWidth: 920,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
