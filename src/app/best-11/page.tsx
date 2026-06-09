import type { Metadata } from "next";

import { BestElevenBuilder } from "@/components/best-eleven/BestElevenBuilder";
import { TEAMS } from "@/data/teams";
import { getPlayersForTeam } from "@/lib/player-list";

export const metadata: Metadata = {
  title: "Best XI",
  description:
    "Build your Best 11 for any World Cup 2026 nation — pick players and place them on a tactical pitch.",
};

export default async function BestElevenPage() {
  const squadsByTeamId = Object.fromEntries(
    TEAMS.map((t) => [
      t.id,
      getPlayersForTeam(t.id).map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
      })),
    ]),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-xs sm:tracking-[0.2em]">
          FIFA World Cup 2026
        </p>
        <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:mt-2 sm:text-4xl lg:text-5xl">
          Build your <span className="text-gradient">Best XI</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Pick a formation, click a position on the pitch, and choose from players across all 48
          nations.
        </p>
      </header>

      <BestElevenBuilder teams={TEAMS} squadsByTeamId={squadsByTeamId} />
    </div>
  );
}
