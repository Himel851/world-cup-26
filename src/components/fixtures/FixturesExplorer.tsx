"use client";

import * as React from "react";
import { CalendarDays, ChevronDown, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

import { FixtureDaySection } from "@/components/fixtures/FixtureDaySection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GROUPS, TEAMS } from "@/data/teams";
import { cn, formatKickoffDate } from "@/lib/utils";
import type { Fixture, GroupLetter, GroupMatchday } from "@/types";
import Link from "next/link";

interface FixturesExplorerProps {
  fixtures: Fixture[];
  initialGroup?: GroupLetter | "All";
  initialTeamId?: string;
  highlightTeamId?: string;
}

type SortMode = "date" | "group";
type ViewMode = "group" | "knockout";

const MATCHDAYS: (GroupMatchday | "All")[] = ["All", 1, 2, 3];

function GroupStageFiltersPanel({
  query,
  setQuery,
  teamId,
  setTeamId,
  sort,
  setSort,
  group,
  setGroup,
  matchday,
  setMatchday,
  hasFilters,
  clearAll,
}: {
  query: string;
  setQuery: (v: string) => void;
  teamId: string;
  setTeamId: (v: string) => void;
  sort: SortMode;
  setSort: (v: SortMode) => void;
  group: GroupLetter | "All";
  setGroup: (v: GroupLetter | "All") => void;
  matchday: GroupMatchday | "All";
  setMatchday: (v: GroupMatchday | "All") => void;
  hasFilters: boolean;
  clearAll: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:h-4 sm:w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team, city or venue…"
            className="h-10 pl-9 text-sm sm:h-11 sm:pl-10"
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

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground lg:block" />
          <Select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="min-w-0 h-9 text-sm font-medium ring-emerald-400/40 focus-visible:ring-2 sm:h-10 sm:min-w-48 lg:w-auto"
            aria-label="Filter by team"
          >
            <option value="">All teams</option>
            {[...TEAMS]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </Select>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="min-w-0 h-9 text-sm font-medium ring-emerald-400/40 focus-visible:ring-2 sm:h-10 sm:min-w-44 lg:w-auto"
            aria-label="Sort fixtures"
          >
            <option value="date">Sort by date</option>
            <option value="group">Sort by group</option>
          </Select>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="col-span-2 shrink-0 sm:col-span-1 lg:col-auto"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:py-1">
            Group
          </span>
          <div className="-mx-1 flex min-w-0 gap-1.5 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-2">
            {(["All", ...GROUPS] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs cursor-pointer ",
                  group === g
                    ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
                    : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
                )}
              >
                {g === "All" ? "All" : `Group ${g}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 sm:mt-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:py-1">
            Matchday
          </span>
          <div className="-mx-1 flex min-w-0 gap-1.5 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-2">
            {MATCHDAYS.map((md) => (
              <button
                key={md}
                type="button"
                onClick={() => setMatchday(md)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-xs cursor-pointer ",
                  matchday === md
                    ? "bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/40"
                    : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
                )}
              >
                {md === "All" ? "All" : `MD ${md}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function FixturesExplorer({
  fixtures,
  initialGroup = "All",
  initialTeamId = "",
  highlightTeamId,
}: FixturesExplorerProps) {
  const [view, setView] = React.useState<ViewMode>("group");
  const [query, setQuery] = React.useState("");
  const [group, setGroup] = React.useState<GroupLetter | "All">(initialGroup);
  const [teamId, setTeamId] = React.useState(initialTeamId);
  const [matchday, setMatchday] = React.useState<GroupMatchday | "All">("All");
  const [sort, setSort] = React.useState<SortMode>("date");

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(
    () => initialGroup !== "All" || initialTeamId !== "",
  );

  const groupFixtures = React.useMemo(
    () => fixtures.filter((f) => f.stage === "group"),
    [fixtures],
  );
  const knockoutFixtures = React.useMemo(
    () => fixtures.filter((f) => f.stage !== "group"),
    [fixtures],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    if (view === "knockout") {
      return [...knockoutFixtures].sort(
        (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
      );
    }

    let out = groupFixtures.filter((f) => {
      if (group !== "All" && f.group !== group) return false;
      if (matchday !== "All" && f.matchday !== matchday) return false;
      if (teamId) {
        if (f.homeTeamId !== teamId && f.awayTeamId !== teamId) return false;
      }
      if (!q) return true;
      const home = TEAMS.find((t) => t.id === f.homeTeamId);
      const away = TEAMS.find((t) => t.id === f.awayTeamId);
      const haystack = [
        home?.name,
        away?.name,
        f.venue.name,
        f.venue.city,
        f.group,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    out = [...out].sort((a, b) => {
      if (sort === "group") {
        const g = (a.group ?? "").localeCompare(b.group ?? "");
        if (g !== 0) return g;
        return (a.matchday ?? 0) - (b.matchday ?? 0);
      }
      return new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime();
    });
    return out;
  }, [view, groupFixtures, knockoutFixtures, query, group, teamId, matchday, sort]);

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

  const clearAll = () => {
    setQuery("");
    setGroup("All");
    setTeamId("");
    setMatchday("All");
    setSort("date");
    setMobileFiltersOpen(false);
  };

  const hasFilters =
    view === "group" &&
    Boolean(
      query || group !== "All" || teamId || matchday !== "All" || sort !== "date",
    );

  const groupFilterProps = {
    query,
    setQuery,
    teamId,
    setTeamId,
    sort,
    setSort,
    group,
    setGroup,
    matchday,
    setMatchday,
    hasFilters,
    clearAll,
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-6">
      <div className="order-1 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        <button
          type="button"
          onClick={() => setView("group")}
          className={cn(
            "rounded-full px-3 py-2 text-center text-xs font-semibold transition-colors sm:w-auto sm:px-4 sm:text-sm",
            view === "group"
              ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
              : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
          )}
        >
          Group stage (72)
        </button>
        <button
          type="button"
          onClick={() => setView("knockout")}
          className={cn(
            "rounded-full px-3 py-2 text-center text-xs font-semibold transition-colors sm:w-auto sm:px-4 sm:text-sm",
            view === "knockout"
              ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40"
              : "bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08]",
          )}
        >
          Knockout phase
        </button>

        <Link  href="/quiz">
          <Button variant="secondary" size="sm">
            <Sparkles className="h-4 w-4" />
            Play Quiz
          </Button>
        </Link>
      </div>

      {view === "group" && (
        <>
          <details
            open={mobileFiltersOpen}
            onToggle={(e) => setMobileFiltersOpen((e.target as HTMLDetailsElement).open)}
            className="group order-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl sm:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden [&::marker]:content-none">
              <span className="flex min-w-0 items-center gap-2">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">Search & filters</span>
                {hasFilters && (
                  <span className="shrink-0 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                    On
                  </span>
                )}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border-t border-white/10 px-3 pb-3 pt-2">
              <GroupStageFiltersPanel {...groupFilterProps} />
            </div>
          </details>

          <div className="order-2 hidden rounded-3xl border border-white/10 bg-white/3 p-6 sm:block">
            <GroupStageFiltersPanel {...groupFilterProps} />
          </div>
        </>
      )}

      <div
        className={cn(
          "order-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground sm:order-3 sm:text-sm",
          view === "knockout" && "sm:order-2",
        )}
      >
        <p className="min-w-0 leading-snug">
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "match" : "matches"}
          {teamId && view === "group" && TEAMS.find((t) => t.id === teamId) && (
            <>
              {" "}
              for{" "}
              <span className="text-emerald-300">{TEAMS.find((t) => t.id === teamId)?.name}</span>
            </>
          )}
        </p>
        {view === "group" ? (
          <Badge variant="outline" className="max-w-[min(100%,11rem)] shrink-0 gap-1 truncate px-2 py-0.5 text-[10px] sm:max-w-none sm:px-2.5 sm:py-1 sm:text-xs">
            <CalendarDays className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
            <span className="truncate sm:inline">
              <span className="max-sm:hidden">Group stage · </span>
              Jun 12–28, 2026
            </span>
          </Badge>
        ) : (
          <Badge variant="outline" className="max-w-[min(100%,11rem)] shrink-0 gap-1 truncate px-2 py-0.5 text-[10px] sm:max-w-none sm:px-2.5 sm:py-1 sm:text-xs">
            <CalendarDays className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
            <span className="truncate sm:inline">
              <span className="max-sm:hidden">Knockouts · </span>
              Jun 29 – Jul 20
            </span>
          </Badge>
        )}
      </div>

      <div className={view === "knockout" ? "order-3" : "order-4"}>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center sm:rounded-3xl sm:py-16">
            <p className="text-lg font-semibold">No matches match those filters.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={clearAll}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {byDate.map(([dateLabel, dayFixtures]) => (
              <FixtureDaySection
                key={dateLabel}
                dateKey={dateLabel}
                fixtures={dayFixtures}
                highlightTeamId={highlightTeamId ?? (teamId || undefined)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
