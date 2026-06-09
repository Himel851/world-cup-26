"use client";

import { getTeamById, TeamFlag } from "@/components/predictions/TeamLabel";
import { cn } from "@/lib/utils";

interface BracketMatchCardProps {
  matchId: string;
  label?: string;
  venueName?: string;
  dateLabel?: string;
  timeLabel?: string;
  sides: [string, string];
  winner: string | undefined;
  ready: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  highlight?: boolean;
  variant?: "tree" | "plain";
  onPick: (teamId: string) => void;
}

export function BracketMatchCard({
  venueName,
  dateLabel,
  timeLabel,
  sides,
  winner,
  ready,
  compact = false,
  fullWidth = false,
  highlight = false,
  variant = "tree",
  onPick,
}: BracketMatchCardProps) {
  const isTree = variant === "tree";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl shadow-lg transition-opacity",
        isTree
          ? "bg-white ring-1 ring-sky-900/15"
          : "border border-white/15 bg-[#0a1220]/90 backdrop-blur-sm",
        highlight && winner && "ring-2 ring-orange-400",
        !ready && isTree && "opacity-75",
        fullWidth
          ? "w-full max-w-md"
          : compact
            ? "w-[148px]"
            : "w-[172px] sm:w-[180px]",
        isTree && !fullWidth && "min-h-[118px]",
      )}
    >
      {isTree && (venueName || dateLabel || timeLabel) && (
        <div className="shrink-0 border-b border-sky-800/50 bg-sky-900 px-2.5 py-1.5 text-center">
          <p className="truncate text-[10px] font-bold leading-tight text-white">
            {venueName ?? "Venue TBD"}
          </p>
          {timeLabel && (
            <p className="mt-0.5 truncate text-[9px] font-bold text-sky-200">
              {timeLabel}
            </p>
          )}
          <p className="mt-0.5 truncate text-[9px] font-semibold text-orange-300">
            {dateLabel ?? "Date TBD"}
          </p>
        </div>
      )}

      {sides.map((teamId, i) => {
        const team = teamId ? getTeamById(teamId) : null;
        const isWinner = Boolean(teamId && winner === teamId);
        const isPicked = Boolean(winner);

        return (
          <button
            key={i}
            type="button"
            disabled={!ready || !teamId}
            onClick={() => teamId && onPick(teamId)}
            className={cn(
              "flex h-[34px] w-full items-center gap-2 border-b border-slate-200 px-2.5 text-left last:border-b-0 transition-colors cursor-pointer",
              isTree
                ? isWinner
                  ? "bg-orange-500 text-slate-900"
                  : "bg-white text-slate-900"
                : cn(
                    isWinner && "bg-emerald-400/20",
                    isPicked && !isWinner && teamId && "opacity-50",
                    ready && teamId && !isWinner && "hover:bg-white/5",
                  ),
              !teamId && "cursor-default bg-sky-50 text-slate-500",
            )}
          >
            {team ? (
              <>
                <TeamFlag teamId={teamId} className="ring-slate-300" />
                <span className="min-w-0 flex-1 truncate text-[11px] font-black uppercase tracking-wide">
                  {team.fifaCode}
                </span>
              </>
            ) : (
              <span className="flex-1 text-[10px] font-semibold italic text-slate-400">TBD</span>
            )}

            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                isTree
                  ? isWinner
                    ? "border-slate-900 bg-slate-900"
                    : "border-slate-400 bg-transparent"
                  : isWinner
                    ? "border-emerald-400 bg-emerald-400"
                    : "border-white/30 bg-transparent",
              )}
              aria-hidden
            >
              {isWinner && (
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isTree ? "bg-white" : "bg-emerald-950",
                  )}
                />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
