import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { photo } from "@/lib/data/dummy/images";

export const dynamic = "force-static";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-primary)] text-white">
      <Image
        src={photo.marina}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/70" />

      <div className="relative z-10 mx-auto max-w-xl px-5 text-center">
        <p className="text-xs uppercase tracking-[0.32em] text-white/80">Off-course</p>
        <p className="mt-6 font-serif text-[20vw] leading-none tracking-tight md:text-[180px]">
          404
        </p>
        <h1 className="mt-6 font-serif text-3xl leading-tight md:text-4xl">Page not found.</h1>
        <p className="mt-4 text-base text-white/85 md:text-lg">
          We cannot find that page. The fleet is still moored at Botafoc.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outlineLight" size="lg">
            <Link href="/fleet">Browse the fleet</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
