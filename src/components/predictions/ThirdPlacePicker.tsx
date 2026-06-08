"use client";

import { Trophy } from "lucide-react";

import { TeamFlag, getTeamById } from "@/components/predictions/TeamLabel";
import { GROUPS } from "@/data/teams";
import { getThirdPlaceCandidates, toggleThirdPlaceAdvancer } from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { GroupPredictions } from "@/types/predictions";

interface ThirdPlacePickerProps {
  groups: GroupPredictions;
  advancers: string[];
  onChange: (advancers: string[]) => void;
}

export function ThirdPlacePicker({ groups, advancers, onChange }: ThirdPlacePickerProps) {
  const candidates = getThirdPlaceCandidates(groups);
  const selected = advancers.length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              <Trophy className="h-3.5 w-3.5" />
              Best third-place teams
            </p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Pick exactly 8 of the 12 third-place teams to join the Round of 32.
              Complete all group standings first — each group&apos;s 3rd-place team
              appears below.
            </p>
          </div>
          <div
            className={cn(
              "rounded-xl px-4 py-2 text-center ring-1",
              selected === 8
                ? "bg-emerald-400/10 ring-emerald-400/30 text-emerald-300"
                : "bg-white/[0.03] ring-white/10 text-foreground",
            )}
          >
            <p className="text-2xl font-bold tabular-nums">{selected}/8</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Selected
            </p>
          </div>
        </div>
      </div>

      {candidates.length < 12 ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-muted-foreground">
          Finish ranking all 12 groups to unlock third-place selection.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((group) => {
            const teamId = groups[group][2];
            if (!teamId) return null;
            const team = getTeamById(teamId);
            if (!team) return null;

            const isSelected = advancers.includes(teamId);
            const isFull = advancers.length >= 8 && !isSelected;

            return (
              <button
                key={group}
                type="button"
                disabled={isFull}
                onClick={() => onChange(toggleThirdPlaceAdvancer(advancers, teamId))}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-emerald-400/40 bg-emerald-400/10 ring-1 ring-emerald-400/20"
                    : isFull
                      ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50"
                      : "border-white/10 bg-white/[0.03] hover:border-amber-400/30 hover:bg-amber-400/[0.04]",
                )}
              >
                <TeamFlag teamId={teamId} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{team.name}</p>
                  <p className="text-xs text-muted-foreground">Group {group} · 3rd place</p>
                </div>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                    isSelected
                      ? "border-emerald-400 bg-emerald-400 text-emerald-950"
                      : "border-white/20 text-muted-foreground",
                  )}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
