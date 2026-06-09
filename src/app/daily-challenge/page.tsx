import { DailyChallengeClient } from "@/components/quiz/DailyChallengeClient";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";

export const metadata = createPageMetadata({
  title: "Daily Challenge",
  description:
    "Daily World Cup 2026 trivia — 10 football questions, same for everyone today. Compete on the global leaderboard with streaks and accuracy.",
  path: "/daily-challenge",
  keywords: [...WC26_KEYWORDS, "daily quiz", "football trivia", "leaderboard", "streak"],
});

export const revalidate = 3600;

export default async function DailyChallengePage() {
  const teams = await getTeamsWithRankings();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
      <DailyChallengeClient teams={teams} />
    </div>
  );
}
