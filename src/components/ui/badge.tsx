import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-[var(--foreground)] border border-white/10",
        primary:
          "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30",
        secondary:
          "bg-sky-400/15 text-sky-300 border border-sky-400/30",
        accent:
          "bg-violet-400/15 text-violet-300 border border-violet-400/30",
        destructive:
          "bg-rose-500/15 text-rose-300 border border-rose-400/30",
        outline:
          "border border-white/15 text-[var(--foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
