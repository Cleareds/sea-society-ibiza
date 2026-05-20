import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[120px] w-full border-b border-[var(--color-outline)] bg-transparent px-1 py-2 text-base text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus-visible:border-b-2 focus-visible:border-[var(--color-primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-[border-color] duration-200 resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
