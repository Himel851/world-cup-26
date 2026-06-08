"use client";

import * as React from "react";
import { Trophy } from "lucide-react";

import { BracketMatchCard } from "@/components/predictions/BracketMatchCard";
import { getTeamById } from "@/components/predictions/TeamLabel";
import {
  FINAL_MATCH_ID,
  QF_MATCH_IDS,
  R16_MATCH_IDS,
  R32_MATCH_IDS,
  SF_MATCH_IDS,
  THIRD_PLACE_MATCH_ID,
} from "@/lib/bracket";
import {
  getMatchSides,
  isKnockoutMatchReady,
  setKnockoutWinner,
} from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { TournamentPrediction } from "@/types/predictions";

/** Vertical slot size for one R32 row in the tree. */
const SLOT_H = 52;
const R32_COUNT = 16;
const TREE_H = R32_COUNT * SLOT_H;
const CARD_H = 58;
const COL_W = 156;
const GAP_W = 36;

const TREE_ROUNDS = [
  { key: "r32", label: "R32", short: "R32", matchIds: [...R32_MATCH_IDS] },
  { key: "r16", label: "R16", short: "R16", matchIds: [...R16_MATCH_IDS] },
  { key: "qf", label: "QF", short: "QF", matchIds: [...QF_MATCH_IDS] },
  { key: "sf", label: "SF", short: "SF", matchIds: [...SF_MATCH_IDS] },
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

  function pickWinner(matchId: string, teamId: string) {
    onChange(setKnockoutWinner(prediction, matchId, teamId));
  }

  function scrollToSection(key: TreeRoundKey) {
    setActiveSection(key);
    const col = columnRefs.current[key];
    const scroller = scrollRef.current;
    if (!col || !scroller) return;

    const left = col.offsetLeft - scroller.offsetLeft - 24;
    scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }

  return (
    <div className="space-y-4">
      {/* Section tabs — like FIFA bracket navigator */}
      <nav
        aria-label="Knockout rounds"
        className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
      >
        {TREE_ROUNDS.map((round) => (
          <button
            key={round.key}
            type="button"
            onClick={() => scrollToSection(round.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors",
              activeSection === round.key
                ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/30"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            {round.short}
          </button>
        ))}
      </nav>

      {/* Horizontal bracket tree */}
      <div
        ref={scrollRef}
        className="overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-br from-[#071018] via-[#0a1424] to-[#0c1830] p-4 sm:p-6"
      >
        <div
          className="relative mx-auto flex min-w-max items-start"
          style={{ height: TREE_H, minWidth: TREE_ROUNDS.length * (COL_W + GAP_W) + 40 }}
        >
          {TREE_ROUNDS.map((round, roundIndex) => (
            <React.Fragment key={round.key}>
              {/* Connector SVG to next round */}
              {roundIndex < TREE_ROUNDS.length - 1 && (
                <svg
                  aria-hidden
                  className="pointer-events-none shrink-0"
                  width={GAP_W}
                  height={TREE_H}
                  style={{ marginTop: 0 }}
                >
                  {round.matchIds.map((_, i) => {
                    if (i % 2 === 1) return null;
                    const pairIndex = i / 2;
                    const yA = matchCenterY(roundIndex, i);
                    const yB = matchCenterY(roundIndex, i + 1);
                    const yOut = matchCenterY(roundIndex + 1, pairIndex);
                    const midX = GAP_W / 2;

                    return (
                      <g key={pairIndex} stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none">
                        <path d={`M 0 ${yA} H ${midX} V ${yOut}`} />
                        <path d={`M 0 ${yB} H ${midX} V ${yOut}`} />
                        <path d={`M ${midX} ${yOut} H ${GAP_W}`} />
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Round column */}
              <div
                ref={(el) => {
                  columnRefs.current[round.key] = el ?? undefined;
                }}
                className="relative shrink-0"
                style={{ width: COL_W, height: TREE_H }}
              >
                <p className="absolute -top-1 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/80">
                  {round.label}
                </p>

                {round.matchIds.map((matchId, matchIndex) => {
                  const sides = getMatchSides(matchId, prediction);
                  const ready = isKnockoutMatchReady(matchId, prediction);
                  const winner = prediction.knockoutWinners[matchId];
                  const isFinal = matchId === FINAL_MATCH_ID;

                  return (
                    <div
                      key={matchId}
                      className="absolute left-0 right-0 flex justify-center"
                      style={{ top: matchTop(roundIndex, matchIndex) }}
                    >
                      <BracketMatchCard
                        matchId={matchId}
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

          {/* Final trophy badge */}
          {finalWinner && (
            <div
              className="absolute flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2"
              style={{
                left: TREE_ROUNDS.length * (COL_W + GAP_W) - GAP_W + 8,
                top: matchCenterY(4, 0) - 20,
              }}
            >
              <Trophy className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-300">
                {getTeamById(finalWinner)?.name}
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Scroll horizontally · Tap a team to pick the winner · Lines show how the bracket flows
        </p>
      </div>

      {/* Third-place play-off — separate from main tree */}
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

  return (
    <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.03] p-4 sm:p-5">
      <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-amber-300">
        Third place play-off
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Losers of the semi-finals · Pick after both semi-finals are decided
      </p>
      <div className="mt-4 flex justify-center sm:justify-start">
        <BracketMatchCard
          matchId={matchId}
          sides={sides}
          winner={winner}
          ready={ready}
          compact={false}
          onPick={(teamId) => onPick(matchId, teamId)}
        />
      </div>
    </section>
  );
}
