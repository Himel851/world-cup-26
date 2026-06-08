"use client";

import * as React from "react";
import { ChevronRight, RotateCcw, Sparkles, Trophy } from "lucide-react";

import { GroupPredictionCard } from "@/components/predictions/GroupPredictionCard";
import { KnockoutBracket } from "@/components/predictions/KnockoutBracket";
import { ThirdPlacePicker } from "@/components/predictions/ThirdPlacePicker";
import { getTeamById } from "@/components/predictions/TeamLabel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GROUPS } from "@/data/teams";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  allGroupsComplete,
  completionPercent,
  createEmptyPredictions,
  getChampion,
  isKnockoutComplete,
  isThirdPlaceComplete,
  PREDICTIONS_STORAGE_KEY,
  pruneKnockoutWinners,
} from "@/lib/predictions";
import { cn } from "@/lib/utils";
import type { PredictionStep, TournamentPrediction } from "@/types/predictions";

const STEPS: { key: PredictionStep; label: string; short: string }[] = [
  { key: "groups", label: "Group Stage", short: "Groups" },
  { key: "third_place", label: "3rd Place", short: "3rd ×8" },
  { key: "knockout", label: "Knockout", short: "KO" },
];

function stepUnlocked(step: PredictionStep, prediction: TournamentPrediction): boolean {
  if (step === "groups") return true;
  if (step === "third_place") return allGroupsComplete(prediction.groups);
  return isThirdPlaceComplete(prediction.groups, prediction.thirdPlaceAdvancers);
}

export function PredictionsClient() {
  const [prediction, setPrediction, ready] = useLocalStorage<TournamentPrediction>(
    PREDICTIONS_STORAGE_KEY,
    createEmptyPredictions(),
  );
  const [step, setStep] = React.useState<PredictionStep>("groups");

  const percent = completionPercent(prediction);
  const champion = getChampion(prediction);
  const groupsDone = allGroupsComplete(prediction.groups);
  const thirdsDone = isThirdPlaceComplete(
    prediction.groups,
    prediction.thirdPlaceAdvancers,
  );
  const knockoutDone = isKnockoutComplete(prediction);

  function updateGroups(groups: TournamentPrediction["groups"]) {
    setPrediction((prev) => {
      const next = {
        ...prev,
        groups,
        thirdPlaceAdvancers: prev.thirdPlaceAdvancers.filter((id) =>
          GROUPS.some((g) => groups[g][2] === id),
        ),
      };
      return { ...next, knockoutWinners: pruneKnockoutWinners(next) };
    });
  }

  function updateThirdPlace(advancers: string[]) {
    setPrediction((prev) => {
      const next = { ...prev, thirdPlaceAdvancers: advancers };
      return { ...next, knockoutWinners: pruneKnockoutWinners(next) };
    });
  }

  function resetAll() {
    if (window.confirm("Clear your entire bracket prediction?")) {
      setPrediction(createEmptyPredictions());
      setStep("groups");
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground">
        Loading your bracket…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          Bracket Predictor
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Your World Cup 2026 Prediction
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Rank every group, pick 8 third-place advancers, then predict every knockout
          round through the final. Saved automatically in your browser.
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
              {getTeamById(champion)?.name}
            </p>
          )}
          <Button type="button" variant="outline" size="sm" onClick={resetAll}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </header>

      <nav
        aria-label="Prediction steps"
        className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2"
      >
        {STEPS.map((s, i) => {
          const unlocked = stepUnlocked(s.key, prediction);
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
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5",
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
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Group standings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap teams in order — 1st, 2nd, 3rd, 4th for each group.
              </p>
            </div>
            {groupsDone && (
              <Button type="button" size="sm" onClick={() => setStep("third_place")}>
                Next: 3rd place
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {GROUPS.map((group) => (
              <GroupPredictionCard
                key={group}
                group={group}
                groups={prediction.groups}
                onChange={updateGroups}
              />
            ))}
          </div>
        </section>
      )}

      {step === "third_place" && (
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Third-place advancers</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select 8 teams to complete the Round of 32 field.
              </p>
            </div>
            {thirdsDone && (
              <Button type="button" size="sm" onClick={() => setStep("knockout")}>
                Next: Knockout
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ThirdPlacePicker
            groups={prediction.groups}
            advancers={prediction.thirdPlaceAdvancers}
            onChange={updateThirdPlace}
          />
        </section>
      )}

      {step === "knockout" && (
        <section className="-mx-4 sm:-mx-6 lg:-mx-8">
          <div className="mb-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold">Knockout bracket</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tree view by round — use R32, R16, QF, SF, FINAL tabs to jump. Tap a
              team to predict the winner.
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <KnockoutBracket prediction={prediction} onChange={setPrediction} />
          </div>
        </section>
      )}
    </div>
  );
}
