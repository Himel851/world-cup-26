import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { FixturesExplorer } from "@/components/fixtures/FixturesExplorer";
import { Button } from "@/components/ui/button";
import { FIXTURES } from "@/data/fixtures";
import { GROUPS, TEAMS } from "@/data/teams";
import type { GroupLetter } from "@/types";

export const metadata: Metadata = {
  title: "Fixtures",
  description:
    "Official FIFA World Cup 2026 schedule — 72 group-stage matches plus knockout rounds through the final at MetLife Stadium.",
};

interface PageProps {
  searchParams: Promise<{ group?: string; team?: string }>;
}

function parseGroup(param?: string): GroupLetter | "All" {
  if (!param) return "All";
  const upper = param.toUpperCase();
  return GROUPS.includes(upper as GroupLetter) ? (upper as GroupLetter) : "All";
}

export default async function FixturesPage({ searchParams }: PageProps) {
  const { group, team } = await searchParams;
  const initialGroup = parseGroup(group);
  const initialTeamId =
    team && TEAMS.some((t) => t.id === team) ? team : "";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <header className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
          <CalendarClock className="h-3.5 w-3.5" />
          Official schedule · 48 nations
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          World Cup 2026 fixtures
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
          Group stage opens 11 June with Mexico vs South Africa. All 72 group
          matches are listed with venues and kickoff times. Knockout rounds run
          through the final on 19 July at MetLife Stadium.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/teams">Browse teams</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/quiz">Take a quiz</Link>
          </Button>
        </div>
      </header>

      <FixturesExplorer
        fixtures={FIXTURES}
        initialGroup={initialGroup}
        initialTeamId={initialTeamId}
      />
    </div>
  );
}
