"use client";

import * as React from "react";

import { QuizRunner } from "@/components/quiz/QuizRunner";
import { FootballLoader } from "@/components/FootballLoader";
import { TEAMS_BY_ID } from "@/data/teams";
import { generateQuiz, generateTeamQuiz } from "@/lib/generateQuestions";
import type { QuizQuestion, QuizType } from "@/types";

interface QuizPageClientProps {
  typeParam?: string;
  teamParam?: string;
}

const VALID_TYPES: QuizType[] = ["flag", "captain", "ranking", "continent", "group"];

const TYPE_LABEL: Record<QuizType, string> = {
  flag: "Flag Master",
  captain: "Captain Call",
  ranking: "FIFA Ranking",
  continent: "Continental",
  group: "Group Draw",
};

export function QuizPageClient({ typeParam, teamParam }: QuizPageClientProps) {
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [seed, setSeed] = React.useState(0);

  const type = VALID_TYPES.includes(typeParam as QuizType)
    ? (typeParam as QuizType)
    : undefined;
  const team = teamParam ? TEAMS_BY_ID[teamParam] : undefined;

  const title = team
    ? `${team.name} Quiz`
    : type
      ? TYPE_LABEL[type]
      : "Random Quiz";

  const subtitle = team
    ? `5 quick-fire questions focused on ${team.name}.`
    : type
      ? `Pure ${TYPE_LABEL[type]} mode — 10 questions of the same flavour.`
      : "10 mixed questions sampled from every quiz mode.";

  React.useEffect(() => {
    // generate questions only on the client to avoid SSR/CSR mismatch
    if (team) {
      setQuestions(generateTeamQuiz(team, 5));
    } else if (type) {
      setQuestions(generateQuiz({ count: 10, types: [type] }));
    } else {
      setQuestions(generateQuiz({ count: 10 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, team?.id, seed]);

  const storageKey = team
    ? `wcc:quiz:team:${team.id}`
    : type
      ? `wcc:quiz:type:${type}`
      : "wcc:quiz:random";

  if (!questions) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <FootballLoader label="Generating questions" size={64} />
      </div>
    );
  }

  return (
    <QuizRunner
      questions={questions}
      storageKey={storageKey}
      title={title}
      subtitle={subtitle}
      onReset={() => setSeed((s) => s + 1)}
    />
  );
}
