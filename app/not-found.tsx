import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-on-surface-variant)]">
        Off-course
      </p>
      <h1 className="mt-6 font-serif text-6xl text-[var(--color-primary)]">404</h1>
      <p className="mt-4 max-w-md text-base text-[var(--color-on-surface-variant)]">
        We cannot find that page. The fleet is still moored at Botafoc.
      </p>
      <Button asChild variant="primary" size="lg" className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
