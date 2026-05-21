"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  defaultValue?: string;
  rows?: number;
  label?: string;
  hint?: string;
}

/**
 * Two-pane markdown editor: textarea on the left, live preview on the right.
 * Tabbed on mobile. Plain markdown — headings (## / ###), bold (**), italic
 * (*), lists (- / 1.), links ([text](url)), blockquotes (>), inline code (`).
 */
export function MarkdownField({
  name,
  defaultValue = "",
  rows = 16,
  label = "Body (markdown)",
  hint = "Supports headings (##, ###), lists (-, 1.), bold (**), italic (*), links [text](url) and blockquotes (>).",
}: Props) {
  const [value, setValue] = React.useState(defaultValue);
  const [view, setView] = React.useState<"edit" | "preview">("edit");

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={`md-${name}`}
          className="text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]"
        >
          {label}
        </label>
        <div role="tablist" className="flex gap-1 text-[10px] uppercase tracking-[0.15em] md:hidden">
          <button
            type="button"
            role="tab"
            aria-selected={view === "edit"}
            onClick={() => setView("edit")}
            className={cn(
              "rounded-full px-3 py-1",
              view === "edit"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-container)]",
            )}
          >
            Edit
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "preview"}
            onClick={() => setView("preview")}
            className={cn(
              "rounded-full px-3 py-1",
              view === "preview"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-container)]",
            )}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <textarea
          id={`md-${name}`}
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck
          className={cn(
            "min-h-[260px] w-full rounded-2xl border border-[var(--color-outline)] bg-transparent p-4 font-mono text-sm leading-relaxed focus-visible:border-[var(--color-primary)] focus-visible:outline-none",
            view === "preview" && "hidden md:block",
          )}
        />
        <div
          className={cn(
            "min-h-[260px] overflow-y-auto rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] p-5",
            view === "edit" && "hidden md:block",
          )}
          aria-label="Live preview"
        >
          <div
            className={cn(
              "max-w-none space-y-3 text-sm text-[var(--color-on-surface-variant)]",
              "[&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-[var(--color-on-surface)] [&_h2]:mt-5",
              "[&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-[var(--color-on-surface)] [&_h3]:mt-4",
              "[&_a]:text-[var(--color-primary)] [&_a]:underline",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
              "[&_strong]:text-[var(--color-on-surface)] [&_em]:italic",
              "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-primary)] [&_blockquote]:pl-3 [&_blockquote]:italic",
              "[&_code]:rounded [&_code]:bg-[var(--color-surface-container)] [&_code]:px-1.5 [&_code]:py-0.5",
            )}
          >
            {value ? <ReactMarkdown>{value}</ReactMarkdown> : (
              <p className="text-[var(--color-on-surface-variant)]">Preview appears here.</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[var(--color-on-surface-variant)]">{hint}</p>
    </div>
  );
}
