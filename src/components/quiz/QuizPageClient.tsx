"use client";

import * as React from "react";

import {
  Compass,
  Flag,
  MapPin,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { QuizCard, type QuizCardTone } from "@/components/quiz/QuizCard";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { FootballLoader } from "@/components/FootballLoader";
import { TEAMS_BY_ID } from "@/data/teams";
import { generateQuiz, generateTeamQuiz } from "@/lib/generateQuestions";
import type { QuizQuestion, QuizType, Team } from "@/types";

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

const SINGLE_TYPE_CARDS = [
  {
    type: "flag" as const,
    title: TYPE_LABEL.flag,
    description:
      "Identify nations from their flags with zero multiple-choice fatigue.",
    href: "/quiz?type=flag",
    icon: Flag,
    accent: "from-emerald-400/25 via-teal-500/12 to-transparent",
    badge: "10 QUESTIONS",
    tone: "emerald" as QuizCardTone,
    metadata: "Single category · ~3 min · Timed rounds",
  },
  {
    type: "captain" as const,
    title: TYPE_LABEL.captain,
    description: "Match skippers to their squads — memory and instinct under pressure.",
    href: "/quiz?type=captain",
    icon: Shield,
    accent: "from-sky-400/25 via-cyan-500/12 to-transparent",
    badge: "10 QUESTIONS",
    tone: "cyan" as QuizCardTone,
    metadata: "Single category · ~3 min · Timed rounds",
  },
  {
    type: "ranking" as const,
    title: TYPE_LABEL.ranking,
    description:
      "Head-to-head FIFA ranking duels — pick who sits higher on the ladder.",
    href: "/quiz?type=ranking",
    icon: TrendingUp,
    accent: "from-violet-400/25 via-fuchsia-500/12 to-transparent",
    badge: "10 QUESTIONS",
    tone: "violet" as QuizCardTone,
    metadata: "Single category · ~3 min · Timed rounds",
  },
  {
    type: "continent" as const,
    title: TYPE_LABEL.continent,
    description: "Lock in the right continent for every national team on the card.",
    href: "/quiz?type=continent",
    icon: Compass,
    accent: "from-amber-400/25 via-orange-500/12 to-transparent",
    badge: "10 QUESTIONS",
    tone: "amber" as QuizCardTone,
    metadata: "Single category · ~3 min · Timed rounds",
  },
  {
    type: "group" as const,
    title: TYPE_LABEL.group,
    description: "World Cup draw knowledge — which side belongs in which letter group.",
    href: "/quiz?type=group",
    icon: MapPin,
    accent: "from-pink-400/25 via-rose-500/12 to-transparent",
    badge: "10 QUESTIONS",
    tone: "rose" as QuizCardTone,
    metadata: "Single category · ~3 min · Timed rounds",
  },
];

export function QuizPageClient({ typeParam, teamParam }: QuizPageClientProps) {
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
        ? TYPE_LABEL[selection.quizType]
        : selection?.kind === "mixed"
          ? "Mixed Quiz"
          : "Pick a quiz";

  const subtitle =
    selection?.kind === "team"
      ? `5 quick-fire questions focused on ${selection.team.name}.`
      : selection?.kind === "type"
        ? `Pure ${TYPE_LABEL[selection.quizType]} mode — 10 questions of the same flavour.`
        : selection?.kind === "mixed"
          ? "10 mixed questions sampled from every quiz mode."
          : undefined;

  React.useEffect(() => {
    if (!selection) {
      setQuestions(null);
      return;
    }
    if (selection.kind === "team") {
      setQuestions(generateTeamQuiz(selection.team, 5));
    } else if (selection.kind === "type") {
      setQuestions(generateQuiz({ count: 10, types: [selection.quizType] }));
    } else {
      setQuestions(generateQuiz({ count: 10 }));
    }
  }, [selection, seed]);

  const storageKey =
    selection?.kind === "team"
      ? `wcc:quiz:team:${selection.team.id}`
      : selection?.kind === "type"
        ? `wcc:quiz:type:${selection.quizType}`
        : selection?.kind === "mixed"
          ? "wcc:quiz:random"
          : "";

  if (!selection) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-none sm:rounded-4xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(34,211,164,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_100%_0%,rgba(99,102,241,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_0%_100%,rgba(6,182,212,0.1),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,13,0)_0%,rgba(6,8,13,0.65)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-6xl space-y-12 lg:space-y-16">
          <header className="space-y-6 text-center sm:text-left">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/95 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                World Cup Challenge
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {SINGLE_TYPE_CARDS.length + 1} modes · Live data
              </p>
            </div>

        
          </header>

          <section aria-labelledby="quiz-modes-heading" className="space-y-6">
            <div className="flex flex-col gap-2 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="quiz-modes-heading"
                  className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
                >
                  Quiz modes
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Three-column grid · Glass panels · Hover to preview glow
                </p>
              </div>
              <span className="inline-flex w-fit items-center rounded-lg border border-emerald-500/25 bg-emerald-500/8 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-200/95">
                Select one to begin
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-8">
              {SINGLE_TYPE_CARDS.map((item, i) => (
                <QuizCard
                  key={item.type}
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
                  choiceHint="Ten questions"
                />
              ))}
              <QuizCard
                title="Mixed quiz"
                description="The showcase run — rotations through every mechanic in one cinematic session."
                href="/quiz?type=mixed"
                icon={Sparkles}
                accent="from-emerald-400/15 via-violet-500/18 to-cyan-500/12"
                badge="10 QUESTIONS"
                metadata="All categories · ~3 min · Rotating types"
                tone="spectrum"
                index={SINGLE_TYPE_CARDS.length}
                pickerMode
                choiceHint="Ten mixed questions"
              />
            </div>
          </section>
        </div>
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
