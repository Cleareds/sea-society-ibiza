import Image from "next/image";
import { Breadcrumb } from "@/components/site/Breadcrumb";

interface Crumb {
  name: string;
  href?: string;
}

interface Props {
  eyebrow?: string;
  /** Headline. Pass a ReactNode to embed brand-accent highlights. */
  title: React.ReactNode;
  sub?: string;
  imageSrc: string;
  imageAlt?: string;
  breadcrumbs?: Crumb[];
  height?: "short" | "tall";
  /** CSS object-position for the hero image. Defaults to "center". Use
   *  values like "center top" when the visual subject (city, headland)
   *  sits at the top of the source frame and would be cropped on wide
   *  screens with the default centre crop. */
  imageObjectPosition?: string;
}

export function PageHero({
  eyebrow,
  title,
  sub,
  imageSrc,
  imageAlt = "",
  breadcrumbs,
  height = "short",
  imageObjectPosition = "center",
}: Props) {
  return (
    <section
      className={`relative isolate w-full overflow-hidden bg-[#06141a] ${
        height === "tall" ? "h-[60vh] min-h-[480px]" : "h-[52vh] min-h-[400px]"
      }`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: imageObjectPosition }}
      />
      <div className="absolute inset-0 brand-image-overlay" />
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 text-white md:px-10 md:pb-20">
        <div className="mx-auto w-full max-w-(--spacing-container-max)">
          {breadcrumbs && (
            <div className="brand-breadcrumb">
              <Breadcrumb items={breadcrumbs} onImage />
            </div>
          )}
          {eyebrow && (
            <p className="brand-eyebrow mt-6">{eyebrow}</p>
          )}
          <h1 className="brand-headline mt-4 max-w-3xl text-[clamp(2.25rem,7.5vw,5rem)] md:text-7xl">{title}</h1>
          {sub && <p className="brand-sub mt-5 max-w-xl text-base md:text-lg">{sub}</p>}
        </div>
      </div>
    </section>
  );
}
