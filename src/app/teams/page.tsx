import type { Metadata } from "next";

import { TeamsExplorer } from "@/components/teams/TeamsExplorer";
import { CONTINENTS, TEAMS } from "@/data/teams";
import type { Continent } from "@/types";

export const metadata: Metadata = {
  title: "Teams",
  description: "Browse all 48 nations competing at the FIFA World Cup 2026.",
};

interface PageProps {
  searchParams: Promise<{ continent?: string }>;
}

export default async function TeamsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = params.continent;
  const initialContinent =
    requested && CONTINENTS.includes(requested as Continent)
      ? (requested as Continent)
      : "All";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
      <header className="mb-4 sm:mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-xs sm:tracking-[0.2em]">
          FIFA World Cup 2026 · 48 Nations
        </p>
        <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:mt-2 sm:text-4xl lg:text-5xl">
          National <span className="text-gradient">Teams</span>
        </h1>
       
      </header>

      <TeamsExplorer teams={TEAMS} initialContinent={initialContinent} />
    </div>
  );
}
