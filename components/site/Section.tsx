import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "default" | "tight";
  /**
   * `bleed` makes the <section> span the full viewport width (no max-w / no
   * horizontal padding on the outer element), so backgrounds reach the
   * viewport edges. Children are still constrained to the page container by
   * an internal wrapper.
   */
  bleed?: boolean;
}

export function Section({
  className,
  spacing = "default",
  bleed = false,
  children,
  ...props
}: SectionProps) {
  const padY = spacing === "default" ? "py-20 md:py-32" : "py-12 md:py-20";

  if (bleed) {
    return (
      <section className={cn(padY, className)} {...props}>
        <div className="mx-auto max-w-(--spacing-container-max) px-5 md:px-10">{children}</div>
      </section>
    );
  }

  return (
    <section
      className={cn(padY, "mx-auto max-w-(--spacing-container-max) px-5 md:px-10", className)}
      {...props}
    >
      {children}
    </section>
  );
}
