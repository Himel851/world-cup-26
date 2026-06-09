import { FeaturedTeams } from "@/components/home/FeaturedTeams";
import { GroupsGrid } from "@/components/home/GroupsGrid";
import { HostStadiums } from "@/components/home/HostStadiums";
import { TrendingQuizzes } from "@/components/home/TrendingQuizzes";
import { TournamentCountdown } from "@/components/home/TournamentCountdown";
import { TournamentStats } from "@/components/home/TournamentStats";
import { WorldCupWinners } from "@/components/home/WorldCupWinners";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FIFA World Cup 2026 · Groups, Fixtures & Quiz",
  description:
    "Everything for FIFA World Cup 2026 — 48 nations, 12 groups, full schedule, squads, Best XI builder, and football quizzes. Countdown to kickoff.",
  path: "/",
  absoluteTitle: true,
  keywords: [
    ...WC26_KEYWORDS,
    "World Cup Groups",
    "World Cup Fixtures",
    "Football Quiz",
    "Best XI",
    "National Teams",
  ],
});

export const revalidate = 3600;

export default async function HomePage() {
  const teams = await getTeamsWithRankings();

  return (
    <>
      <TournamentCountdown />
      <TournamentStats />
      <GroupsGrid />
      <WorldCupWinners />
      <HostStadiums />
      <FeaturedTeams teams={teams} />
      <TrendingQuizzes />
    </>
  );
}
