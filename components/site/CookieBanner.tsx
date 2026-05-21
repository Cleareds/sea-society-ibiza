"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "ssi-consent-v1";

interface Consent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieLabels {
  title: string;
  body: string;
  preferences: string;
  necessary: string;
  necessaryHint: string;
  analytics: string;
  analyticsHint: string;
  marketing: string;
  marketingHint: string;
  acceptAll: string;
  choose: string;
  saveSelection: string;
  rejectAll: string;
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

export function CookieBanner({ labels }: { labels: CookieLabels }) {
  const [visible, setVisible] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
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
        {labels.title}
      </h2>
      <p id="cookie-desc" className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
        {labels.body}
      </p>

      {showDetails && (
        <fieldset className="mt-4 grid gap-3 rounded-lg border border-[var(--color-outline-variant)] p-4 text-sm">
          <legend className="px-1 text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
            {labels.preferences}
          </legend>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked disabled className="mt-1" />
            <span>
              <span className="font-medium">{labels.necessary}</span> — {labels.necessaryHint}
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
              <span className="font-medium">{labels.analytics}</span> — {labels.analyticsHint}
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
              <span className="font-medium">{labels.marketing}</span> — {labels.marketingHint}
            </span>
          </label>
        </fieldset>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={acceptAll}>
          {labels.acceptAll}
        </Button>
        {showDetails ? (
          <Button variant="outline" size="sm" onClick={acceptSelection}>
            {labels.saveSelection}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
            {labels.choose}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={rejectAll}>
          {labels.rejectAll}
        </Button>
      </div>
    </div>
  );
}

export function getConsent(): Consent | null {
  return read();
}
