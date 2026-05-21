"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/admin/actions";
import { initialSettingsState, type SaveSettingsState } from "@/app/admin/actions-state";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { MarkdownField } from "@/components/admin/MarkdownField";
import type { Settings } from "@/lib/data/types";

const FLASH_MS = 2000;

interface Props {
  settings: Settings;
  editable: boolean;
}

export function SettingsForm({ settings, editable }: Props) {
  const router = useRouter();
  const [state, formAction] = useActionState<SaveSettingsState, FormData>(
    saveSettings,
    initialSettingsState,
  );
  const [justSavedTick, setJustSavedTick] = React.useState(0);

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
          <Field label="Instagram handle" name="instagramHandle" defaultValue={settings.instagramHandle} />
          <Field label="Email" name="email" defaultValue={settings.email} />
          <Field label="Phone" name="phone" defaultValue={settings.phone} />
        </fieldset>
        <fieldset disabled={!editable}>
          <Field label="Address" name="address" defaultValue={settings.address} />
        </fieldset>
      </Section>

      <Section title="About page">
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field label="Hero eyebrow" name="aboutEyebrow" defaultValue={settings.about.heroEyebrow} />
          <Field label="Hero title" name="aboutTitle" defaultValue={settings.about.heroTitle} />
        </fieldset>
        <fieldset disabled={!editable}>
          <Field label="Hero sub" name="aboutSub" defaultValue={settings.about.heroSub} />
        </fieldset>
        <fieldset disabled={!editable}>
          <MarkdownField
            name="aboutBody"
            defaultValue={settings.about.body}
            rows={18}
            label="Body (markdown)"
          />
        </fieldset>
      </Section>

      <Section title="Contact page">
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field label="Hero eyebrow" name="contactEyebrow" defaultValue={settings.contact.heroEyebrow} />
          <Field label="Hero title" name="contactTitle" defaultValue={settings.contact.heroTitle} />
        </fieldset>
        <fieldset disabled={!editable}>
          <Field label="Hero sub" name="contactSub" defaultValue={settings.contact.heroSub} />
        </fieldset>
        <fieldset disabled={!editable}>
          <MarkdownField
            name="contactBody"
            defaultValue={settings.contact.body}
            rows={12}
            label="Body (markdown)"
          />
        </fieldset>
      </Section>

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
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
      />
    </label>
  );
}
