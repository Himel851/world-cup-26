import { FeaturedTeams } from "@/components/home/FeaturedTeams";
import { HomeStandingsSection } from "@/components/home/HomeStandingsSection";
import { HostStadiums } from "@/components/home/HostStadiums";
import { TrendingQuizzes } from "@/components/home/TrendingQuizzes";
import { TournamentHero } from "@/components/home/TournamentHero";
import { TournamentStats } from "@/components/home/TournamentStats";
import { WorldCupWinners } from "@/components/home/WorldCupWinners";
import { getEnrichedFixtures } from "@/lib/match-service";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "FIFA World Cup 2026 · Groups, Fixtures & Quiz",
  description:
    "Everything for FIFA World Cup 2026 — 48 nations, 12 groups, live schedule, squads, Best XI builder, and football quizzes.",
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

export const revalidate = 300;

export default async function HomePage() {
  const [teams, fixtures] = await Promise.all([
    getTeamsWithRankings(),
    getEnrichedFixtures(),
  ]);

  return (
    <>
      <TournamentHero fixtures={fixtures} />
      <TournamentStats />
      <HomeStandingsSection fixtures={fixtures} />
      <WorldCupWinners />
      <HostStadiums />
      <FeaturedTeams teams={teams} />
      <TrendingQuizzes />
    </>
  );
}
