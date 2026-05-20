import type { Metadata } from "next";

import { QuizPageClient } from "@/components/quiz/QuizPageClient";

export const metadata: Metadata = {
  title: "Quiz",
  description:
    "Dynamically generated football quizzes — flags, captains, FIFA rankings, continents and group draws.",
};

interface PageProps {
  searchParams: Promise<{ type?: string; team?: string }>;
}

export default async function QuizPage({ searchParams }: PageProps) {
  const { type, team } = await searchParams;
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-10">
      <QuizPageClient typeParam={type} teamParam={team} />
    </div>
  );
}
