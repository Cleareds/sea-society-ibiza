import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Sea Society Ibiza").slice(0, 120);
  const subtitle = (searchParams.get("subtitle") ?? "Luxury yacht charter from Botafoc Marina").slice(0, 200);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(160deg, #006565 0%, #008080 60%, #76d6d5 100%)",
          color: "#fcf9f8",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          Sea Society Ibiza · by Ibimar
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 84,
              fontFamily: "serif",
              lineHeight: 1.05,
              fontWeight: 600,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 30, opacity: 0.9, maxWidth: 900 }}>{subtitle}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
