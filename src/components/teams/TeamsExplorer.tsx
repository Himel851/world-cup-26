"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team, captain or continent…"
              className="pl-10"
              aria-label="Search teams"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted-foreground)] hover:bg-white/5"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip
            active={continent === "All"}
            onClick={() => setContinent("All")}
          >
            All continents
          </Chip>
          {CONTINENTS.map((c) => (
            <Chip
              key={c}
              active={continent === c}
              onClick={() => setContinent(continent === c ? "All" : c)}
            >
              {c}
            </Chip>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Chip
            active={group === "All"}
            onClick={() => setGroup("All")}
            tone="secondary"
          >
            All groups
          </Chip>
          {GROUPS.map((g) => (
            <Chip
              key={g}
              tone="secondary"
              active={group === g}
              onClick={() => setGroup(group === g ? "All" : g)}
            >
              Group {g}
            </Chip>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
        <p>
          Showing <span className="font-bold text-[var(--foreground)]">{filtered.length}</span>{" "}
          of {teams.length} nations
        </p>
        <Badge variant="outline">FIFA WC 2026</Badge>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center backdrop-blur-xl"
          >
            <p className="text-lg font-semibold">No teams match those filters.</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Try clearing some filters or another search.
            </p>
            <Button onClick={clearAll} variant="secondary" size="sm" className="mt-4">
              Reset filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {filtered.map((team, i) => (
              <TeamCard key={team.id} team={team} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
      {Icon && (
        <span className="hidden items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)] sm:inline-flex">
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
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
            value === o.value
              ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-400/30"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  tone?: "primary" | "secondary";
  children: React.ReactNode;
}

function Chip({ active, onClick, tone = "primary", children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
        active
          ? tone === "primary"
            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-200"
            : "border-sky-400/40 bg-sky-400/15 text-sky-200"
          : "border-white/10 bg-white/[0.04] text-[var(--muted-foreground)] hover:border-white/20 hover:text-[var(--foreground)]",
      )}
    >
      {children}
    </button>
  );
}
