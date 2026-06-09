import type { Metadata } from "next";

import { QuizPageClient } from "@/components/quiz/QuizPageClient";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";

export const metadata: Metadata = {
  title: "Quiz",
  description:
    "Flag Master, random flag quizzes, and the daily World Cup 2026 challenge.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ type?: string; team?: string }>;
}

export default async function QuizPage({ searchParams }: PageProps) {
  const { type, team } = await searchParams;
  const teams = await getTeamsWithRankings();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-10">
      <QuizPageClient typeParam={type} teamParam={team} teams={teams} />
    </div>
  );
}
