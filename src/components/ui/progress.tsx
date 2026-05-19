"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  /** Tone of the indicator bar. */
  tone?: "primary" | "warning" | "danger";
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, tone = "primary", ...props }, ref) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    const toneClass = {
      primary: "from-emerald-400 to-teal-400",
      warning: "from-amber-400 to-orange-400",
      danger: "from-rose-500 to-pink-500",
    }[tone];

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.04]",
          className,
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <motion.div
          className={cn("absolute inset-y-0 left-0 bg-gradient-to-r", toneClass)}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
        <div className="pointer-events-none absolute inset-0 shimmer opacity-40" />
      </div>
    );
  },
);
Progress.displayName = "Progress";
