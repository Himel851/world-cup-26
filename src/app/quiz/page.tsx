import { QuizPageClient } from "@/components/quiz/QuizPageClient";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";

export const metadata = createPageMetadata({
  title: "Quiz",
  description:
    "World Cup 2026 football quizzes — Flag Master, random nation flags, and trivia to test your knowledge of all 48 teams.",
  path: "/quiz",
  keywords: [...WC26_KEYWORDS, "football quiz", "flag quiz", "World Cup trivia", "soccer quiz"],
});

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
