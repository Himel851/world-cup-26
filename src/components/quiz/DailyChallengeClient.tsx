"use client";

import * as React from "react";

import { FootballLoader } from "@/components/FootballLoader";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { generateDailyChallenge } from "@/lib/generateQuestions";
import { seedFromDate } from "@/lib/utils";
import type { QuizQuestion } from "@/types";

export function DailyChallengeClient() {
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [seed, setSeed] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Generate on the client so all date math uses the user's local day.
    const today = new Date();
    setSeed(seedFromDate(today));
    setQuestions(generateDailyChallenge(today));
  }, []);

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
      subtitle="Same 10 questions for every player today."
      mode="daily"
    />
  );
}
