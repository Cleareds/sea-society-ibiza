/**
 * Server-side loader for translation messages. The default locale (`en`) is
 * always loaded as the fallback — any key missing from another locale's file
 * resolves to the English string.
 */
import "server-only";
import { defaultLocale, isLocale, type Locale } from "./config";

import en from "@/messages/en.json";
import nl from "@/messages/nl.json";
import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import es from "@/messages/es.json";

type Bundle = Record<string, unknown>;

const bundles: Record<Locale, Bundle> = {
  en: en as Bundle,
  nl: nl as Bundle,
  fr: fr as Bundle,
  de: de as Bundle,
  es: es as Bundle,
};

function lookup(bundle: Bundle | undefined, path: string[]): string | undefined {
  let cur: unknown = bundle;
  for (const seg of path) {
    if (cur && typeof cur === "object" && seg in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(s: string, params?: Record<string, string | number>): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}

export interface Translator {
  (key: string, params?: Record<string, string | number>): string;
  locale: Locale;
}

/**
 * Returns a translator for the given locale. Resolution: lookup the key on
 * the target locale; on miss, fall back to the English bundle; on miss again,
 * return the key itself (visible in dev, fixable later).
 */
export function getMessages(locale: string | undefined): Translator {
  const lc: Locale = isLocale(locale) ? locale : defaultLocale;
  const target = bundles[lc];
  const fallback = bundles[defaultLocale];
  const t: Translator = Object.assign(
    (key: string, params?: Record<string, string | number>) => {
      const path = key.split(".");
      const hit = lookup(target, path) ?? lookup(fallback, path);
      return interpolate(hit ?? key, params);
    },
    { locale: lc },
  );
  return t;
}
