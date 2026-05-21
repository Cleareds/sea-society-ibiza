"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label shown when the form is idle. */
  idleLabel: string;
  /** Optional override for the pending label (default: "Saving…"). */
  pendingLabel?: string;
  /** Set to true for ~1.5s after a successful save to flash a check. */
  justSaved?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

/**
 * Submit button that:
 *   - shows a spinner + "Saving…" while the parent <form> action is pending
 *     (via React 19's useFormStatus)
 *   - flashes a check icon + "Saved" when the parent passes `justSaved`
 *   - falls back to the idle label otherwise
 *
 * Disabled while pending so users can't double-submit.
 */
export function SubmitButton({
  idleLabel,
  pendingLabel = "Saving…",
  justSaved = false,
  variant = "primary",
  className,
  ...rest
}: Props) {
  const { pending } = useFormStatus();

  const palette =
    variant === "danger"
      ? "bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)] text-white"
      : variant === "secondary"
        ? "bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]"
        : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70",
        palette,
        className,
      )}
      {...rest}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : justSaved ? (
        <>
          <Check className="h-4 w-4" aria-hidden />
          Saved
        </>
      ) : (
        idleLabel
      )}
    </button>
  );
}
