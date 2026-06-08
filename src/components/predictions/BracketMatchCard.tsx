"use client";

import { Crown } from "lucide-react";

import { getTeamById, TeamFlag } from "@/components/predictions/TeamLabel";
import { cn } from "@/lib/utils";

interface BracketMatchCardProps {
  matchId: string;
  sides: [string, string];
  winner: string | undefined;
  ready: boolean;
  compact?: boolean;
  highlight?: boolean;
  onPick: (teamId: string) => void;
}

export function BracketMatchCard({
  sides,
  winner,
  ready,
  compact = false,
  highlight = false,
  onPick,
}: BracketMatchCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-[#0a1220]/90 shadow-lg backdrop-blur-sm transition-colors",
        highlight && winner
          ? "border-emerald-400/50 ring-1 ring-emerald-400/25"
          : ready
            ? "border-white/15"
            : "border-white/8 opacity-60",
        compact ? "w-[132px]" : "w-[148px] sm:w-[156px]",
      )}
    >
      {sides.map((teamId, i) => {
        const team = teamId ? getTeamById(teamId) : null;
        const isWinner = Boolean(teamId && winner === teamId);
        const isLoser = Boolean(teamId && winner && winner !== teamId);

        return (
          <button
            key={i}
            type="button"
            disabled={!ready || !teamId}
            onClick={() => teamId && onPick(teamId)}
            className={cn(
              "flex w-full items-center gap-1.5 border-b border-white/8 px-2 py-1.5 text-left last:border-b-0 transition-colors",
              isWinner && "bg-emerald-400/20",
              isLoser && "opacity-45",
              ready && teamId && !isWinner && "hover:bg-white/[0.04]",
              !teamId && "cursor-default",
            )}
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                isWinner
                  ? "border-emerald-400 bg-emerald-400"
                  : "border-white/25 bg-transparent",
              )}
            >
              {isWinner && <span className="h-1.5 w-1.5 rounded-full bg-emerald-950" />}
            </span>

            {team ? (
              <>
                <TeamFlag teamId={teamId} />
                <span className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-wide">
                  {team.code.toUpperCase()}
                </span>
                {isWinner && (
                  <Crown className="h-3 w-3 shrink-0 text-emerald-300" aria-hidden />
                )}
              </>
            ) : (
              <span className="text-[10px] font-medium italic text-muted-foreground">TBD</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
