"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Flame, Medal, Trophy } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const BADGE_CONFIG = {
  gold: {
    label: "Gold",
    icon: Crown,
    className: "from-amber-300/30 to-amber-500/10 border-amber-300/40 text-amber-200",
    iconClass: "text-amber-300",
  },
  silver: {
    label: "Silver",
    icon: Trophy,
    className: "from-slate-300/30 to-slate-400/10 border-slate-300/40 text-slate-100",
    iconClass: "text-slate-200",
  },
  bronze: {
    label: "Bronze",
    icon: Medal,
    className: "from-orange-400/30 to-orange-600/10 border-orange-400/40 text-orange-200",
    iconClass: "text-orange-300",
  },
  rising: {
    label: "Rising",
    icon: Flame,
    className: "from-emerald-400/30 to-teal-400/10 border-emerald-400/40 text-emerald-200",
    iconClass: "text-emerald-300",
  },
} as const;

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              <th className="px-4 py-4 sm:px-6">Rank</th>
              <th className="px-4 py-4 sm:px-6">Player</th>
              <th className="hidden px-4 py-4 sm:table-cell sm:px-6">Streak</th>
              <th className="hidden px-4 py-4 md:table-cell md:px-6">Accuracy</th>
              <th className="px-4 py-4 text-right sm:px-6">Score</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => {
              const badge = entry.badge ? BADGE_CONFIG[entry.badge] : null;
              const BadgeIcon = badge?.icon;
              return (
                <motion.tr
                  key={entry.username}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.4) }}
                  className={cn(
                    "border-b border-white/5 transition-colors hover:bg-white/[0.04]",
                    entry.rank === 1 && "bg-amber-400/[0.05]",
                  )}
                >
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-xl font-bold tabular-nums",
                          entry.rank === 1 &&
                            "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
                          entry.rank === 2 &&
                            "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900",
                          entry.rank === 3 &&
                            "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950",
                          entry.rank > 3 && "border border-white/10 bg-white/[0.04] text-[var(--foreground)]",
                        )}
                      >
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15">
                        <Image
                          src={`https://flagcdn.com/w160/${entry.countryCode.toLowerCase()}.png`}
                          alt={entry.country}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{entry.username}</p>
                        <p className="truncate text-xs text-[var(--muted-foreground)]">
                          {entry.country}
                        </p>
                      </div>
                      {badge && BadgeIcon && (
                        <span
                          className={cn(
                            "ml-1 hidden items-center gap-1 rounded-full border bg-gradient-to-br px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest lg:inline-flex",
                            badge.className,
                          )}
                        >
                          <BadgeIcon className={cn("h-3 w-3", badge.iconClass)} />
                          {badge.label}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell sm:px-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-400/10 px-2 py-0.5 text-xs font-semibold text-orange-300">
                      <Flame className="h-3.5 w-3.5" /> {entry.streak}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                          style={{ width: `${entry.accuracy}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {entry.accuracy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums sm:px-6">
                    <span className="font-bold text-emerald-300">
                      {formatNumber(entry.score)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
