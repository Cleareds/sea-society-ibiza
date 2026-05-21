import { defaultLocale, type Locale } from "./config";

/**
 * Merge canonical English content with a per-locale override blob.
 *
 * Returns the EN value unchanged when `locale === defaultLocale` or when
 * the override is missing/empty. Otherwise produces a shallow merge where
 * each truthy value in the locale override replaces the matching EN field.
 * Empty strings and nullish values in the override are skipped so the EN
 * fallback wins for fields the editor hasn't translated yet.
 */
export function mergeI18n<T>(
  canonical: T,
  overrides: Partial<Record<string, Partial<T>>> | null | undefined,
  locale: Locale,
): T {
  if (locale === defaultLocale) return canonical;
  const o = overrides?.[locale];
  if (!o) return canonical;
  const out = { ...(canonical as object) } as Record<string, unknown>;
  for (const [key, value] of Object.entries(o as Record<string, unknown>)) {
    if (value !== null && value !== undefined && value !== "") {
      out[key] = value;
    }
  }
  return out as T;
}
