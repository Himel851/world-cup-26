"use client";

import * as React from "react";

import { CalendarDays, Flag, Sparkles } from "lucide-react";

import { QuizCard, type QuizCardTone } from "@/components/quiz/QuizCard";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { FootballLoader } from "@/components/FootballLoader";
import { TEAMS_BY_ID } from "@/data/teams";
import { generateQuiz, generateTeamQuiz } from "@/lib/generateQuestions";
import type { QuizQuestion, QuizType, Team, TeamWithRanking } from "@/types";

interface QuizPageClientProps {
  typeParam?: string;
  teamParam?: string;
  teams: TeamWithRanking[];
}

const VALID_TYPES: QuizType[] = ["flag"];

type QuizSelection =
  | { kind: "team"; team: Team }
  | { kind: "type"; quizType: QuizType }
  | { kind: "mixed" };

function inferSelection(teamParam?: string, typeParam?: string): QuizSelection | null {
  if (teamParam) {
    const team = TEAMS_BY_ID[teamParam];
    if (team) return { kind: "team", team };
  }
  if (typeParam === "mixed") return { kind: "mixed" };
  if (typeParam && VALID_TYPES.includes(typeParam as QuizType)) {
    return { kind: "type", quizType: typeParam as QuizType };
  }
  return null;
}

const QUIZ_MODE_CARDS = [
  {
    id: "flag",
    title: "Flag Master",
    description: "Name the nation from its flag — 10 standard questions.",
    href: "/quiz?type=flag",
    icon: Flag,
    accent: "from-emerald-400/25 via-teal-500/12 to-transparent",
    badge: "10 QUESTIONS",
    tone: "emerald" as QuizCardTone,
    metadata: "Flags only · ~3 min",
    choiceHint: "Ten flag questions",
  },
  {
    id: "mixed",
    title: "Random Quiz",
    description: "A fresh random set of flag questions every run.",
    href: "/quiz?type=mixed",
    icon: Sparkles,
    accent: "from-violet-400/20 via-fuchsia-500/10 to-transparent",
    badge: "10 QUESTIONS",
    tone: "violet" as QuizCardTone,
    metadata: "Random flags · ~3 min",
    choiceHint: "Ten random questions",
  },
  {
    id: "daily",
    title: "Daily Quiz",
    description: "Today's shared challenge — same questions for everyone.",
    href: "/daily-challenge",
    icon: CalendarDays,
    accent: "from-amber-400/20 via-orange-500/10 to-transparent",
    badge: "TODAY",
    tone: "amber" as QuizCardTone,
    metadata: "Daily board · One attempt",
    choiceHint: "Play today's set",
  },
];

export function QuizPageClient({ typeParam, teamParam, teams }: QuizPageClientProps) {
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null);
  const [seed, setSeed] = React.useState(0);

  const selection = React.useMemo(
    () => inferSelection(teamParam, typeParam),
    [teamParam, typeParam],
  );

  const title =
    selection?.kind === "team"
      ? `${selection.team.name} Quiz`
      : selection?.kind === "type"
        ? "Flag Master"
        : selection?.kind === "mixed"
          ? "Random Quiz"
          : "Pick a quiz";

  const subtitle =
    selection?.kind === "team"
      ? `10 World Cup history questions about ${selection.team.name}.`
      : selection?.kind === "type"
        ? "10 flag questions — identify each nation."
        : selection?.kind === "mixed"
          ? "10 random flag questions — new set each time."
          : undefined;

  React.useEffect(() => {
    if (!selection) {
      setQuestions(null);
      return;
    }
    if (selection.kind === "team") {
      setQuestions(generateTeamQuiz(selection.team, 10));
    } else if (selection.kind === "type") {
      setQuestions(generateQuiz({ count: 10, types: ["flag"], teams }));
    } else {
      setQuestions(generateQuiz({ count: 10, types: ["flag"], teams }));
    }
  }, [selection, seed, teams]);

  const storageKey =
    selection?.kind === "team"
      ? `wcc:quiz:team:${selection.team.id}`
      : selection?.kind === "type"
        ? "wcc:quiz:type:flag"
        : selection?.kind === "mixed"
          ? "wcc:quiz:random"
          : "";

  if (!selection) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            World Cup 2026 Quiz
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Choose a mode</h1>
          <p className="text-sm text-muted-foreground">
            Flag quizzes only — quick rounds, standard questions.
          </p>
        </header>

        <section
          aria-labelledby="quiz-modes-heading"
          className="grid gap-4 sm:grid-cols-3 sm:gap-5"
        >
          <h2 id="quiz-modes-heading" className="sr-only">
            Quiz modes
          </h2>
          {QUIZ_MODE_CARDS.map((item, i) => (
            <QuizCard
              key={item.id}
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
              accent={item.accent}
              badge={item.badge}
              metadata={item.metadata}
              tone={item.tone}
              index={i}
              pickerMode
              choiceHint={item.choiceHint}
            />
          ))}
        </section>
      </div>
    );
  }

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
