"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TeamCard } from "@/components/teams/TeamCard";
import { CONTINENTS, GROUPS } from "@/data/teams";
import { cn } from "@/lib/utils";
import type { Continent, GroupLetter, Team } from "@/types";

interface TeamsExplorerProps {
  teams: Team[];
  initialContinent?: Continent | "All";
}

type SortMode = "ranking" | "name" | "group";

export function TeamsExplorer({ teams, initialContinent = "All" }: TeamsExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [continent, setContinent] = React.useState<Continent | "All">(initialContinent);
  const [group, setGroup] = React.useState<GroupLetter | "All">("All");
  const [sort, setSort] = React.useState<SortMode>("ranking");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = teams.filter((t) => {
      if (continent !== "All" && t.continent !== continent) return false;
      if (group !== "All" && t.group !== group) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.captain.toLowerCase().includes(q) ||
        t.continent.toLowerCase().includes(q)
      );
    });
    out = [...out].sort((a, b) => {
      if (sort === "ranking") return a.fifaRanking - b.fifaRanking;
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.group.localeCompare(b.group);
    });
    return out;
  }, [teams, query, continent, group, sort]);

  const clearAll = () => {
    setQuery("");
    setContinent("All");
    setGroup("All");
    setSort("ranking");
  };

  const hasFilters = query || continent !== "All" || group !== "All" || sort !== "ranking";

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-3 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-2.5 sm:gap-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground max-sm:h-3.5 max-sm:w-3.5" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team, captain or continent…"
              className="h-10 pl-9 text-sm sm:h-11 sm:pl-10"
              aria-label="Search teams"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-white/5"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 max-sm:w-full">
            <FilterGroup
              label="Sort"
              icon={SlidersHorizontal}
              value={sort}
              options={[
                { value: "ranking", label: "Ranking" },
                { value: "name", label: "A–Z" },
                { value: "group", label: "Group" },
              ]}
              onChange={(v) => setSort(v as SortMode)}
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="max-sm:ml-auto shrink-0">
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <Select
            value={continent === "All" ? "" : continent}
            onChange={(e) =>
              setContinent(e.target.value === "" ? "All" : (e.target.value as Continent))
            }
            className="min-w-0 h-9 w-full text-sm font-medium ring-emerald-400/40 focus-visible:ring-2 sm:h-10 sm:w-auto sm:min-w-48"
            aria-label="Filter by continent"
          >
            <option value="">All continents</option>
            {CONTINENTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            value={group === "All" ? "" : group}
            onChange={(e) =>
              setGroup(e.target.value === "" ? "All" : (e.target.value as GroupLetter))
            }
            className="min-w-0 h-9 w-full text-sm font-medium ring-sky-400/40 focus-visible:ring-2 sm:h-10 sm:w-auto sm:min-w-44"
            aria-label="Filter by World Cup group"
          >
            <option value="">All groups</option>
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                Group {g}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground sm:text-sm">
        <p className="min-w-0">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of{" "}
          {teams.length} nations
        </p>
        <Badge variant="outline" className="shrink-0 text-[10px] sm:text-xs">
          FIFA WC 2026
        </Badge>
      </div>

      {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/3 p-12 text-center">
            <p className="text-lg font-semibold">No teams match those filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing some filters or another search.
            </p>
            <Button onClick={clearAll} variant="secondary" size="sm" className="mt-4">
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filtered.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function FilterGroup({ label, icon: Icon, value, options, onChange }: FilterGroupProps) {
  return (
    <div className="flex max-sm:w-full items-center gap-0.5 overflow-x-auto rounded-lg border border-white/10 bg-white/4 p-0.5 sm:gap-1 sm:rounded-xl sm:p-1 cursor-pointer">
      {Icon && (
        <span className="hidden shrink-0 items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground md:inline-flex">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
      )}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold transition-all sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs cursor-pointer",
            value === o.value
              ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/30"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}



