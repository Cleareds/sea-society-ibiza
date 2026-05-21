"use client";

import * as React from "react";

/**
 * Last-resort error boundary that wraps even the root layout. Must render
 * its own <html> + <body> because the failure happens above the layout
 * tree. Kept minimal — no fonts, no images, just brand colours from a
 * literal palette (the global stylesheet may not be available here).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[global-error]", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#006565",
          color: "#fcf9f8",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: 0.75,
              margin: 0,
            }}
          >
            Choppy waters
          </p>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.1,
              margin: "20px 0 12px",
            }}
          >
            Something went wrong.
          </h1>
          <p style={{ opacity: 0.85, lineHeight: 1.55, margin: 0 }}>
            The page we tried to render crashed. Reload to try again — or send us a WhatsApp and we
            will look into it.
          </p>
          {error?.digest && (
            <p
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.55,
                marginTop: 14,
              }}
            >
              Ref: {error.digest}
            </p>
          )}
          <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#bc0100",
                color: "#fff",
                border: 0,
                padding: "12px 24px",
                borderRadius: 9999,
                fontSize: 14,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: "2px solid #fff",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: 9999,
                fontSize: 14,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
