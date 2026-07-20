import Image from "next/image";
import Link from "next/link";
import { Crown, Trophy } from "lucide-react";

import { winnerFlag, WORLD_CUP_WINNERS } from "@/data/world-cup-winners";

const RANK_STYLE: Record<number, string> = {
  1: "text-amber-300",
  2: "text-slate-300",
  3: "text-orange-400/90",
};

function WinnerRow({ winner }: { winner: (typeof WORLD_CUP_WINNERS)[number] }) {
  return (
    <>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm font-black tabular-nums sm:h-9 sm:w-9 ${
          RANK_STYLE[winner.rank] ?? "text-muted-foreground"
        }`}
      >
        {winner.rank === 1 ? (
          <Crown className="h-4 w-4 text-amber-300" aria-hidden />
        ) : (
          winner.rank
        )}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10 sm:h-6 sm:w-8">
          <Image
            src={winnerFlag(winner.flagCode)}
            alt=""
            fill
            sizes="32px"
            className="object-cover"
          />
        </span>
        <span className="truncate font-semibold">{winner.country}</span>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-sm font-black tabular-nums text-amber-200">
        <Trophy className="h-3.5 w-3.5" />
        {winner.titles}
      </span>

      <div className="flex w-full flex-wrap gap-1.5 sm:w-auto sm:min-w-0 sm:flex-1 sm:justify-end">
        {winner.years.map((year) => (
          <span
            key={year}
            className={`rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums ${
              year === 2026
                ? "border-amber-400/40 bg-amber-400/15 text-amber-200"
                : "border-white/10 bg-white/5"
            }`}
          >
            {year}
          </span>
        ))}
      </div>
    </>
  );
}

export function WorldCupWinners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          <Trophy className="h-3.5 w-3.5" />
          All-Time Champions
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          World Cup Winners
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Nations ranked by FIFA World Cup titles — Spain crowned champions in 2026.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3">
        <div className="hidden border-b border-white/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:grid sm:grid-cols-[3rem_1fr_5rem_1fr] sm:gap-4">
          <span>Rank</span>
          <span>Nation</span>
          <span className="text-center">Titles</span>
          <span className="text-right">Winning years</span>
        </div>

        <ol className="divide-y divide-white/10">
          {WORLD_CUP_WINNERS.map((winner) => {
            const rowClass =
              "flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-4 transition-colors hover:bg-white/4 sm:grid sm:grid-cols-[3rem_1fr_5rem_1fr] sm:items-center sm:gap-4 sm:px-6";

            if (winner.teamId) {
              return (
                <li key={winner.country}>
                  <Link href={`/teams/${winner.teamId}`} className={rowClass}>
                    <WinnerRow winner={winner} />
                  </Link>
                </li>
              );
            }

            return (
              <li key={winner.country} className={rowClass}>
                <WinnerRow winner={winner} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
