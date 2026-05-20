import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full border-b border-[var(--color-outline)] bg-transparent px-1 py-2 text-base text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus-visible:border-b-2 focus-visible:border-[var(--color-primary)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-[border-color] duration-200",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
