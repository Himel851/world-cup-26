import type { Metadata } from "next";

import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { LeaderboardSummary } from "@/components/leaderboard/LeaderboardSummary";
import { LEADERBOARD } from "@/data/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Global top-20 players competing on World Cup Challenge. Climb the table with streaks and accuracy.",
};

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          Global Standings
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          The <span className="text-gradient">Leaderboard</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
          The world&apos;s sharpest football minds, ranked. Every correct answer in a streak gives
          you a multiplier — accuracy is king.
        </p>
      </header>

      <LeaderboardSummary entries={LEADERBOARD} />

      <div className="mt-8">
        <LeaderboardTable entries={LEADERBOARD} />
      </div>
    </div>
  );
}
