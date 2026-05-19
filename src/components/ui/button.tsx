"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-emerald-950 shadow-[0_8px_30px_-10px_rgba(34,211,164,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(34,211,164,0.85)] hover:brightness-110",
        glow:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_0_0_0_rgba(34,211,164,0.45)] hover:shadow-[0_0_30px_rgba(34,211,164,0.55)] hover:brightness-110",
        secondary:
          "bg-white/5 text-[var(--foreground)] border border-white/10 hover:bg-white/10 backdrop-blur-md",
        outline:
          "border border-white/15 text-[var(--foreground)] hover:bg-white/5 backdrop-blur-md",
        ghost:
          "text-[var(--foreground)] hover:bg-white/5",
        destructive:
          "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)]",
        link:
          "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
