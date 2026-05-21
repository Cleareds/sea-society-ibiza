"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Local literal so we don't pull next/font + globals through the error boundary
// (this file is the last line of defence when something blows up).
const HERO = "/images/hero/el-verde.webp";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[error boundary]", error);
    }
  }, [error]);

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-primary)] text-white">
      <Image
        src={HERO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70" />

      <div className="relative z-10 mx-auto max-w-xl px-5 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-white/80">Choppy waters</p>
        <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
          Something went wrong on our side.
        </h1>
        <p className="mt-4 text-base text-white/85 md:text-lg">
          We have logged the issue. Try again in a moment — or send us a message and we will sort
          it out.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
            Ref: {error.digest}
          </p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            onClick={() => reset()}
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
          <Button asChild variant="outlineLight" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
