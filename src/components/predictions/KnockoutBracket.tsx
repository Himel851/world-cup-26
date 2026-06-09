"use client";

import { KnockoutBracketTree } from "@/components/predictions/KnockoutBracketTree";
import { KnockoutRoundList } from "@/components/predictions/KnockoutRoundList";
import { BracketMatchCard } from "@/components/predictions/BracketMatchCard";
import { THIRD_PLACE_MATCH_ID } from "@/lib/bracket";
import { getKnockoutMatchMeta } from "@/lib/knockout-meta";
import {
  getMatchSides,
  isKnockoutMatchReady,
  setKnockoutWinner,
} from "@/lib/predictions";
import type { TournamentPrediction } from "@/types/predictions";

interface KnockoutBracketProps {
  prediction: TournamentPrediction;
  onChange: (prediction: TournamentPrediction) => void;
}

export function KnockoutBracket({ prediction, onChange }: KnockoutBracketProps) {
  function pickWinner(matchId: string, teamId: string) {
    onChange(setKnockoutWinner(prediction, matchId, teamId));
  }

  return (
    <div className="space-y-4">
      {/* Mobile: round-by-round list */}
      <div className="lg:hidden">
        <KnockoutRoundList prediction={prediction} onPick={pickWinner} />
      </div>

      {/* Desktop: full bracket tree */}
      <div className="hidden lg:block">
        <KnockoutBracketTree prediction={prediction} onPick={pickWinner} />
        <ThirdPlaceSection prediction={prediction} onPick={pickWinner} />
      </div>
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
    <section className="mt-4 rounded-2xl border border-white/10 bg-sky-600/20 p-4 sm:p-5">
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
