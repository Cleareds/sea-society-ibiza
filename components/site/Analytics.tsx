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

  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {consent.analytics && ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
      {consent.marketing && pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixel}'); fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
