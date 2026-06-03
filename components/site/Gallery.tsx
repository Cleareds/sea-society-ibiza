"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BoatGalleryImage } from "@/lib/data/types";

interface Props {
  images: BoatGalleryImage[];
  boatName: string;
}

export function Gallery({ images, boatName }: Props) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const prev = React.useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = React.useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  if (images.length === 0) return null;

  // Compact single-row thumbnail strip — 4 cols mobile, 6 on tablet,
  // 8 on desktop. Clicking any tile opens the lightbox at that index;
  // the lightbox is where the large viewing experience lives. Keeps
  // the gallery to a couple hundred px of vertical space at most so
  // the booking aside on the right stays visible alongside it.
  const visible = images.slice(0, 8);
  const overflow = Math.max(0, images.length - visible.length);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-8">
        {visible.map((img, i) => {
          const isLastVisible = i === visible.length - 1;
          const showOverflow = overflow > 0 && isLastVisible;
          return (
            <DialogTrigger key={img.src + i} asChild>
              <button
                type="button"
                onClick={() => openAt(i)}
                className="relative aspect-square overflow-hidden rounded-xl focus-visible:outline-offset-4"
                aria-label={`Open gallery — ${boatName}, image ${i + 1} of ${images.length}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `${boatName} — image ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 11vw, (min-width: 640px) 16vw, 24vw"
                  loading={i < 4 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
                {showOverflow && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-medium tracking-[0.1em] text-white">
                    +{overflow}
                  </span>
                )}
              </button>
            </DialogTrigger>
          );
        })}
      </div>

      <DialogContent className="max-w-5xl border-none bg-[var(--color-on-surface)]/95 p-0 sm:rounded-3xl">
        <DialogTitle className="sr-only">{boatName} gallery</DialogTitle>
        <div className="relative aspect-[16/10] w-full">
          {images[index] && (
            <Image
              src={images[index]!.src}
              alt={images[index]!.alt || `${boatName} — image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          )}
        </div>
        <div className="flex items-center justify-between p-4 text-white">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-xs uppercase tracking-[0.25em]">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
