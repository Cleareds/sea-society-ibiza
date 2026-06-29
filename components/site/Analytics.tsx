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
  // overrides per-env, fallback is production. GTM owns GA4.
  const gtm = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-KTN8M8RB";

  // Load GTM once any consent is granted.
  const loadGtm = (consent.analytics || consent.marketing) && gtm;

  // Meta Pixel is loaded directly here (not via GTM) so it fires
  // reliably for the ad campaign. ID is public; env var overrides
  // per-env, fallback is production. Gated on MARKETING consent only.
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1740700350443275";
  const loadPixel = consent.marketing && pixel;

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
      {loadPixel && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixel}');
fbq('track','PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              alt=""
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixel}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
