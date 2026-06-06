import type { Metadata } from "next";

import { DailyChallengeClient } from "@/components/quiz/DailyChallengeClient";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description:
    "10 deterministic football trivia questions, identical for every player today. Compete on the global daily leaderboard.",
};

export const revalidate = 3600;

export default async function DailyChallengePage() {
  const teams = await getTeamsWithRankings();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-4 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
      <DailyChallengeClient teams={teams} />
    </div>
  );
}
