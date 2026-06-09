import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { FixturesExplorer } from "@/components/fixtures/FixturesExplorer";
import { Button } from "@/components/ui/button";
import { FIXTURES } from "@/data/fixtures";
import { GROUPS, TEAMS } from "@/data/teams";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";
import type { GroupLetter } from "@/types";

export const metadata = createPageMetadata({
  title: "Fixtures",
  description:
    "FIFA World Cup 2026 full schedule — 72 group-stage matches and knockout rounds through the final at MetLife Stadium, New Jersey.",
  path: "/fixtures",
  keywords: [...WC26_KEYWORDS, "World Cup schedule", "match fixtures", "kickoff times", "knockout bracket"],
});

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
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
      {/* <header className="mb-3 max-sm:bg-transparent max-sm:p-0 sm:mb-10 sm:overflow-hidden sm:rounded-3xl sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-8 sm:backdrop-blur-xl lg:p-10">
        <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-sky-300 sm:px-3 sm:text-xs sm:tracking-[0.18em]">
          <CalendarClock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          Official schedule · 48 nations
        </p>
        <h1 className="mt-2 text-xl font-black leading-tight tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
          World Cup 2026 fixtures
        </h1>
        <div className="mt-3 hidden flex-wrap gap-2 sm:mt-5 sm:flex sm:gap-3">
          <Button asChild variant="secondary" size="sm" className="text-sm">
            <Link href="/teams">Browse teams</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link href="/quiz">Take a quiz</Link>
          </Button>
        </div>
      </header> */}

      <FixturesExplorer
        fixtures={FIXTURES}
        initialGroup={initialGroup}
        initialTeamId={initialTeamId}
      />
    </div>
  );
}
