"use client";

import * as React from "react";
import type { Locale } from "@/lib/i18n/config";

/**
 * Sets document.documentElement.lang to the active locale on hydration.
 * Server-rendered <html lang> stays "en" (so the root layout remains
 * statically renderable), and this client component reconciles the attribute
 * after the page is interactive. Screen readers re-read on attribute change,
 * Google reads after JS.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  React.useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
