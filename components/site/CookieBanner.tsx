"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "ssi-consent-v1";

interface Consent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

function read(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_KEY}=`))
    ?.split("=")[1];
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

function write(consent: Consent) {
  const value = encodeURIComponent(JSON.stringify(consent));
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_KEY}=${value}; max-age=${oneYear}; path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("ssi:consent", { detail: consent }));
}

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    // Defer via microtask so we don't synchronously set state inside the
    // effect (react-hooks/set-state-in-effect). The banner shows after
    // hydration if no consent cookie is present.
    queueMicrotask(() => {
      if (!read()) setVisible(true);
    });
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    write({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };
  const acceptSelection = () => {
    write({ necessary: true, analytics, marketing });
    setVisible(false);
  };
  const rejectAll = () => {
    write({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] p-5 shadow-2xl backdrop-blur md:p-6"
    >
      <h2 id="cookie-title" className="font-serif text-xl text-[var(--color-on-surface)]">
        Cookies, the short version.
      </h2>
      <p id="cookie-desc" className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
        We use cookies that keep the site working, plus optional ones for analytics and marketing.
        Choose what you would like to allow.
      </p>

      {showDetails && (
        <fieldset className="mt-4 grid gap-3 rounded-lg border border-[var(--color-outline-variant)] p-4 text-sm">
          <legend className="px-1 text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
            Preferences
          </legend>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked disabled className="mt-1" />
            <span>
              <span className="font-medium">Necessary</span> — required for the site to function.
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="font-medium">Analytics</span> — anonymous usage to improve the site
              (Google Analytics).
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="font-medium">Marketing</span> — measure ad performance (Meta Pixel).
            </span>
          </label>
        </fieldset>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={acceptAll}>
          Accept all
        </Button>
        {showDetails ? (
          <Button variant="outline" size="sm" onClick={acceptSelection}>
            Save selection
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
            Choose
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={rejectAll}>
          Reject all
        </Button>
      </div>
    </div>
  );
}

export function getConsent(): Consent | null {
  return read();
}
