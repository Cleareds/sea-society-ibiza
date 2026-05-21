import Image from "next/image";
import { Breadcrumb } from "@/components/site/Breadcrumb";

interface Crumb {
  name: string;
  href?: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  sub?: string;
  imageSrc: string;
  imageAlt?: string;
  breadcrumbs?: Crumb[];
  height?: "short" | "tall";
}

export function PageHero({
  eyebrow,
  title,
  sub,
  imageSrc,
  imageAlt = "",
  breadcrumbs,
  height = "short",
}: Props) {
  return (
    <section
      className={`relative isolate w-full overflow-hidden bg-[var(--color-primary)] ${
        height === "tall" ? "h-[60vh] min-h-[480px]" : "h-[48vh] min-h-[360px]"
      }`}
    >
      <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/55" />
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 text-white md:px-10 md:pb-20">
        <div className="mx-auto w-full max-w-(--spacing-container-max)">
          {breadcrumbs && (
            <div className="text-white/80">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          {eyebrow && (
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>
          )}
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">{title}</h1>
          {sub && <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">{sub}</p>}
        </div>
      </div>
    </section>
  );
}
