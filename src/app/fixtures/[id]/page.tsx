import { notFound } from "next/navigation";

import { MatchDetailView } from "@/components/fixtures/MatchDetailView";
import { getMatchDetail } from "@/lib/match-service";
import { createPageMetadata } from "@/lib/seo";
import { TEAMS_BY_ID } from "@/data/teams";
import { getFixtureById } from "@/data/fixtures";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const fixture = getFixtureById(id);
  if (!fixture?.homeTeamId || !fixture?.awayTeamId) {
    return createPageMetadata({
      title: "Match",
      description: "FIFA World Cup 2026 match details.",
      path: `/fixtures/${id}`,
    });
  }

  const home = TEAMS_BY_ID[fixture.homeTeamId];
  const away = TEAMS_BY_ID[fixture.awayTeamId];
  const title = home && away ? `${home.name} vs ${away.name}` : "Match";

  return createPageMetadata({
    title,
    description: `World Cup 2026 match — ${title}. Score, goal scorers, and statistics.`,
    path: `/fixtures/${id}`,
  });
}

export const revalidate = 300;

export default async function MatchDetailPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getMatchDetail(id);
  console.log(detail);

  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
      <MatchDetailView detail={detail} />
    </div>
  );
}
