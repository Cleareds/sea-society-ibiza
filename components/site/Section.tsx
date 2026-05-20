import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "default" | "tight";
  bleed?: boolean;
}

export function Section({
  className,
  spacing = "default",
  bleed = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "default" ? "py-20 md:py-32" : "py-12 md:py-20",
        !bleed && "mx-auto max-w-(--spacing-container-max) px-5 md:px-10",
        className,
      )}
      {...props}
    />
  );
}
