"use client";

import * as React from "react";
import { ChevronRight, Sparkles, Trophy } from "lucide-react";

import { GroupStandingsSection } from "@/components/predictions/GroupStandingsSection";
import { KnockoutBracket } from "@/components/predictions/KnockoutBracket";
import { ThirdPlacePicker } from "@/components/predictions/ThirdPlacePicker";
import { getTeamById } from "@/components/predictions/TeamLabel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  allGroupsComplete,
  completionPercent,
  getChampion,
  isKnockoutComplete,
  isThirdPlaceComplete,
} from "@/lib/predictions";
import { buildOfficialTournamentPrediction } from "@/lib/official-tournament-results";
import { cn } from "@/lib/utils";
import type { PredictionStep, TournamentPrediction } from "@/types/predictions";

const STEPS: { key: PredictionStep; label: string; short: string }[] = [
  { key: "groups", label: "Group Stage", short: "Groups" },
  { key: "third_place", label: "3rd Place", short: "3rd ×8" },
  { key: "knockout", label: "Knockout", short: "KO" },
];

const OFFICIAL_PREDICTION = buildOfficialTournamentPrediction();

function stepUnlocked(step: PredictionStep): boolean {
  if (step === "groups") return true;
  if (step === "third_place") return allGroupsComplete(OFFICIAL_PREDICTION.groups);
  return isThirdPlaceComplete(
    OFFICIAL_PREDICTION.groups,
    OFFICIAL_PREDICTION.thirdPlaceAdvancers,
  );
}

/** Desktop: inline centred CTA. Mobile: fixed bar above the tab bar. */
function StepNextButton({
  show,
  onClick,
  children,
}: {
  show: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  if (!show) return null;

  const button = (
    <Button type="button" className="w-full max-w-xs sm:w-auto" size="sm" onClick={onClick}>
      {children}
    </Button>
  );

  return (
    <>
      <div className="mt-6 hidden justify-center sm:flex">{button}</div>

      <div
        className={cn(
          "fixed inset-x-0 z-30 border-t border-white/10 bg-background/95 px-4 py-3 backdrop-blur-md sm:hidden",
          "bottom-[calc(3.75rem+env(safe-area-inset-bottom))]",
        )}
      >
        <div className="mx-auto flex max-w-lg justify-center">{button}</div>
      </div>

      <div className="h-[4.5rem] sm:hidden" aria-hidden />
    </>
  );
}

export function PredictionsClient() {
  const prediction: TournamentPrediction = OFFICIAL_PREDICTION;
  const [step, setStep] = React.useState<PredictionStep>("knockout");

  const percent = completionPercent(prediction);
  const champion = getChampion(prediction);
  const groupsDone = allGroupsComplete(prediction.groups);
  const thirdsDone = isThirdPlaceComplete(
    prediction.groups,
    prediction.thirdPlaceAdvancers,
  );
  const knockoutDone = isKnockoutComplete(prediction);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          Tournament Results
        </p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Official World Cup 2026 results from the group stage through the final.
          This bracket is locked and cannot be edited.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1 max-w-md">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums font-medium text-foreground">{percent}%</span>
            </div>
            <Progress value={percent} className="h-2" />
          </div>
          {champion && (
            <p className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-300">
              <Trophy className="h-4 w-4" />
              Champion: {getTeamById(champion)?.name}
            </p>
          )}
        </div>
      </header>

      <nav
        aria-label="Tournament stages"
        className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2"
      >
        {STEPS.map((s, i) => {
          const unlocked = stepUnlocked(s.key);
          const active = step === s.key;
          const done =
            s.key === "groups"
              ? groupsDone
              : s.key === "third_place"
                ? thirdsDone
                : knockoutDone;

          return (
            <button
              key={s.key}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && setStep(s.key)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs md:text-sm font-semibold transition-colors sm:flex-none sm:px-5",
                active
                  ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30"
                  : unlocked
                    ? "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    : "cursor-not-allowed opacity-40",
              )}
            >
              <span className="hidden sm:inline">{i + 1}.</span>
              {s.label}
              {done && <span className="text-emerald-400">✓</span>}
            </button>
          );
        })}
      </nav>

      {step === "groups" && (
        <section>
          <GroupStandingsSection groups={prediction.groups} onChange={() => {}} readOnly />
          <StepNextButton show={groupsDone} onClick={() => setStep("third_place")}>
            Next: 3rd place
            <ChevronRight className="h-4 w-4" />
          </StepNextButton>
        </section>
      )}

      {step === "third_place" && (
        <section>
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold">Third-place advancers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The eight third-place teams that reached the Round of 32.
            </p>
          </div>
          <ThirdPlacePicker
            groups={prediction.groups}
            advancers={prediction.thirdPlaceAdvancers}
            onChange={() => {}}
            readOnly
          />
          <StepNextButton show={thirdsDone} onClick={() => setStep("knockout")}>
            Next: Knockout
            <ChevronRight className="h-4 w-4" />
          </StepNextButton>
        </section>
      )}

      {step === "knockout" && (
        <section className="-mx-4 sm:-mx-6 lg:-mx-8">
          <div className="mb-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold">Knockout bracket</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Full knockout path from the Round of 32 through the final — winners
              highlighted in orange.
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <KnockoutBracket prediction={prediction} onChange={() => {}} readOnly />
          </div>
        </section>
      )}
    </div>
  );
}
