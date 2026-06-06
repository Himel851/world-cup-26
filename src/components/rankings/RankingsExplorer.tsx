"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import {
  ArrowDown,
  ArrowUp,
  Minus,
  Search,
  TrendingUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { entryFlagUrl } from "@/lib/fifa-rankings";
import { cn } from "@/lib/utils";
import type {
  FifaRankingEntry,
  MovementFilter,
  PageSize,
} from "@/types/fifa-rankings";
import { PAGE_SIZE_OPTIONS } from "@/types/fifa-rankings";

interface RankingsExplorerProps {
  rankings: FifaRankingEntry[];
  confederations: string[];
}

function MovementBadge({ movement }: { movement: number }) {
  if (movement > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
        <ArrowUp className="h-3.5 w-3.5" />+{movement}
      </span>
    );
  }
  if (movement < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-400">
        <ArrowDown className="h-3.5 w-3.5" />
        {movement}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-muted-foreground">
      <Minus className="h-3.5 w-3.5" />—
    </span>
  );
}

export function RankingsExplorer({ rankings, confederations }: RankingsExplorerProps) {
  const [query, setQuery] = React.useState("");
  const [confederation, setConfederation] = React.useState("All");
  const [movement, setMovement] = React.useState<MovementFilter>("all");
  const [wc26Only, setWc26Only] = React.useState(false);
  const [pageSize, setPageSize] = React.useState<PageSize>(20);
  const [page, setPage] = React.useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rankings.filter((r) => {
      if (confederation !== "All" && r.confederation !== confederation) return false;
      if (wc26Only && !r.teamId) return false;
      if (movement === "up" && r.movement <= 0) return false;
      if (movement === "down" && r.movement >= 0) return false;
      if (movement === "unchanged" && r.movement !== 0) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.idCountry.toLowerCase().includes(q) ||
        r.confederation.toLowerCase().includes(q)
      );
    });
  }, [rankings, query, confederation, movement, wc26Only]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const sliceStart = safePage * pageSize;
  const pageItems = filtered.slice(sliceStart, sliceStart + pageSize);

  React.useEffect(() => {
    setPage(0);
  }, [query, confederation, movement, wc26Only, pageSize]);

  const hasFilters =
    query || confederation !== "All" || movement !== "all" || wc26Only;

  const clearAll = () => {
    setQuery("");
    setConfederation("All");
    setMovement("all");
    setWc26Only(false);
    setPage(0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-3 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nation, code or confederation…"
              className="h-10 pl-9 sm:h-11 sm:pl-10"
              aria-label="Search rankings"
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

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="shrink-0">
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-3">
          <Select
            value={confederation}
            onChange={(e) => setConfederation(e.target.value)}
            aria-label="Filter by confederation"
            className="h-9 text-sm sm:h-10"
          >
            <option value="All">All confederations</option>
            {confederations.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            value={movement}
            onChange={(e) => setMovement(e.target.value as MovementFilter)}
            aria-label="Filter by rank movement"
            className="h-9 text-sm sm:h-10"
          >
            <option value="all">All movement</option>
            <option value="up">Moved up</option>
            <option value="down">Moved down</option>
            <option value="unchanged">Unchanged</option>
          </Select>

          <Select
            value={String(pageSize)}
            onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}
            aria-label="Results per page"
            className="h-9 text-sm sm:h-10"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </Select>

          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 text-sm sm:h-10">
            <input
              type="checkbox"
              checked={wc26Only}
              onChange={(e) => setWc26Only(e.target.checked)}
              className="accent-emerald-400"
            />
            WC26 teams only
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground sm:text-sm">
        <p>
          Showing{" "}
          <span className="font-bold text-foreground">
            {filtered.length === 0 ? 0 : sliceStart + 1}–
            {Math.min(sliceStart + pageSize, filtered.length)}
          </span>{" "}
          of <span className="font-bold text-foreground">{filtered.length}</span>
          {filtered.length !== rankings.length && (
            <> (filtered from {rankings.length})</>
          )}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
          Live FIFA rankings
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 sm:rounded-3xl">
        <div className="hidden grid-cols-[3.5rem_1fr_6rem_5rem_5rem_4rem] gap-3 border-b border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:grid sm:px-6">
          <span>Rank</span>
          <span>Team</span>
          <span>Confederation</span>
          <span className="text-right">Points</span>
          <span className="text-right">Prev</span>
          <span className="text-center">Move</span>
        </div>

        {pageItems.length === 0 ? (
          <div className="px-4 py-12 text-center sm:px-6">
            <p className="font-semibold">No nations match those filters.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={clearAll}>
              Reset filters
            </Button>
          </div>
        ) : (
          <ol className="divide-y divide-white/10">
            {pageItems.map((entry) => {
              const row = (
                <>
                  <span className="flex h-8 w-10 shrink-0 items-center justify-center text-lg font-black tabular-nums text-emerald-300 sm:w-12">
                    {entry.rank}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10 sm:h-6 sm:w-8">
                      <Image
                        src={entryFlagUrl(entry)}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.idCountry}</p>
                    </div>
                  </div>

                  <span className="hidden truncate text-sm text-muted-foreground sm:block">
                    {entry.confederation}
                  </span>

                  <span className="text-right text-sm font-bold tabular-nums sm:text-base">
                    {entry.points.toFixed(2)}
                  </span>

                  <span className="hidden text-right text-sm tabular-nums text-muted-foreground sm:block">
                    {entry.prevPoints.toFixed(2)}
                  </span>

                  <span className="flex justify-end sm:justify-center">
                    <MovementBadge movement={entry.movement} />
                  </span>
                </>
              );

              const rowClass =
                "grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3.5 transition-colors hover:bg-white/4 sm:grid-cols-[3.5rem_1fr_6rem_5rem_5rem_4rem] sm:gap-3 sm:px-6";

              if (entry.teamId) {
                return (
                  <li key={entry.idTeam}>
                    <Link href={`/teams/${entry.teamId}`} className={rowClass}>
                      {row}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={entry.idTeam} className={rowClass}>
                  {row}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          breakLabel="…"
          nextLabel="Next"
          previousLabel="Prev"
          onPageChange={({ selected }) => setPage(selected)}
          pageCount={pageCount}
          forcePage={safePage}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          containerClassName="flex flex-wrap items-center justify-center gap-1.5"
          pageClassName=""
          pageLinkClassName={cn(
            "inline-flex min-w-9 items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm font-medium transition-colors",
            "hover:border-emerald-400/40 hover:bg-white/5",
          )}
          activeLinkClassName="!border-emerald-400/50 !bg-emerald-400/15 !text-emerald-200"
          previousLinkClassName="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm font-medium hover:border-emerald-400/40 hover:bg-white/5"
          nextLinkClassName="inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-sm font-medium hover:border-emerald-400/40 hover:bg-white/5"
          breakLinkClassName="inline-flex min-w-9 items-center justify-center px-2 py-2 text-sm text-muted-foreground"
          disabledLinkClassName="pointer-events-none opacity-40"
        />
      )}
    </div>
  );
}
