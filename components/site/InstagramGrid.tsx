import Image from "next/image";
import { photo } from "@/lib/data/dummy/images";
import { imageVariant } from "@/lib/image-url";

const tiles = [
  photo.ibizaSea,
  photo.formentera,
  photo.classicRiva,
  photo.sunsetSailing,
  photo.snorkeling,
  photo.catamaran,
  photo.yachtAerial,
  photo.formenteraBeach,
  photo.esVedra,
];

interface Props {
  handle: string;
  href: string;
}

export function InstagramGrid({ handle, href }: Props) {
  return (
    <section aria-labelledby="ig-h">
      <div className="mb-8 flex flex-col items-baseline justify-between gap-2 md:flex-row">
        <h2 id="ig-h" className="font-serif text-3xl text-[var(--color-on-surface)]">
          Follow the journey
        </h2>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          {handle}
        </a>
      </div>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {tiles.map((src, i) => (
          <li key={src + i} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={imageVariant(src, 600)}
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 30vw, 33vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
