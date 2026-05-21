"use client";

import * as React from "react";

/**
 * Lazy-loads @axe-core/react in development only. Findings appear in the
 * browser console. Excluded from production bundles via the env check.
 */
export function AxeDev() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let cancelled = false;
    void (async () => {
      const [{ default: axe }, React, ReactDOM] = await Promise.all([
        import("@axe-core/react"),
        import("react"),
        import("react-dom"),
      ]);
      if (cancelled) return;
      axe(React, ReactDOM, 1000);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
