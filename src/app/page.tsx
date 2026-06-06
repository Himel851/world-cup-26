import dynamic from "next/dynamic";

import { FeaturedTeamsStatic } from "@/components/home/FeaturedTeamsStatic";
import { GroupsGrid } from "@/components/home/GroupsGrid";
import { TournamentCountdown } from "@/components/home/TournamentCountdown";
import { TournamentStats } from "@/components/home/TournamentStats";

const TrendingQuizzes = dynamic(
  () =>
    import("@/components/home/TrendingQuizzes").then((m) => ({
      default: m.TrendingQuizzes,
    })),
  { loading: () => null },
);

const DailyChallengeCard = dynamic(
  () =>
    import("@/components/home/DailyChallengeCard").then((m) => ({
      default: m.DailyChallengeCard,
    })),
  { loading: () => null },
);

export default function HomePage() {
  return (
    <>
      <TournamentCountdown />
      <TournamentStats />
      <GroupsGrid />
      <FeaturedTeamsStatic />
      <TrendingQuizzes />
      <DailyChallengeCard />
    </>
  );
}
