"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { enquirySchema, type EnquiryValues } from "@/lib/schemas";

interface Props {
  defaultBoatName?: string;
  defaultBoatId?: string;
  sourcePage?: string;
  variant?: "stacked" | "grid";
}

export function EnquiryForm({
  defaultBoatName,
  defaultBoatId,
  sourcePage,
  variant = "grid",
}: Props) {
  const [submitState, setSubmitState] = React.useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dates: "",
      groupSize: undefined,
      boatId: defaultBoatId ?? "",
      boatName: defaultBoatName ?? "",
      message: "",
      sourcePage,
      website: "",
    },
  });

  const onSubmit = async (values: EnquiryValues) => {
    setSubmitState("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Could not submit. Please try again.");
      }
      setSubmitState("ok");
      reset();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Unknown error");
      setSubmitState("error");
    }
  };

  if (submitState === "ok") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-primary-container)]/10 p-8 text-center"
      >
        <p className="font-serif text-2xl text-[var(--color-primary)]">Thank you.</p>
        <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
          We have your message and will be in touch within a few hours.
        </p>
      </div>
    );
  }

  const grid = variant === "grid";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-describedby="enquiry-help"
    >
      <p id="enquiry-help" className="sr-only">
        Send us a charter enquiry. We respond within a few hours.
      </p>

      {/* honeypot — hidden from real users */}
      <div aria-hidden className="hidden">
        <Label htmlFor="website">Leave this empty</Label>
        <Input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className={grid ? "grid gap-6 md:grid-cols-2" : "space-y-6"}>
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
          {errors.name && (
            <p role="alert" className="mt-1 text-xs text-[var(--color-secondary)]">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-[var(--color-secondary)]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="dates">Dates</Label>
          <Input id="dates" placeholder="e.g. 12–14 July" {...register("dates")} />
        </div>
        <div>
          <Label htmlFor="groupSize">Group size</Label>
          <Input
            id="groupSize"
            type="number"
            min={1}
            max={50}
            {...register("groupSize", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="boatName">Boat preference</Label>
          <Input
            id="boatName"
            placeholder="Not sure yet"
            {...register("boatName")}
            readOnly={!!defaultBoatName}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Tell us about your charter — occasion, route, anything special."
          {...register("message")}
        />
      </div>

      {submitState === "error" && (
        <p role="alert" aria-live="assertive" className="text-sm text-[var(--color-secondary)]">
          {serverError ?? "Something went wrong. Please try again."}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          We respond within a few hours. By submitting, you agree to our{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-primary)]">
            privacy policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
