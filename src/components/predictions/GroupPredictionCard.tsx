"use client";

import { Check } from "lucide-react";

import { TeamFlag, TeamLabel } from "@/components/predictions/TeamLabel";
import { getTeamsByGroup } from "@/data/teams";
import {
  clearGroupPosition,
  isGroupComplete,
  setGroupPosition,
} from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { GroupLetter } from "@/types";
import type { GroupPredictions } from "@/types/predictions";

const POSITIONS = [
  { idx: 0 as const, label: "1st", color: "text-emerald-300" },
  { idx: 1 as const, label: "2nd", color: "text-cyan-300" },
  { idx: 2 as const, label: "3rd", color: "text-amber-300" },
  { idx: 3 as const, label: "4th", color: "text-muted-foreground" },
];

interface GroupPredictionCardProps {
  group: GroupLetter;
  groups: GroupPredictions;
  onChange: (groups: GroupPredictions) => void;
}

export function GroupPredictionCard({ group, groups, onChange }: GroupPredictionCardProps) {
  const standing = groups[group];
  const teams = getTeamsByGroup(group);
  const complete = isGroupComplete(standing);

  function assign(teamId: string, position: 0 | 1 | 2 | 3) {
    onChange(setGroupPosition(groups, group, teamId, position));
  }

  function clear(position: 0 | 1 | 2 | 3) {
    onChange(clearGroupPosition(groups, group, position));
  }

  return (
    <article
      className={cn(
        "rounded-2xl border p-4 transition-colors",
        complete
          ? "border-emerald-400/30 bg-emerald-400/[0.04]"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
          Group {group}
        </h3>
        {complete && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
            <Check className="h-3 w-3" />
            Done
          </span>
        )}
      </div>

      <div className="space-y-2">
        {POSITIONS.map(({ idx, label, color }) => {
          const teamId = standing[idx];
          return (
            <div
              key={label}
              className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/20 px-2.5 py-2"
            >
              <span className={cn("w-8 shrink-0 text-[10px] font-bold uppercase", color)}>
                {label}
              </span>
              {teamId ? (
                <button
                  type="button"
                  onClick={() => clear(idx)}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-lg py-0.5 text-left transition-colors hover:text-emerald-200"
                  title="Click to clear"
                >
                  <TeamLabel teamId={teamId} />
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">Pick a team →</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {teams.map((team) => {
          const assignedIdx = standing.indexOf(team.id);
          const isAssigned = assignedIdx >= 0;
          return (
            <button
              key={team.id}
              type="button"
              disabled={isAssigned}
              onClick={() => {
                const nextSlot = standing.findIndex((id) => !id) as 0 | 1 | 2 | 3;
                if (nextSlot >= 0) assign(team.id, nextSlot);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                isAssigned
                  ? "cursor-default border-white/5 bg-white/[0.02] text-muted-foreground opacity-60"
                  : "border-white/10 bg-white/[0.04] hover:border-emerald-400/40 hover:bg-emerald-400/10",
              )}
            >
              <TeamFlag teamId={team.id} />
              <span className="max-w-[5.5rem] truncate sm:max-w-none">{team.name}</span>
              {isAssigned && (
                <span className="text-[10px] text-emerald-300/80">
                  {POSITIONS[assignedIdx]?.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </article>
  );
}
