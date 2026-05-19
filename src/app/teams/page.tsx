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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          FIFA World Cup 2026 · 48 Nations
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          National <span className="text-gradient">Teams</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
          Search by name, captain or continent. Filter by continent and group draw, then dive into
          each side&apos;s profile.
        </p>
      </header>

      <TeamsExplorer teams={TEAMS} initialContinent={initialContinent} />
    </div>
  );
}
