"use client";

import * as React from "react";
import { Trophy } from "lucide-react";

import { BracketMatchCard } from "@/components/predictions/BracketMatchCard";
import { getTeamById } from "@/components/predictions/TeamLabel";
import {
  FINAL_MATCH_ID,
  QF_TREE_ORDER,
  R16_TREE_ORDER,
  R32_TREE_ORDER,
  SF_TREE_ORDER,
} from "@/lib/bracket";
import { getKnockoutMatchMeta } from "@/lib/knockout-meta";
import { getMatchSides, isKnockoutMatchReady } from "@/lib/predictions";
import type { TournamentPrediction } from "@/types/predictions";

const CARD_H = 118;
const SLOT_GAP = 12;
const SLOT_H = CARD_H + SLOT_GAP;
const R32_COUNT = 16;
const TREE_H = R32_COUNT * SLOT_H;
const COL_W = 180;
const GAP_W = 40;

const TREE_ROUNDS = [
  { key: "r32", label: "R32", matchIds: [...R32_TREE_ORDER] },
  { key: "r16", label: "R16", matchIds: [...R16_TREE_ORDER] },
  { key: "qf", label: "QF", matchIds: [...QF_TREE_ORDER] },
  { key: "sf", label: "SF", matchIds: [...SF_TREE_ORDER] },
  { key: "final", label: "FINAL", matchIds: [FINAL_MATCH_ID] },
] as const;

function matchCenterY(roundIndex: number, matchIndex: number): number {
  const span = 2 ** roundIndex * SLOT_H;
  return matchIndex * span + span / 2;
}

function matchTop(roundIndex: number, matchIndex: number): number {
  return matchCenterY(roundIndex, matchIndex) - CARD_H / 2;
}

interface KnockoutBracketTreeProps {
  prediction: TournamentPrediction;
  onPick: (matchId: string, teamId: string) => void;
  readOnly?: boolean;
  resolveSides?: (matchId: string) => [string, string];
  resolveReady?: (matchId: string) => boolean;
}

export function KnockoutBracketTree({
  prediction,
  onPick,
  readOnly = false,
  resolveSides,
  resolveReady,
}: KnockoutBracketTreeProps) {
  const finalWinner = prediction.knockoutWinners[FINAL_MATCH_ID];
  const treeWidth = TREE_ROUNDS.length * COL_W + (TREE_ROUNDS.length - 1) * GAP_W + 32;

  return (
    <div className="overflow-hidden rounded-2xl bg-sky-600 shadow-inner">
      <div
        className="flex min-w-max border-b border-white/15 bg-sky-950/50 backdrop-blur-sm"
        style={{ minWidth: treeWidth }}
      >
        {TREE_ROUNDS.map((round, i) => (
          <div
            key={round.key}
            className="flex shrink-0 items-center justify-center py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white"
            style={{ width: COL_W + (i < TREE_ROUNDS.length - 1 ? GAP_W : 0) }}
          >
            <span style={{ width: COL_W }} className="text-center">
              {round.label}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto px-3 py-5 sm:px-4">
        <div
          className="relative mx-auto flex min-w-max items-start"
          style={{ height: TREE_H, minWidth: treeWidth }}
        >
          {TREE_ROUNDS.map((round, roundIndex) => (
            <React.Fragment key={round.key}>
              {roundIndex < TREE_ROUNDS.length - 1 && (
                <svg
                  aria-hidden
                  className="pointer-events-none shrink-0"
                  width={GAP_W}
                  height={TREE_H}
                >
                  {round.matchIds.map((_, i) => {
                    if (i % 2 === 1) return null;
                    const pairIndex = i / 2;
                    const yA = matchCenterY(roundIndex, i);
                    const yB = matchCenterY(roundIndex, i + 1);
                    const yOut = matchCenterY(roundIndex + 1, pairIndex);
                    const midX = GAP_W / 2;

                    return (
                      <g key={pairIndex} stroke="white" strokeWidth="2" fill="none" opacity="0.85">
                        <path d={`M 0 ${yA} H ${midX} V ${yOut}`} />
                        <path d={`M 0 ${yB} H ${midX} V ${yOut}`} />
                        <path d={`M ${midX} ${yOut} H ${GAP_W}`} />
                      </g>
                    );
                  })}
                </svg>
              )}

              <div
                className="relative shrink-0"
                style={{ width: COL_W, height: TREE_H }}
              >
                {round.matchIds.map((matchId, matchIndex) => {
                  const sides = resolveSides
                    ? resolveSides(matchId)
                    : getMatchSides(matchId, prediction);
                  const ready = resolveReady
                    ? resolveReady(matchId)
                    : isKnockoutMatchReady(matchId, prediction);
                  const winner = prediction.knockoutWinners[matchId];
                  const isFinal = matchId === FINAL_MATCH_ID;
                  const meta = getKnockoutMatchMeta(matchId);

                  return (
                    <div
                      key={matchId}
                      className="absolute left-0 right-0 flex justify-center"
                      style={{ top: matchTop(roundIndex, matchIndex) }}
                    >
                      <BracketMatchCard
                        matchId={matchId}
                        variant="tree"
                        venueName={meta.venueName}
                        dateLabel={meta.dateLabel}
                        timeLabel={meta.timeLabel}
                        sides={sides}
                        winner={winner}
                        ready={ready}
                        highlight={isFinal}
                        readOnly={readOnly}
                        onPick={(teamId) => onPick(matchId, teamId)}
                      />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}

          {finalWinner && (
            <div
              className="absolute flex items-center gap-2 rounded-xl border border-orange-400/40 bg-orange-500/20 px-3 py-2"
              style={{
                left: TREE_ROUNDS.length * (COL_W + GAP_W) - GAP_W + 8,
                top: matchCenterY(4, 0) - 20,
              }}
            >
              <Trophy className="h-4 w-4 text-orange-300" />
              <span className="text-xs font-bold text-white">
                {getTeamById(finalWinner)?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="border-t border-sky-700/50 px-4 py-3 text-center text-[11px] text-white/80">
        {readOnly
          ? "Scroll horizontally · Official match results — locked"
          : "Scroll horizontally · Tap a team to pick the winner"}
      </p>
    </div>
  );
}
