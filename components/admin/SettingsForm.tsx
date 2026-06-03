"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "@/app/admin/actions";
import { initialSettingsState, type SaveSettingsState } from "@/app/admin/actions-state";
import { SubmitButton } from "@/components/admin/SubmitButton";
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
      <Section
        title="Contact details"
        hint="The phone, email, marina address and social links that appear in the footer + contact page sidebar across every locale."
      >
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field label="Email" name="email" defaultValue={settings.email} />
          <Field label="Phone" name="phone" defaultValue={settings.phone} />
          <Field
            label="WhatsApp number"
            name="whatsappNumber"
            defaultValue={settings.whatsappNumber}
          />
          <Field
            label="Address"
            name="address"
            defaultValue={settings.address}
          />
        </fieldset>
      </Section>

      <Section
        title="WhatsApp pre-filled message"
        hint="The text that pre-fills when a visitor taps any Book here CTA. Keep the qualifying lines (guests / dates / yacht type) so the team can triage fast."
      >
        <fieldset disabled={!editable}>
          <TextArea
            label="Message"
            name="whatsappDefaultMessage"
            rows={5}
            defaultValue={settings.whatsappDefaultMessage}
          />
        </fieldset>
      </Section>

      <Section title="Social links" hint="Each link renders an icon in the footer when filled in; leave blank to hide that icon.">
        <fieldset className="grid gap-4 md:grid-cols-2" disabled={!editable}>
          <Field label="Instagram URL" name="instagramUrl" defaultValue={settings.instagramUrl} />
          <Field
            label="Instagram handle"
            name="instagramHandle"
            defaultValue={settings.instagramHandle}
          />
          <Field
            label="Facebook URL"
            name="facebookUrl"
            defaultValue={settings.facebookUrl ?? ""}
            placeholder="https://www.facebook.com/…"
          />
          <Field
            label="TikTok URL"
            name="tiktokUrl"
            defaultValue={settings.tiktokUrl ?? ""}
            placeholder="https://www.tiktok.com/@…"
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

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-3xl border border-[var(--color-outline-variant)]/40 bg-[var(--color-surface)] p-5 md:p-6">
      <header>
        <h2 className="font-serif text-xl text-[var(--color-on-surface)]">{title}</h2>
        {hint && (
          <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">{hint}</p>
        )}
      </header>
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

function TextArea({
  label,
  name,
  rows = 4,
  defaultValue,
}: {
  label: string;
  name: string;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-3 text-sm normal-case tracking-normal focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
      />
    </label>
  );
}
