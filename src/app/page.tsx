import { FeaturedTeams } from "@/components/home/FeaturedTeams";
import { GroupsGrid } from "@/components/home/GroupsGrid";
import { HostStadiums } from "@/components/home/HostStadiums";
import { TrendingQuizzes } from "@/components/home/TrendingQuizzes";
import { TournamentCountdown } from "@/components/home/TournamentCountdown";
import { TournamentStats } from "@/components/home/TournamentStats";
import { WorldCupWinners } from "@/components/home/WorldCupWinners";
import { getTeamsWithRankings } from "@/lib/teams-with-rankings";

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
