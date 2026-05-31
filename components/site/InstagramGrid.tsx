import Image from "next/image";

/**
 * "Follow the journey" — full-bleed photo wall.
 *
 * Layout brief:
 *   - Title row stays inside the page container (`max-w-(--spacing-container-max)`)
 *     so it aligns with the rest of the page copy.
 *   - The grid itself bleeds to the viewport edges with NO gap between
 *     tiles, NO rounded corners — reads as a single continuous wall.
 *   - Desktop:  6 cols × 3 rows = 18 tiles, smaller individual frames so
 *               the section reads as a tight Instagram-style mosaic.
 *   - Mobile:   2 cols × 3 rows = 6 tiles (the remaining 12 are hidden) —
 *               keeps the section compact on small screens.
 */
const tiles = [
  "/sea-society/site/journey-1.webp",
  "/sea-society/site/journey-2.webp",
  "/sea-society/site/journey-3.webp",
  "/sea-society/site/journey-4.webp",
  "/sea-society/site/journey-5.webp",
  "/sea-society/site/journey-6.webp",
  "/sea-society/site/journey-7.webp",
  "/sea-society/site/journey-8.webp",
  "/sea-society/site/journey-9.webp",
  "/sea-society/site/journey-10.webp",
  "/sea-society/site/journey-11.webp",
  "/sea-society/site/journey-12.webp",
  "/sea-society/site/journey-13.webp",
  "/sea-society/site/journey-14.webp",
  "/sea-society/site/journey-15.webp",
  "/sea-society/site/journey-16.webp",
  "/sea-society/site/journey-17.webp",
  "/sea-society/site/journey-18.webp",
];

interface Props {
  handle: string;
  href: string;
  /** "light" (default) renders the title in on-surface dark on light
   *  backgrounds. "dark" renders white text + brand-shadow for use over
   *  the sea-coloured canvas on the home preview. */
  tone?: "light" | "dark";
  /** Extra class merged into the brand-accent span around "Follow". */
  accentClassName?: string;
}

export function InstagramGrid({ handle, href, tone = "light", accentClassName }: Props) {
  const accentCls = `brand-accent ${accentClassName ?? ""}`.trim();
  const headlineCls =
    tone === "dark"
      ? "brand-headline text-3xl text-white md:text-5xl"
      : "font-serif text-3xl text-[var(--color-on-surface)] md:text-4xl";
  const handleCls =
    tone === "dark"
      ? "text-sm font-medium text-white/85 hover:text-white"
      : "text-sm font-medium text-[var(--color-primary)] hover:underline";
  return (
    <section aria-labelledby="ig-h" className="w-full">
      <div className="mx-auto mb-8 flex w-full max-w-(--spacing-container-max) flex-col items-baseline justify-between gap-2 px-5 md:flex-row md:px-10">
        <h2 id="ig-h" className={headlineCls}>
          <span className={accentCls}>Follow</span> our society
        </h2>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={handleCls}
        >
          {handle}
        </a>
      </div>
      <ul className="grid w-full grid-cols-2 md:grid-cols-6">
        {tiles.map((src, i) => (
          <li
            key={src + i}
            className={`brand-img-hover relative aspect-square overflow-hidden ${
              i >= 6 ? "hidden md:block" : ""
            }`}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow ${handle} on Instagram (opens in a new tab)`}
              className="block h-full w-full"
            >
              <Image
                src={src}
                alt=""
                fill
                loading="lazy"
                sizes="(min-width: 768px) 17vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
