"use client";

import { motion } from "framer-motion";
import { Crown, Flame, Target, Users } from "lucide-react";

import { formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardSummaryProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardSummary({ entries }: LeaderboardSummaryProps) {
  const top = entries[0];
  const avgAccuracy = Math.round(
    entries.reduce((a, b) => a + b.accuracy, 0) / Math.max(entries.length, 1),
  );
  const totalStreak = entries.reduce((a, b) => a + b.streak, 0);

  const stats = [
    {
      icon: Crown,
      label: "Top scorer",
      value: top.username,
      sub: `${formatNumber(top.score)} pts`,
      accent: "text-amber-300",
      gradient: "from-amber-400/15 to-amber-600/5",
    },
    {
      icon: Users,
      label: "Players ranked",
      value: entries.length.toString(),
      sub: "Top of global pool",
      accent: "text-emerald-300",
      gradient: "from-emerald-400/15 to-teal-500/5",
    },
    {
      icon: Target,
      label: "Avg accuracy",
      value: `${avgAccuracy}%`,
      sub: "Across all top players",
      accent: "text-sky-300",
      gradient: "from-sky-400/15 to-indigo-500/5",
    },
    {
      icon: Flame,
      label: "Total streak",
      value: totalStreak.toString(),
      sub: "Correct answers in a row",
      accent: "text-orange-300",
      gradient: "from-orange-400/15 to-rose-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${s.gradient} p-5 backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {s.label}
              </p>
              <Icon className={`h-4 w-4 ${s.accent}`} />
            </div>
            <p className={`mt-3 truncate text-2xl font-bold ${s.accent}`}>
              {s.value}
            </p>
            <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
              {s.sub}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
