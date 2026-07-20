"use client";

import * as React from "react";
import { Trophy } from "lucide-react";

import { BracketMatchCard } from "@/components/predictions/BracketMatchCard";
import { getTeamById } from "@/components/predictions/TeamLabel";
import {
  FINAL_MATCH_ID,
  getBracketMatch,
  QF_TREE_ORDER,
  R16_TREE_ORDER,
  R32_MATCH_IDS,
  SF_TREE_ORDER,
  THIRD_PLACE_MATCH_ID,
} from "@/lib/bracket";
import { getKnockoutMatchMeta } from "@/lib/knockout-meta";
import {
  getMatchSides,
  isKnockoutMatchReady,
} from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { TournamentPrediction } from "@/types/predictions";

type MobileRoundKey = "r32" | "r16" | "qf" | "sf" | "final";

const MOBILE_ROUNDS: {
  key: MobileRoundKey;
  label: string;
  matchIds: readonly string[];
}[] = [
  { key: "r32", label: "R32", matchIds: R32_MATCH_IDS },
  { key: "r16", label: "R16", matchIds: R16_TREE_ORDER },
  { key: "qf", label: "QF", matchIds: QF_TREE_ORDER },
  { key: "sf", label: "SF", matchIds: SF_TREE_ORDER },
  {
    key: "final",
    label: "Final",
    matchIds: [THIRD_PLACE_MATCH_ID, FINAL_MATCH_ID],
  },
];

function roundProgress(
  matchIds: readonly string[],
  prediction: TournamentPrediction,
): { done: number; total: number } {
  let done = 0;
  for (const id of matchIds) {
    if (
      isKnockoutMatchReady(id, prediction) &&
      prediction.knockoutWinners[id]
    ) {
      done += 1;
    }
  }
  return { done, total: matchIds.length };
}

function isRoundComplete(
  matchIds: readonly string[],
  prediction: TournamentPrediction,
): boolean {
  const { done, total } = roundProgress(matchIds, prediction);
  return done === total && total > 0;
}

interface KnockoutRoundListProps {
  prediction: TournamentPrediction;
  onPick: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
  resolveSides?: (matchId: string) => [string, string];
  resolveReady?: (matchId: string) => boolean;
}

export function KnockoutRoundList({
  prediction,
  onPick,
  readOnly = false,
  resolveSides,
  resolveReady,
}: KnockoutRoundListProps) {
  const [activeRound, setActiveRound] = React.useState<MobileRoundKey>("r32");
  const lastAutoRound = React.useRef<MobileRoundKey | null>(null);

  const current = MOBILE_ROUNDS.find((r) => r.key === activeRound)!;
  const champion = prediction.knockoutWinners[FINAL_MATCH_ID];

  React.useEffect(() => {
    if (!isRoundComplete(current.matchIds, prediction)) return;
    if (lastAutoRound.current === activeRound) return;

    const idx = MOBILE_ROUNDS.findIndex((r) => r.key === activeRound);
    if (idx < 0 || idx >= MOBILE_ROUNDS.length - 1) return;

    lastAutoRound.current = activeRound;
    setActiveRound(MOBILE_ROUNDS[idx + 1]!.key);
  }, [prediction.knockoutWinners, activeRound]);

  return (
    <div className="space-y-4">
      {champion && (
        <p className="flex items-center justify-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-3 py-2 text-sm font-semibold text-orange-200">
          <Trophy className="h-4 w-4" />
          {getTeamById(champion)?.name}
        </p>
      )}

      <nav
        aria-label="Knockout rounds"
        className="flex gap-1 overflow-x-auto rounded-xl border border-white/20 bg-sky-950/40 p-1 backdrop-blur-sm scrollbar-none [-ms-overflow-style:none]"
      >
        {MOBILE_ROUNDS.map((round) => {
          const { done, total } = roundProgress(round.matchIds, prediction);
          const complete = done === total;

          return (
            <button
              key={round.key}
              type="button"
              onClick={() => setActiveRound(round.key)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
                activeRound === round.key
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              {round.label}
              {complete && (
                <span className="ml-1 text-emerald-300" aria-hidden>
                  ✓
                </span>
              )}
              {!complete && (
                <span className="ml-1 text-[10px] font-medium text-white/50">
                  {done}/{total}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="overflow-hidden rounded-2xl bg-sky-600 shadow-inner">
        <div className="border-b border-white/15 bg-sky-950/50 px-4 py-2.5 text-center backdrop-blur-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
            {current.label}
          </p>
          <p className="mt-0.5 text-[10px] text-sky-200/80">
            {roundProgress(current.matchIds, prediction).done} of{" "}
            {current.matchIds.length} picked
          </p>
        </div>

        <ul className="divide-y divide-white/10 p-3">
          {current.matchIds.map((matchId) => {
            const sides = resolveSides
              ? resolveSides(matchId)
              : getMatchSides(matchId, prediction);
            const ready = resolveReady
              ? resolveReady(matchId)
              : isKnockoutMatchReady(matchId, prediction);
            const winner = prediction.knockoutWinners[matchId];
            const meta = getKnockoutMatchMeta(matchId);
            const bracketLabel = getBracketMatch(matchId)?.label;

            return (
              <li key={matchId} className="py-3 first:pt-1 last:pb-1">
                {bracketLabel && (
                  <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-sky-100/90">
                    {bracketLabel}
                  </p>
                )}
                <div className="flex justify-center">
                  <BracketMatchCard
                    matchId={matchId}
                    variant="tree"
                    fullWidth
                    venueName={meta.venueName}
                    dateLabel={meta.dateLabel}
                    timeLabel={meta.timeLabel}
                    sides={sides}
                    winner={winner}
                    ready={ready}
                    highlight={matchId === FINAL_MATCH_ID}
                    readOnly={readOnly}
                    onPick={(teamId) => onPick(matchId, teamId)}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <p className="border-t border-sky-700/50 px-4 py-3 text-center text-[11px] text-white/80">
          {readOnly ? "Official match results — locked" : "Tap a team to pick the winner"}
        </p>
      </div>
    </div>
  );
}
