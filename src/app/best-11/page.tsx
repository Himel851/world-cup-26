import type { Metadata } from "next";

import { BestElevenBuilder } from "@/components/best-eleven/BestElevenBuilder";
import { TEAMS } from "@/data/teams";
import { getPlayersForTeam } from "@/lib/player-list";

export const metadata: Metadata = {
  title: "Best XI",
  description:
    "Build your Best 11 for any World Cup 2026 nation — pick players and place them on a tactical pitch.",
};

interface PageProps {
  searchParams: Promise<{ team?: string }>;
}

export default async function BestElevenPage({ searchParams }: PageProps) {
  const { team: teamParam } = await searchParams;

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

  const initialTeamId =
    teamParam === "all"
      ? "all"
      : teamParam && TEAMS.some((t) => t.id === teamParam)
        ? teamParam
        : "all";

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
          Choose any of the 48 nations, pick a formation, and place 11 players on the tactical
          board.
        </p>
      </header>

      <BestElevenBuilder
        teams={TEAMS}
        squadsByTeamId={squadsByTeamId}
        initialTeamId={initialTeamId}
      />
    </div>
  );
}
