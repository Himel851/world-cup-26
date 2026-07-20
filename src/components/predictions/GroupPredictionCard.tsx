"use client";

import * as React from "react";
import Image from "next/image";
import { BarChart3, GripVertical, RotateCcw, Sparkles } from "lucide-react";

import { getTeamById } from "@/components/predictions/TeamLabel";
import { getTeamsByGroup } from "@/data/teams";
import {
  autoFillGroup,
  isGroupComplete,
  reorderGroupStanding,
  resetGroup,
  setGroupPosition,
} from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { GroupLetter } from "@/types";
import type { GroupPredictions } from "@/types/predictions";

const RANKS = [0, 1, 2, 3] as const;
type RankIndex = (typeof RANKS)[number];

interface GroupPredictionCardProps {
  group: GroupLetter;
  groups: GroupPredictions;
  onChange: (groups: GroupPredictions) => void;
  activePosition: number | null;
  onSelectPosition: (position: RankIndex) => void;
  readOnly?: boolean;
}

export function GroupPredictionCard({
  group,
  groups,
  onChange,
  activePosition,
  onSelectPosition,
  readOnly = false,
}: GroupPredictionCardProps) {
  const standing = groups[group];
  const teams = getTeamsByGroup(group);
  const complete = isGroupComplete(standing);
  const [dragFrom, setDragFrom] = React.useState<RankIndex | null>(null);
  const [dropOver, setDropOver] = React.useState<RankIndex | null>(null);

  function assign(teamId: string) {
    const slot =
      activePosition != null
        ? (activePosition as RankIndex)
        : (standing.findIndex((id) => !id) as RankIndex);
    if (slot < 0) return;
    onChange(setGroupPosition(groups, group, teamId, slot));
  }

  function handleDrop(to: RankIndex) {
    if (dragFrom == null || dragFrom === to) return;
    onChange(reorderGroupStanding(groups, group, dragFrom, to));
    setDragFrom(null);
    setDropOver(null);
  }

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl shadow-lg ring-1 ring-black/20">
      <header className="bg-[#0b1a33] px-3 pb-2.5 pt-3">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h3 className="text-sm font-black uppercase tracking-wide text-white">
            Group {group}
          </h3>
          <BarChart3 className="h-4 w-4 text-white/70" aria-hidden />
        </div>

        <div className="grid grid-cols-4 gap-1">
          {teams.map((team) => {
            const assignedIdx = standing.indexOf(team.id);
            const isAssigned = assignedIdx >= 0;
            return (
              <button
                key={team.id}
                type="button"
                disabled={readOnly || isAssigned}
                onClick={() => assign(team.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-md px-0.5 py-1.5 transition-colors",
                  isAssigned
                    ? "cursor-default opacity-40"
                    : "bg-white/10 hover:bg-white/20",
                )}
                title={isAssigned ? `Placed ${assignedIdx + 1}${ordinal(assignedIdx + 1)}` : team.name}
              >
                <span className="relative h-5 w-7 overflow-hidden rounded-sm ring-1 ring-white/20">
                  <Image src={team.flag} alt="" fill sizes="28px" className="object-cover" />
                </span>
                <span className="text-[9px] font-bold uppercase text-white">
                  {team.fifaCode}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="min-h-[9.5rem] bg-white">
        {RANKS.map((idx) => {
          const teamId = standing[idx];
          const team = teamId ? getTeamById(teamId) : null;
          const isActive = activePosition === idx;
          const isDragging = dragFrom === idx;
          const isDropTarget = dropOver === idx && dragFrom != null && dragFrom !== idx;

          return (
            <div
              key={idx}
              draggable={!readOnly && Boolean(team)}
              onDragStart={(e) => {
                if (!team) return;
                setDragFrom(idx);
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(idx));
              }}
              onDragEnd={() => {
                setDragFrom(null);
                setDropOver(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragFrom != null) setDropOver(idx);
              }}
              onDragLeave={() => setDropOver((prev) => (prev === idx ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(idx);
              }}
              onClick={() => {
                if (!readOnly && !team) onSelectPosition(idx);
              }}
              onKeyDown={(e) => {
                if (!readOnly && !team && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelectPosition(idx);
                }
              }}
              role={!readOnly && !team ? "button" : undefined}
              tabIndex={!readOnly && !team ? 0 : undefined}
              className={cn(
                "flex w-full items-center gap-2 border-b border-slate-200 px-2.5 py-2 text-left transition-colors last:border-b-0",
                team && !readOnly && "cursor-grab active:cursor-grabbing",
                readOnly && team && "cursor-default",
                isDragging && "opacity-40",
                isActive && !team && "bg-sky-100 ring-2 ring-inset ring-sky-500",
                isDropTarget && "bg-emerald-50 ring-2 ring-inset ring-emerald-400",
                !isActive && !isDropTarget && !isDragging && (team ? "hover:bg-slate-50" : "hover:bg-slate-50"),
              )}
            >
              <span className="w-4 shrink-0 text-sm font-black text-slate-800">
                {team ? idx + 1 : "–"}
              </span>

              {team ? (
                <>
                  <span className="relative h-4 w-6 shrink-0 overflow-hidden rounded-sm ring-1 ring-slate-200">
                    <Image
                      src={team.flag}
                      alt=""
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11px] font-black uppercase tracking-tight text-slate-900">
                    {team.name}
                  </span>
                  {!readOnly && (
                    <GripVertical
                      className="h-4 w-4 shrink-0 text-slate-400"
                      aria-hidden
                    />
                  )}
                </>
              ) : (
                <span className="text-sm font-bold text-slate-300">–</span>
              )}
            </div>
          );
        })}
      </div>

      {!readOnly && (
        <footer className="flex items-center justify-center gap-2 bg-[#0b1a33] py-2.5">
          <button
            type="button"
            onClick={() => onChange(resetGroup(groups, group))}
            className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-800 shadow-md transition-transform hover:scale-105"
            aria-label={`Reset group ${group}`}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          {!complete && (
            <button
              type="button"
              onClick={() => onChange(autoFillGroup(groups, group))}
              className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-white shadow-md transition-transform hover:scale-105"
              aria-label={`Auto-fill group ${group}`}
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
        </footer>
      )}
    </article>
  );
}

function ordinal(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}
