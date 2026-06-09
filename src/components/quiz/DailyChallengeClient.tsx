"use client";

import * as React from "react";

import { FootballLoader } from "@/components/FootballLoader";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { generateDailyChallenge } from "@/lib/generateQuestions";
import { seedFromDate } from "@/lib/utils";
import type { QuizQuestion, TeamWithRanking } from "@/types";

interface DailyChallengeClientProps {
  teams: TeamWithRanking[];
}

export function DailyChallengeClient({ teams }: DailyChallengeClientProps) {
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [seed, setSeed] = React.useState<number | null>(null);

  React.useEffect(() => {
    const today = new Date();
    setSeed(seedFromDate(today));
    setQuestions(generateDailyChallenge(today, teams));
  }, [teams]);

  if (!questions || seed === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <FootballLoader label="Loading today's set" size={64} />
      </div>
    );
  }

  return (
    <QuizRunner
      questions={questions}
      storageKey={`wcc:daily:${seed}`}
      title="Daily Challenge"
      subtitle="Same 10 flag questions for every player today."
      mode="daily"
    />
  );
}
