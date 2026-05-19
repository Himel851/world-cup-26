"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";

import { FixtureCard } from "@/components/fixtures/FixtureCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROUPS, TEAMS } from "@/data/teams";
import { cn, formatKickoffDate } from "@/lib/utils";
import type { Fixture, GroupLetter, GroupMatchday } from "@/types";

interface FixturesExplorerProps {
  fixtures: Fixture[];
  initialGroup?: GroupLetter | "All";
  initialTeamId?: string;
  highlightTeamId?: string;
}

type SortMode = "date" | "group";
type ViewMode = "group" | "knockout";

const MATCHDAYS: (GroupMatchday | "All")[] = ["All", 1, 2, 3];

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

  const groupFixtures = React.useMemo(
    () => fixtures.filter((f) => f.stage === "group"),
    [fixtures],
  );
  const knockoutFixtures = React.useMemo(
    () => fixtures.filter((f) => f.stage !== "group"),
    [fixtures],
  );

  const filtered = React.useMemo(() => {
    if (view === "knockout") return knockoutFixtures;

    const q = query.trim().toLowerCase();
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
  };

  const hasFilters =
    view === "group" &&
    (query || group !== "All" || teamId || matchday !== "All" || sort !== "date");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setView("group")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            view === "group"
              ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
              : "bg-white/[0.04] text-[var(--muted-foreground)] hover:bg-white/[0.08]",
          )}
        >
          Group stage (72)
        </button>
        <button
          type="button"
          onClick={() => setView("knockout")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            view === "knockout"
              ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40"
              : "bg-white/[0.04] text-[var(--muted-foreground)] hover:bg-white/[0.08]",
          )}
        >
          Knockout phase
        </button>
      </div>

      {view === "group" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team, city or venue…"
                className="pl-10"
                aria-label="Search fixtures"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted-foreground)] hover:bg-white/5"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="hidden h-4 w-4 text-[var(--muted-foreground)] sm:block" />
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium outline-none ring-emerald-400/40 focus:ring-2"
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
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium outline-none ring-emerald-400/40 focus:ring-2"
                aria-label="Sort fixtures"
              >
                <option value="date">Sort by date</option>
                <option value="group">Sort by group</option>
              </select>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] sm:w-auto sm:py-2">
              Group
            </span>
            {(["All", ...GROUPS] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  group === g
                    ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40"
                    : "bg-white/[0.04] text-[var(--muted-foreground)] hover:bg-white/[0.08]",
                )}
              >
                {g === "All" ? "All" : `Group ${g}`}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] sm:w-auto sm:py-2">
              Matchday
            </span>
            {MATCHDAYS.map((md) => (
              <button
                key={md}
                type="button"
                onClick={() => setMatchday(md)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  matchday === md
                    ? "bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/40"
                    : "bg-white/[0.04] text-[var(--muted-foreground)] hover:bg-white/[0.08]",
                )}
              >
                {md === "All" ? "All" : `MD ${md}`}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">
            {filtered.length}
          </span>{" "}
          {view === "knockout"
            ? filtered.length === 1
              ? "round"
              : "rounds"
            : filtered.length === 1
              ? "match"
              : "matches"}
          {teamId && view === "group" && TEAMS.find((t) => t.id === teamId) && (
            <>
              {" "}
              for{" "}
              <span className="text-emerald-300">
                {TEAMS.find((t) => t.id === teamId)?.name}
              </span>
            </>
          )}
        </p>
        {view === "group" && (
          <Badge variant="outline" className="gap-1">
            <CalendarDays className="h-3 w-3" />
            Jun 11 – 28, 2026
          </Badge>
        )}
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-dashed border-white/15 py-16 text-center"
          >
            <p className="text-lg font-semibold">No matches match those filters.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={clearAll}>
              Reset filters
            </Button>
          </motion.div>
        ) : view === "knockout" ? (
          <motion.ul
            key="knockout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            {filtered.map((fixture, i) => (
              <li key={fixture.id}>
                <FixtureCard fixture={fixture} index={i} />
              </li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {byDate.map(([dateLabel, dayFixtures]) => (
              <section key={dateLabel}>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                  {dateLabel}
                </h2>
                <ul className="grid gap-4 lg:grid-cols-2">
                  {dayFixtures.map((fixture, i) => (
                    <li key={fixture.id}>
                      <FixtureCard
                        fixture={fixture}
                        index={i}
                        highlightTeamId={highlightTeamId ?? (teamId || undefined)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
