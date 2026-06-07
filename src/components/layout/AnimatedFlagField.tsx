"use client";

import { useMemo } from "react";

import { TEAMS } from "@/data/teams";

/** Deterministic shuffle — looks random, same on server & client. */
function pickRandomTeams(count: number) {
  const order = TEAMS.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = ((i * 17 + 31) * 13) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.slice(0, count).map((i) => TEAMS[i]);
}

interface AnimatedFlagFieldProps {
  count?: number;
}

/**
 * Lightweight floating flags — CSS only, no framer-motion.
 * ~14 small w80 images, GPU-composited animation.
 */
export function AnimatedFlagField({ count = 14 }: AnimatedFlagFieldProps) {
  const flags = useMemo(
    () =>
      pickRandomTeams(count).map((team, i) => ({
        team,
        left: 6 + ((i * 23 + 11) % 88),
        top: 4 + ((i * 37 + 7) % 90),
        size: 48 + ((i * 11) % 32),
        duration: 11 + ((i * 7) % 10),
        delay: -((i * 2.7) % 12),
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {flags.map(({ team, left, top, size, duration, delay }) => (
        <img
          key={team.id}
          src={team.flag}
          alt=""
          width={80}
          height={53}
          decoding="async"
          className="flag-float absolute rounded-lg object-cover ring-1 ring-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(0,0,0,0.5)]"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: Math.round(size * 0.66),
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
