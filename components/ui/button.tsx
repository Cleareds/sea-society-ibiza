import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Default CTA — black pill that inverts on hover (white bg,
        // #000 text). Border is always #000 so the hover state has
        // a clean stroke against white backgrounds.
        primary:
          "border-2 border-[#000000] bg-[#000000] text-white hover:bg-white hover:text-[#000000] shadow-sm",
        secondary:
          "border-2 border-[#000000] bg-[#000000] text-white hover:bg-white hover:text-[#000000] shadow-sm",
        outline:
          "border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white bg-transparent",
        outlineLight:
          "border-2 border-[var(--color-on-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-on-primary)]/10 bg-transparent",
        ghost:
          "text-[#000000] hover:bg-[#000000]/10",
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
