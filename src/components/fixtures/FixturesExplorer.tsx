"use client";

import * as React from "react";
import { CalendarDays, ChevronUp, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";

import { FixtureDaySection } from "@/components/fixtures/FixtureDaySection";
import { GroupStandingsGrid } from "@/components/fixtures/GroupStandingsGrid";
import { KnockoutFixturesGrid } from "@/components/fixtures/KnockoutFixturesGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEAMS } from "@/data/teams";
import { cn, FIXTURE_KICKOFF_TIMEZONE, formatKickoffDate } from "@/lib/utils";
import type { Fixture } from "@/types";

interface FixturesExplorerProps {
  fixtures: Fixture[];
  highlightTeamId?: string;
}

type ViewMode = "group" | "standings" | "knockout";

function bstDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: FIXTURE_KICKOFF_TIMEZONE });
}

function groupFixturesByDate(
  fixtures: Fixture[],
): { dayKey: string; dateLabel: string; fixtures: Fixture[] }[] {
  const map = new Map<string, Fixture[]>();
  for (const f of fixtures) {
    const key = formatKickoffDate(f.kickoffUtc);
    const list = map.get(key) ?? [];
    list.push(f);
    map.set(key, list);
  }
  return [...map.entries()]
    .sort(
      (a, b) =>
        new Date(a[1][0]!.kickoffUtc).getTime() -
        new Date(b[1][0]!.kickoffUtc).getTime(),
    )
    .map(([dateLabel, dayFixtures]) => ({
      dayKey: bstDateKey(dayFixtures[0]!.kickoffUtc),
      dateLabel,
      fixtures: dayFixtures,
    }));
}

function pickAnchorDayKey(
  days: { dayKey: string }[],
  todayKey: string,
): string {
  if (days.length === 0) return todayKey;
  const keys = days.map((d) => d.dayKey);
  if (keys.includes(todayKey)) return todayKey;
  const upcoming = keys.find((k) => k >= todayKey);
  return upcoming ?? keys[keys.length - 1]!;
}

function fixtureMatchesQuery(fixture: Fixture, q: string): boolean {
  const home = TEAMS.find((t) => t.id === fixture.homeTeamId);
  const away = TEAMS.find((t) => t.id === fixture.awayTeamId);
  const haystack = [
    home?.name,
    away?.name,
    fixture.venue.name,
    fixture.venue.city,
    fixture.group,
    fixture.label,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function FixtureSearchBar({
  query,
  setQuery,
  className,
}: {
  query: string;
  setQuery: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:h-4 sm:w-4" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search teams…"
        className="h-9 pl-9 text-sm sm:h-10 sm:pl-10"
        aria-label="Search fixtures"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-white/5"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      )}
    </div>
  );
}

export function FixturesExplorer({
  fixtures,
  highlightTeamId,
}: FixturesExplorerProps) {
  const [view, setView] = React.useState<ViewMode>("group");
  const [query, setQuery] = React.useState("");
  const [pastDaysVisible, setPastDaysVisible] = React.useState(0);

  const groupFixtures = React.useMemo(
    () => fixtures.filter((f) => f.stage === "group"),
    [fixtures],
  );
  const knockoutFixtures = React.useMemo(
    () => fixtures.filter((f) => f.stage !== "group"),
    [fixtures],
  );

  const isSearching =
    (view === "group" || view === "knockout") && Boolean(query.trim());

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    if (view === "knockout") {
      const list = q
        ? knockoutFixtures.filter((f) => fixtureMatchesQuery(f, q))
        : knockoutFixtures;
      return [...list].sort(
        (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
      );
    }

    if (view === "standings") return groupFixtures;

    let out = groupFixtures;
    if (q) {
      out = out.filter((f) => fixtureMatchesQuery(f, q));
    }

    return [...out].sort(
      (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );
  }, [view, groupFixtures, knockoutFixtures, query]);

  const byDate = React.useMemo(() => {
    const map = new Map<string, Fixture[]>();
    for (const f of filtered) {
      const key = formatKickoffDate(f.kickoffUtc);
      const list = map.get(key) ?? [];
      list.push(f);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const timelineMode = view === "group" && !isSearching;

  const allMatchDays = React.useMemo(() => {
    const combined = [...groupFixtures, ...knockoutFixtures].sort(
      (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );
    return groupFixturesByDate(combined);
  }, [groupFixtures, knockoutFixtures]);

  const todayBstKey = React.useMemo(
    () => new Date().toLocaleDateString("en-CA", { timeZone: FIXTURE_KICKOFF_TIMEZONE }),
    [],
  );

  const timelineDays = React.useMemo(() => {
    if (!timelineMode || allMatchDays.length === 0) return null;

    const anchorKey = pickAnchorDayKey(allMatchDays, todayBstKey);
    const anchorIndex = allMatchDays.findIndex((d) => d.dayKey === anchorKey);
    const pastDays = allMatchDays.slice(0, anchorIndex);
    const anchorDay = allMatchDays[anchorIndex]!;
    const futureDays = allMatchDays.slice(anchorIndex + 1);

    const visiblePast = pastDays.slice(Math.max(0, pastDays.length - pastDaysVisible));
    const hiddenPastCount = pastDays.length - visiblePast.length;

    return {
      anchorKey,
      visiblePast,
      anchorDay,
      futureDays,
      hiddenPastCount,
    };
  }, [timelineMode, allMatchDays, todayBstKey, pastDaysVisible]);

  React.useEffect(() => {
    setPastDaysVisible(0);
  }, [isSearching, view]);

  const visibleMatchCount =
    timelineMode && timelineDays
      ? [
          ...timelineDays.visiblePast,
          timelineDays.anchorDay,
          ...timelineDays.futureDays,
        ].reduce((n, d) => n + d.fixtures.length, 0)
      : filtered.length;

  const showSearch = view === "group" || view === "knockout";

  return (
    <div className="flex flex-col gap-3 sm:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setView("group")}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
                view === "group"
                  ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
                  : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
              )}
            >
              Matches
            </button>
            <button
              type="button"
              onClick={() => setView("standings")}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
                view === "standings"
                  ? "bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/40"
                  : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
              )}
            >
              Standings
            </button>
            <button
              type="button"
              onClick={() => setView("knockout")}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
                view === "knockout"
                  ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40"
                  : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
              )}
            >
              Knockout
            </button>
          </div>

          <Link href="/quiz" className="shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 gap-1.5 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="">Play Quiz</span>
            </Button>
          </Link>
        </div>

        {showSearch && (
          <FixtureSearchBar
            query={query}
            setQuery={setQuery}
            className="w-full sm:w-64 md:w-72 lg:w-80 sm:shrink-0"
          />
        )}
      </div>

      <div>
        {view === "standings" ? (
          <GroupStandingsGrid
            fixtures={fixtures}
            filterGroup="All"
            highlightTeamId={highlightTeamId}
          />
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center sm:rounded-3xl sm:py-16">
            <p className="text-lg font-semibold">No matches found.</p>
            {isSearching && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : view === "knockout" ? (
          <KnockoutFixturesGrid
            fixtures={filtered}
            highlightTeamId={highlightTeamId}
          />
        ) : timelineMode && timelineDays ? (
          <div className="space-y-6">
            {timelineDays.hiddenPastCount > 0 && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  onClick={() => setPastDaysVisible((n) => n + 5)}
                >
                  <ChevronUp className="h-4 w-4" />
                  Previous matches
                  <span className="text-muted-foreground">
                    ({timelineDays.hiddenPastCount}{" "}
                    {timelineDays.hiddenPastCount === 1 ? "day" : "days"})
                  </span>
                </Button>
              </div>
            )}

            {[
              ...timelineDays.visiblePast,
              timelineDays.anchorDay,
              ...timelineDays.futureDays,
            ].map((day, index, days) => {
              const isAnchor = day.dayKey === timelineDays.anchorKey;
              const isToday = day.dayKey === todayBstKey;
              const prevDay = days[index - 1];
              const showKnockoutDivider =
                prevDay &&
                prevDay.fixtures.every((f) => f.stage === "group") &&
                day.fixtures.some((f) => f.stage !== "group");

              return (
                <React.Fragment key={day.dateLabel}>
                  {showKnockoutDivider && (
                    <div className="flex items-center gap-3 py-1">
                      <div className="h-px flex-1 bg-amber-400/25" />
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90 sm:text-xs">
                        Knockout phase
                      </span>
                      <div className="h-px flex-1 bg-amber-400/25" />
                    </div>
                  )}
                  <FixtureDaySection
                    sectionId={`fixtures-day-${day.dayKey}`}
                    dateKey={day.dateLabel}
                    fixtures={day.fixtures}
                    highlightTeamId={highlightTeamId}
                    isToday={isToday}
                    isUpNext={isAnchor && !isToday}
                  />
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {byDate.map(([dateLabel, dayFixtures]) => {
              const dayKey = bstDateKey(dayFixtures[0]!.kickoffUtc);
              const isToday = dayKey === todayBstKey;
              return (
                <FixtureDaySection
                  key={dateLabel}
                  sectionId={`fixtures-day-${dayKey}`}
                  dateKey={dateLabel}
                  fixtures={dayFixtures}
                  highlightTeamId={highlightTeamId}
                  isToday={isToday}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
