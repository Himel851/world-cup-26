import { FeaturedTeamsStatic } from "@/components/home/FeaturedTeamsStatic";
// import { DailyChallengeCard } from "@/components/home/DailyChallengeCard";
import { GroupsGrid } from "@/components/home/GroupsGrid";
import { HostStadiums } from "@/components/home/HostStadiums";
import { TrendingQuizzes } from "@/components/home/TrendingQuizzes";
import { TournamentCountdown } from "@/components/home/TournamentCountdown";
import { TournamentStats } from "@/components/home/TournamentStats";
import { WorldCupWinners } from "@/components/home/WorldCupWinners";

export default function HomePage() {
  return (
    <>
      <TournamentCountdown />
      <TournamentStats />
      <WorldCupWinners />
      <GroupsGrid />
      <HostStadiums />
      <FeaturedTeamsStatic />
      <TrendingQuizzes />
      {/* <DailyChallengeCard /> */}
    </>
  );
}
