"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/admin/actions";
import { initialSettingsState, type SaveSettingsState } from "@/app/admin/actions-state";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { MarkdownField } from "@/components/admin/MarkdownField";
import {
  defaultLocale,
  locales,
  localeLabels,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import type { PageCopy, Settings } from "@/lib/data/types";

const FLASH_MS = 2000;

interface Props {
  settings: Settings;
  editable: boolean;
}

const NON_DEFAULT_LOCALES = locales.filter((l) => l !== defaultLocale);

const EMPTY_COPY: PageCopy = { heroEyebrow: "", heroTitle: "", heroSub: "", body: "" };

export function SettingsForm({ settings, editable }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState<SaveSettingsState, FormData>(
    saveSettings,
    initialSettingsState,
  );
  const [justSavedTick, setJustSavedTick] = React.useState(0);
  const [aboutTab, setAboutTab] = React.useState<Locale>(defaultLocale);
  const [contactTab, setContactTab] = React.useState<Locale>(defaultLocale);

  React.useEffect(() => {
    if (state.status !== "ok" || !state.savedAt) return;
    queueMicrotask(() => setJustSavedTick(state.savedAt!));
    const t = setTimeout(() => {
      setJustSavedTick(0);
      router.refresh();
    }, FLASH_MS);
    return () => clearTimeout(t);
  }, [state.status, state.savedAt, router]);

  return (
    <form action={formAction} className="space-y-10">
      <Section title="Brand & contact">
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Locale-invariant — applies to every language.
        </p>
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field label="Hero headline" name="heroHeadline" defaultValue={settings.heroHeadline} />
          <Field label="Hero sub" name="heroSub" defaultValue={settings.heroSub} />
          <Field label="WhatsApp number" name="whatsappNumber" defaultValue={settings.whatsappNumber} />
          <Field
            label="WhatsApp default message"
            name="whatsappDefaultMessage"
            defaultValue={settings.whatsappDefaultMessage}
          />
          <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl} />
          <Field
            label="Instagram handle"
            name="instagramHandle"
            defaultValue={settings.instagramHandle}
          />
          <Field label="Email" name="email" defaultValue={settings.email} />
          <Field label="Phone" name="phone" defaultValue={settings.phone} />
        </fieldset>
        <fieldset disabled={!editable}>
          <Field label="Address" name="address" defaultValue={settings.address} />
        </fieldset>
      </Section>

      <PageCopySection
        title="About page"
        slug="about"
        tab={aboutTab}
        onTab={setAboutTab}
        canonical={settings.about}
        i18n={settings.aboutI18n}
        editable={editable}
        bodyRows={18}
      />

      <PageCopySection
        title="Contact page"
        slug="contact"
        tab={contactTab}
        onTab={setContactTab}
        canonical={settings.contact}
        i18n={settings.contactI18n}
        editable={editable}
        bodyRows={12}
      />

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton
          idleLabel="Save settings"
          pendingLabel="Saving…"
          justSaved={justSavedTick !== 0}
          disabled={!editable}
        />
        {state.status === "ok" && (
          <p role="status" aria-live="polite" className="text-sm text-[var(--color-primary)]">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" aria-live="assertive" className="text-sm text-[var(--color-secondary)]">
            {state.message}
          </p>
        )}
      </div>

      {!editable && (
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Read-only — Supabase is not configured.
        </p>
      )}
    </form>
  );
}

interface PageCopySectionProps {
  title: string;
  /** Form field prefix — "about" or "contact". */
  slug: "about" | "contact";
  tab: Locale;
  onTab: (lc: Locale) => void;
  canonical: PageCopy;
  i18n: Settings["aboutI18n"];
  editable: boolean;
  bodyRows: number;
}

/**
 * Renders a tab strip and one fieldset per locale. All locale fieldsets stay
 * mounted (just hidden via `display:none`) so values persist across tabs and
 * are submitted in one go. Non-EN locales show the EN value in the
 * placeholder as a hint of what to translate — leaving them empty makes the
 * public site fall back to EN.
 */
function PageCopySection({
  title,
  slug,
  tab,
  onTab,
  canonical,
  i18n,
  editable,
  bodyRows,
}: PageCopySectionProps) {
  return (
    <Section title={title}>
      <div role="tablist" aria-label={`${title} language`} className="flex flex-wrap gap-1.5">
        {locales.map((lc) => (
          <button
            key={lc}
            type="button"
            role="tab"
            aria-selected={tab === lc}
            onClick={() => onTab(lc)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors",
              tab === lc
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]",
            )}
          >
            {localeLabels[lc]}
            {lc === defaultLocale && (
              <span className="ml-1 text-[9px] opacity-70">canonical</span>
            )}
          </button>
        ))}
      </div>

      {/* English (canonical) — these write to the top-level `about`/`contact` columns */}
      <PageCopyFields
        prefix={slug}
        copy={canonical}
        editable={editable}
        bodyRows={bodyRows}
        hidden={tab !== defaultLocale}
        canonicalCopy={null}
      />

      {/* Per-locale overrides — write to about_i18n[locale] / contact_i18n[locale] */}
      {NON_DEFAULT_LOCALES.map((lc) => (
        <PageCopyFields
          key={lc}
          prefix={`${slug}_${lc}`}
          copy={(i18n[lc] as PageCopy | undefined) ?? EMPTY_COPY}
          editable={editable}
          bodyRows={bodyRows}
          hidden={tab !== lc}
          canonicalCopy={canonical}
          locale={lc}
        />
      ))}

      {tab !== defaultLocale && (
        <p className="text-[11px] text-[var(--color-on-surface-variant)]">
          Empty fields will fall back to English at render time.
        </p>
      )}
    </Section>
  );
}

interface PageCopyFieldsProps {
  prefix: string;
  copy: PageCopy;
  editable: boolean;
  bodyRows: number;
  hidden: boolean;
  /**
   * When set, the EN canonical value is shown as placeholder text — helpful
   * for translators who need to see the source while writing the override.
   */
  canonicalCopy: PageCopy | null;
  locale?: Locale;
}

function PageCopyFields({
  prefix,
  copy,
  editable,
  bodyRows,
  hidden,
  canonicalCopy,
  locale,
}: PageCopyFieldsProps) {
  return (
    <div className={hidden ? "hidden" : "space-y-4"} aria-hidden={hidden}>
      <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
        <Field
          label="Hero eyebrow"
          name={`${prefix}Eyebrow`}
          defaultValue={copy.heroEyebrow}
          placeholder={canonicalCopy?.heroEyebrow}
        />
        <Field
          label="Hero title"
          name={`${prefix}Title`}
          defaultValue={copy.heroTitle}
          placeholder={canonicalCopy?.heroTitle}
        />
      </fieldset>
      <fieldset disabled={!editable}>
        <Field
          label="Hero sub"
          name={`${prefix}Sub`}
          defaultValue={copy.heroSub}
          placeholder={canonicalCopy?.heroSub}
        />
      </fieldset>
      <fieldset disabled={!editable}>
        <MarkdownField
          name={`${prefix}Body`}
          defaultValue={copy.body}
          rows={bodyRows}
          label={locale ? `Body (markdown, ${localeLabels[locale]})` : "Body (markdown)"}
        />
      </fieldset>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/60 focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
      />
    </label>
  );
}
