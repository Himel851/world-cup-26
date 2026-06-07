"use client";

import Link from "next/link";
import { ArrowRight, Compass, Flag, MapPin, Sparkles, TrendingUp } from "lucide-react";

import { QuizCard, type QuizCardTone } from "@/components/quiz/QuizCard";

const QUIZZES = [
  {
    title: "Flag Master",
    description: "48 nations. One flag. Beat the clock before time runs out.",
    href: "/quiz?type=flag",
    icon: Flag,
    accent: "from-emerald-400/25 via-teal-500/12 to-transparent",
    badge: "Trending",
    tone: "emerald" as QuizCardTone,
    metadata: "10 questions · ~3 min",
    choiceHint: "Flag identification",
  },
  {
    title: "FIFA Ranking",
    description: "Head-to-head duels — pick who sits higher on the live ladder.",
    href: "/quiz?type=ranking",
    icon: TrendingUp,
    accent: "from-violet-400/25 via-fuchsia-500/12 to-transparent",
    badge: "Live data",
    tone: "violet" as QuizCardTone,
    metadata: "Live FIFA data · ~3 min",
    choiceHint: "Ranking battles",
  },
  {
    title: "Continental",
    description: "Lock in the right continent for every national team on the card.",
    href: "/quiz?type=continent",
    icon: Compass,
    accent: "from-amber-400/25 via-orange-500/12 to-transparent",
    badge: "Easy",
    tone: "amber" as QuizCardTone,
    metadata: "6 continents · ~3 min",
    choiceHint: "Continent quiz",
  },
  {
    title: "Group Draw",
    description: "Which side belongs in Group A, F, or L? Test your draw knowledge.",
    href: "/quiz?type=group",
    icon: MapPin,
    accent: "from-pink-400/25 via-rose-500/12 to-transparent",
    badge: "Pro",
    tone: "rose" as QuizCardTone,
    metadata: "12 groups · ~3 min",
    choiceHint: "Group draw",
  },
] as const;

export function TrendingQuizzes() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-lg sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_100%_0%,rgba(167,139,250,0.1),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_350px_at_0%_100%,rgba(34,211,164,0.08),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 pitch-grid opacity-[0.06]" />

        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Test Your Knowledge
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Football Quizzes</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Four quick modes — flags, live rankings, continents, and the group draw. Pick one
              and play instantly.
            </p>
          </div>

          <Link
            href="/quiz"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200"
          >
            All quiz modes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {QUIZZES.map((q, i) => (
            <QuizCard
              key={q.title}
              title={q.title}
              description={q.description}
              href={q.href}
              icon={q.icon}
              accent={q.accent}
              badge={q.badge}
              tone={q.tone}
              metadata={q.metadata}
              choiceHint={q.choiceHint}
              index={i}
              pickerMode
            />
          ))}
        </div>
      </div>
    </section>
  );
}
