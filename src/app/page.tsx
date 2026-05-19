import { DailyChallengeCard } from "@/components/home/DailyChallengeCard";
import { FeaturedTeams } from "@/components/home/FeaturedTeams";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TrendingQuizzes } from "@/components/home/TrendingQuizzes";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedTeams />
      <TrendingQuizzes />
      <StatsSection />
      <DailyChallengeCard />
    </>
  );
}
