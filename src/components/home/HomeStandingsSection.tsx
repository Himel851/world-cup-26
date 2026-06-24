import Link from "next/link";
import { BarChart3 } from "lucide-react";

import { GroupStandingsGrid } from "@/components/fixtures/GroupStandingsGrid";
import type { Fixture } from "@/types";

interface HomeStandingsSectionProps {
  fixtures: Fixture[];
}

export function HomeStandingsSection({ fixtures }: HomeStandingsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
            <BarChart3 className="h-3.5 w-3.5" />
            Group stage
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Live standings
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            Points, goal difference, and form across all 12 groups — updated from
            match results.
          </p>
        </div>
        <Link
          href="/fixtures"
          className="text-sm font-semibold text-sky-300 hover:text-sky-200"
        >
          Full fixtures →
        </Link>
      </div>

      <GroupStandingsGrid fixtures={fixtures} />
    </section>
  );
}
