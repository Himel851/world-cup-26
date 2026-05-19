"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Flame, Zap } from "lucide-react";

export function DailyChallengeCard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/daily-challenge" className="group block">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-violet-500/20 opacity-90" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-400/30 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Daily Challenge · {today}
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  10 deterministic questions.
                  <span className="block text-gradient">
                    Same set for every player today.
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
                  Earn a streak multiplier for every correct answer in a row. Daily challenges reset
                  at midnight local time.
                </p>
                <div className="mt-5 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-300" /> Streak bonus
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-300" /> Time bonus
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-3xl font-black tabular-nums sm:h-24 sm:w-24 sm:text-4xl">
                  {new Date().getDate()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Today
                  </p>
                  <p className="mt-1 font-semibold">Play now to climb the daily leaderboard</p>
                </div>
              </div>
            </div>

            <div className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
              Begin daily run
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
