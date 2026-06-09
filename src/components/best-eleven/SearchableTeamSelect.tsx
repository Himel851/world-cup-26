"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ChevronDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Team } from "@/types";

export const ALL_NATIONS_ID = "all";

interface SearchableTeamSelectProps {
  teams: Team[];
  value: string;
  onChange: (teamId: string) => void;
}

export function SearchableTeamSelect({ teams, value, onChange }: SearchableTeamSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement>(null);

  const selected =
    value === ALL_NATIONS_ID
      ? { id: ALL_NATIONS_ID, name: "All nations", group: "48 teams" as const, flag: null }
      : teams.find((t) => t.id === value);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = teams.filter((t) => {
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.fifaCode.toLowerCase().includes(q) ||
        t.group.toLowerCase().includes(q) ||
        `group ${t.group.toLowerCase()}`.includes(q)
      );
    });
    if (!q || "all nations".includes(q) || "all".includes(q) || "48".includes(q)) {
      return list;
    }
    return list;
  }, [teams, query]);

  const showAllOption = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      "all nations".includes(q) ||
      "all".includes(q) ||
      "48 teams".includes(q) ||
      "world".includes(q)
    );
  }, [query]);

  React.useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function pick(teamId: string) {
    onChange(teamId);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-left text-sm transition-colors",
          open && "border-emerald-400/40 ring-2 ring-emerald-400/20",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        
        <span className="min-w-0 flex-1 truncate">
          {value === ALL_NATIONS_ID
            ? "All nations · 48 teams"
            : `${selected?.name ?? "Select team"} · Group ${selected?.group ?? ""}`}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-background shadow-xl ring-1 ring-black/20">
          <div className="border-b border-white/10 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search team, FIFA code, group…"
                className="h-10 pl-9"
                autoFocus
                aria-label="Search teams"
              />
            </div>
          </div>

          <ul className="max-h-64 overflow-y-auto p-1" role="listbox">
            {showAllOption && (
              <li>
                <button
                  type="button"
                  onClick={() => pick(ALL_NATIONS_ID)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                    value === ALL_NATIONS_ID && "bg-emerald-400/10 text-emerald-200",
                  )}
                >
                  <span className="grid h-6 w-8 shrink-0 place-items-center rounded-sm bg-emerald-400/15 text-[10px] font-bold text-emerald-300">
                    48
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">All nations</span>
                  <span className="text-xs text-muted-foreground">48 teams</span>
                  {value === ALL_NATIONS_ID && <Check className="h-4 w-4 shrink-0 text-emerald-300" />}
                </button>
              </li>
            )}

            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">No teams found.</li>
            ) : (
              filtered.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => pick(t.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                      value === t.id && "bg-emerald-400/10 text-emerald-200",
                    )}
                  >
                    <span className="relative h-6 w-8 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/15">
                      <Image src={t.flag} alt="" fill sizes="32px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground">Group {t.group}</span>
                    {value === t.id && <Check className="h-4 w-4 shrink-0 text-emerald-300" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
