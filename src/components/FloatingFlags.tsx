"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TEAMS } from "@/data/teams";

interface FloatingFlagsProps {
  count?: number;
  className?: string;
}

/**
 * Cinematic floating flag halo behind hero sections.
 * Picks a deterministic subset on the server and animates them on the client.
 */
export function FloatingFlags({ count = 18, className = "" }: FloatingFlagsProps) {
  // We use indexes (not Math.random) so SSR & client agree on layout.
  const picks = React.useMemo(() => {
    const arr = TEAMS.slice(0, count);
    return arr.map((team, i) => {
      const total = arr.length;
      const angle = (i / total) * Math.PI * 2;
      const radius = 36 + (i % 3) * 8; // %
      const cx = 50 + Math.cos(angle) * radius;
      const cy = 50 + Math.sin(angle) * radius * 0.55;
      const size = 36 + ((i * 7) % 22);
      const duration = 8 + ((i * 13) % 9);
      const delay = (i * 0.35) % 4;
      const drift = ((i * 17) % 24) - 12;
      return { team, cx, cy, size, duration, delay, drift };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {picks.map(({ team, cx, cy, size, duration, delay, drift }) => (
        <motion.div
          key={team.id}
          className="absolute rounded-lg ring-1 ring-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.45)] overflow-hidden"
          style={{
            // Pre-format every value as a string with units so framer-motion's
            // client-side style normalisation matches the server-rendered HTML
            // exactly (avoids React 19 hydration warnings).
            left: `${cx.toFixed(4)}%`,
            top: `${cy.toFixed(4)}%`,
            width: `${size}px`,
            height: `${(size * 0.66).toFixed(2)}px`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.85, 0.5, 0.85],
            y: [0, -16, 0, 14, 0],
            x: [0, drift, 0, -drift, 0],
            rotate: [0, 4, 0, -3, 0],
            scale: [0.9, 1.05, 0.95, 1.05, 0.9],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={team.flag}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            priority={false}
          />
        </motion.div>
      ))}
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--background)_75%)]" />
    </div>
  );
}
