import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-secondary)] text-[var(--color-on-secondary)] hover:bg-[var(--color-secondary-container)] shadow-sm",
        secondary:
          "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-container)] shadow-sm",
        outline:
          "border-2 border-current text-[var(--color-on-surface)] hover:bg-[var(--color-on-surface)]/5 bg-transparent",
        outlineLight:
          "border-2 border-[var(--color-on-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-on-primary)]/10 bg-transparent",
        ghost:
          "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
        whatsapp:
          "bg-[#25D366] text-white hover:bg-[#1FAD52] shadow-sm",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-full",
        md: "h-11 px-6 text-sm rounded-full",
        lg: "h-14 px-10 text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
