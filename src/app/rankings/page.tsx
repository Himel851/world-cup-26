import type { Metadata } from "next";

import { RankingsExplorer } from "@/components/rankings/RankingsExplorer";
import {
  confederationsFromRankings,
  fetchFifaRankings,
} from "@/lib/fifa-rankings";

export const metadata: Metadata = {
  title: "FIFA Rankings",
  description:
    "Live FIFA men's world rankings — search, filter by confederation, and browse all nations.",
};

export const revalidate = 3600;

export default async function RankingsPage() {
  let rankings: Awaited<ReturnType<typeof fetchFifaRankings>> = [];
  let error: string | null = null;

  try {
    rankings = await fetchFifaRankings();
  } catch {
    error = "Could not load live FIFA rankings. Please try again later.";
  }

  const confederations = confederationsFromRankings(rankings);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <header className="mb-4 sm:mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-xs sm:tracking-[0.2em]">
          Live · FIFA.com
        </p>
        <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:mt-2 sm:text-4xl lg:text-5xl">
          FIFA <span className="text-gradient">Rankings</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Men&apos;s national team rankings updated from FIFA. Search across{" "}
          {rankings.length > 0 ? rankings.length : "211+"} nations, filter by confederation or
          World Cup 2026 squads.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-6 py-12 text-center">
          <p className="font-semibold text-rose-200">{error}</p>
        </div>
      ) : (
        <RankingsExplorer rankings={rankings} confederations={confederations} />
      )}
    </div>
  );
}
