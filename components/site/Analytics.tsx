"use client";

import * as React from "react";
import Script from "next/script";

interface Consent {
  analytics: boolean;
  marketing: boolean;
}

function readConsent(): Consent {
  if (typeof document === "undefined") return { analytics: false, marketing: false };
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith("ssi-consent-v1="))
    ?.split("=")[1];
  if (!raw) return { analytics: false, marketing: false };
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    return { analytics: false, marketing: false };
  }
}

export function Analytics() {
  const [consent, setConsent] = React.useState<Consent>({ analytics: false, marketing: false });

  React.useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<Consent>).detail;
      if (detail) setConsent({ analytics: !!detail.analytics, marketing: !!detail.marketing });
    };
    window.addEventListener("ssi:consent", onUpdate);
    // Sync from cookie after hydration, deferred to satisfy
    // react-hooks/set-state-in-effect.
    queueMicrotask(() => setConsent(readConsent()));
    return () => window.removeEventListener("ssi:consent", onUpdate);
  }, []);

  // GTM container ID is public (visible in the script URL); env var
  // overrides per-env, fallback is production. GTM owns GA4 + Meta Pixel.
  const gtm = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KTN8M8RB";

  // Load GTM once any consent is granted.
  const loadGtm = (consent.analytics || consent.marketing) && gtm;

  return (
    <>
      {loadGtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
    </>
  );
}
