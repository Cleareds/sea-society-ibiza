"use client";

import * as React from "react";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** Stable identifier used to namespace uploads (e.g. boat slug). Falls back to "misc". */
  boatSlug?: string;
  /** Current image URL (Supabase Storage public/transform URL, or external). */
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  /** Storage bucket. Defaults to "boats". */
  bucket?: string;
  /** Optional label override. */
  label?: string;
  /** Aspect-ratio class for the preview. */
  previewClassName?: string;
}

/**
 * Client-side image uploader. Sends the file to /api/admin/upload-image
 * (server route, uses Supabase secret key, writes to a public bucket),
 * then receives a public URL and pipes it back to the parent form.
 *
 * Also accepts an external URL paste (Unsplash etc.) so admins can keep
 * stock imagery during the photography migration.
 */
export function ImageUpload({
  boatSlug,
  value,
  onChange,
  disabled = false,
  bucket = "boats",
  label = "Hero image",
  previewClassName = "aspect-[16/10]",
}: Props) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError("Pick an image file.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError("Image must be under 12 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("bucket", bucket);
      fd.set("scope", boatSlug ?? "misc");
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !body?.url) throw new Error(body?.error ?? "Upload failed.");
      onChange(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)]">
        {label}
      </p>

      <div className="grid gap-4 md:grid-cols-[280px,1fr]">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-[var(--color-surface-container)]",
            previewClassName,
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-xs text-[var(--color-on-surface-variant)]">
              No image
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 grid place-items-center bg-black/40 text-white">
              <span className="inline-flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Uploading…
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <label
              className={cn(
                "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-medium text-white hover:bg-[var(--color-primary-container)]",
                (disabled || uploading) && "pointer-events-none opacity-60",
              )}
            >
              <Upload className="h-4 w-4" aria-hidden />
              {value ? "Replace image" : "Upload image"}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={disabled || uploading}
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
            </label>
            {value && !disabled && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--color-outline)] px-5 text-sm hover:bg-[var(--color-surface-container)]"
              >
                <X className="h-4 w-4" aria-hidden />
                Remove
              </button>
            )}
          </div>

          <label className="block text-[10px] uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
            Or paste a URL
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="https://…"
              className="mt-2 h-11 w-full rounded-full border border-[var(--color-outline)] bg-transparent px-4 text-sm normal-case tracking-normal text-[var(--color-on-surface)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="text-xs text-[var(--color-secondary)]">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
