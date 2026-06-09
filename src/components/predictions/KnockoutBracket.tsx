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
  THIRD_PLACE_MATCH_ID,
} from "@/lib/bracket";
import { getKnockoutMatchMeta } from "@/lib/knockout-meta";
import {
  getMatchSides,
  isKnockoutMatchReady,
  setKnockoutWinner,
} from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { TournamentPrediction } from "@/types/predictions";

// R32 cards include venue + date header — slot must fit full card height plus gap
const CARD_H = 118;
const SLOT_GAP = 12;
const SLOT_H = CARD_H + SLOT_GAP;
const R32_COUNT = 16;
const TREE_H = R32_COUNT * SLOT_H;
const COL_W = 180;
const GAP_W = 40;

const TREE_ROUNDS = [
  { key: "r32", label: "R32", short: "R32", matchIds: [...R32_TREE_ORDER] },
  { key: "r16", label: "R16", short: "R16", matchIds: [...R16_TREE_ORDER] },
  { key: "qf", label: "QF", short: "QF", matchIds: [...QF_TREE_ORDER] },
  { key: "sf", label: "SF", short: "SF", matchIds: [...SF_TREE_ORDER] },
  { key: "final", label: "FINAL", short: "FINAL", matchIds: [FINAL_MATCH_ID] },
] as const;

type TreeRoundKey = (typeof TREE_ROUNDS)[number]["key"];

function matchCenterY(roundIndex: number, matchIndex: number): number {
  const span = 2 ** roundIndex * SLOT_H;
  return matchIndex * span + span / 2;
}

function matchTop(roundIndex: number, matchIndex: number): number {
  return matchCenterY(roundIndex, matchIndex) - CARD_H / 2;
}

interface KnockoutBracketProps {
  prediction: TournamentPrediction;
  onChange: (prediction: TournamentPrediction) => void;
}

export function KnockoutBracket({ prediction, onChange }: KnockoutBracketProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const columnRefs = React.useRef<Partial<Record<TreeRoundKey, HTMLDivElement>>>({});
  const [activeSection, setActiveSection] = React.useState<TreeRoundKey>("r32");

  const finalWinner = prediction.knockoutWinners[FINAL_MATCH_ID];
  const treeWidth = TREE_ROUNDS.length * COL_W + (TREE_ROUNDS.length - 1) * GAP_W + 32;

  function pickWinner(matchId: string, teamId: string) {
    onChange(setKnockoutWinner(prediction, matchId, teamId));
  }

  function scrollToSection(key: TreeRoundKey) {
    setActiveSection(key);
    const col = columnRefs.current[key];
    const scroller = scrollRef.current;
    if (!col || !scroller) return;

    const left = col.offsetLeft - scroller.offsetLeft - 16;
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }

  return (
    <div className="space-y-4">
      {/* <nav
        aria-label="Knockout rounds"
        className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/3 p-1"
      >
        {TREE_ROUNDS.map((round) => (
          <button
            key={round.key}
            type="button"
            onClick={() => scrollToSection(round.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors",
              activeSection === round.key
                ? "bg-sky-500/25 text-sky-200 ring-1 ring-sky-400/40"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {round.short}
          </button>
        ))}
      </nav> */}

      <div className="overflow-hidden rounded-2xl bg-sky-600 shadow-inner">
        {/* Round header bar — demo-style */}
        <div
          className="flex min-w-max bg-[#0b1a33]"
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

        <div ref={scrollRef} className="overflow-x-auto px-3 py-5 sm:px-4">
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
                  ref={(el) => {
                    columnRefs.current[round.key] = el ?? undefined;
                  }}
                  className="relative shrink-0"
                  style={{ width: COL_W, height: TREE_H }}
                >
                  {round.matchIds.map((matchId, matchIndex) => {
                    const sides = getMatchSides(matchId, prediction);
                    const ready = isKnockoutMatchReady(matchId, prediction);
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
                          onPick={(teamId) => pickWinner(matchId, teamId)}
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
          Scroll horizontally · Tap a team to pick the winner
        </p>
      </div>

      <ThirdPlaceSection prediction={prediction} onPick={pickWinner} />
    </div>
  );
}

function ThirdPlaceSection({
  prediction,
  onPick,
}: {
  prediction: TournamentPrediction;
  onPick: (matchId: string, teamId: string) => void;
}) {
  const matchId = THIRD_PLACE_MATCH_ID;
  const sides = getMatchSides(matchId, prediction);
  const ready = isKnockoutMatchReady(matchId, prediction);
  const winner = prediction.knockoutWinners[matchId];
  const meta = getKnockoutMatchMeta(matchId);

  return (
    <section className="rounded-2xl border border-white/10 bg-sky-600/20 p-4 sm:p-5">
      <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-sky-200">
        Third place play-off
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Losers of the semi-finals
      </p>
      <div className="mt-4 flex justify-center sm:justify-start">
        <BracketMatchCard
          matchId={matchId}
          variant="tree"
          venueName={meta.venueName}
          dateLabel={meta.dateLabel}
          timeLabel={meta.timeLabel}
          sides={sides}
          winner={winner}
          ready={ready}
          onPick={(teamId) => onPick(matchId, teamId)}
        />
      </div>
    </section>
  );
}
