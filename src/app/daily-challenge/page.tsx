import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Flame, Zap } from "lucide-react";

import { DailyChallengeClient } from "@/components/quiz/DailyChallengeClient";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description:
    "10 deterministic football trivia questions, identical for every player today. Compete on the global daily leaderboard.",
};

export default function DailyChallengePage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          <CalendarDays className="h-3.5 w-3.5" />
          Daily Challenge · {today}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          Today&apos;s 10 questions
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
          Same exact set for every player. Resets at midnight. Streak bonuses are amplified —
          chase every correct answer.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-orange-300" /> Streak bonus
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-300" /> Time bonus
          </span>
          <Button asChild variant="ghost" size="sm" className="ml-auto">
            <Link href="/leaderboard">View leaderboard</Link>
          </Button>
        </div>
      </header>

      <DailyChallengeClient />
    </div>
  );
}
