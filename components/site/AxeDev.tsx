"use client";

import * as React from "react";

/**
 * Lazy-loads @axe-core/react in development only. Findings appear in the
 * browser console. Excluded from production bundles via the env check.
 *
 * Gated behind NEXT_PUBLIC_ENABLE_AXE=1 because @axe-core/react monkey-
 * patches React.createElement, which fails under Next 16's ESM strict
 * module namespace ("Cannot set property createElement of [object Module]
 * which has only a getter") and tears down whatever else is mid-mount.
 * Opt-in only until upstream ships a fix.
 */
export function AxeDev() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (process.env.NEXT_PUBLIC_ENABLE_AXE !== "1") return;
    let cancelled = false;
    void (async () => {
      try {
        const [{ default: axe }, React, ReactDOM] = await Promise.all([
          import("@axe-core/react"),
          import("react"),
          import("react-dom"),
        ]);
        if (cancelled) return;
        axe(React, ReactDOM, 1000);
      } catch (err) {
        console.warn("[axe] skipped — incompatible with current React/Next:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
