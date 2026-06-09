import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, LayoutGrid, Sparkles, TrendingUp } from "lucide-react";

import { TeamDetailsTabs } from "@/components/teams/TeamDetailsTabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFixturesForTeam } from "@/data/fixtures";
import { TEAMS } from "@/data/teams";
import { getTeamSquadFromList } from "@/lib/player-list";
import { createPageMetadata } from "@/lib/seo";
import {
  formatPoints,
  formatRank,
  getTeamWithRanking,
  getTeamsWithRankings,
} from "@/lib/teams-with-rankings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return TEAMS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const team = await getTeamWithRanking(id);
  if (!team) return createPageMetadata({ title: "Team not found", description: "Nation not found.", path: `/teams/${id}`, noIndex: true });

  return createPageMetadata({
    title: team.name,
    description: `${team.name} at FIFA World Cup 2026 — Group ${team.group}, FIFA rank ${formatRank(team)} (${formatPoints(team)} pts). Squad, fixtures and player profiles.`,
    path: `/teams/${id}`,
    keywords: [team.name, team.fifaCode, `Group ${team.group}`, "FIFA World Cup 2026", team.continent],
    ogImage: { url: team.flag, alt: `${team.name} flag` },
  });
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const [team, allTeams] = await Promise.all([
    getTeamWithRanking(id),
    getTeamsWithRankings(),
  ]);

  const squad = getTeamSquadFromList(id);

  if (!team) notFound();

  const groupMates = allTeams.filter(
    (t) => t.group === team?.group && t.id !== team?.id,
  );
  const teamFixtures = getFixturesForTeam(team?.id);
  const r = team?.ranking;

  return (
    <div className="relative">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-emerald-400/5 opacity-40" />
        <div className="pointer-events-none absolute inset-0 pitch-grid opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/teams">
              <ArrowLeft className="h-4 w-4" />
              All teams
            </Link>
          </Button> */}

          <div>
            {/* <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Group {team?.group} · {r?.confederation ?? team?.continent}
            </p> */}
            <h1 className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15 sm:h-11 sm:w-14">
                <Image
                  src={team?.flag}
                  alt={`${team?.name} flag`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </span>
              <span className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {team?.name}
              </span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="primary">FIFA {formatRank(team)}</Badge>
              <Badge variant="secondary">{formatPoints(team)} pts</Badge>
              <Badge variant="accent">Group {team?.group}</Badge>
              {r && <Badge variant="outline">{r.confederation}</Badge>}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href={`/quiz?team=${team?.id}`}>
                  <Sparkles className="h-4 w-4" />
                  Play Quiz
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/best-11?team=${team?.id}`}>
                  <LayoutGrid className="h-4 w-4" />
                  Best XI
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href={`/fixtures?team=${team?.id}`}>
                  <Calendar className="h-4 w-4" />
                  View fixtures
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="sm:size-lg">
                <Link href="/rankings">
                  <TrendingUp className="h-4 w-4" />
                  Full rankings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <TeamDetailsTabs teamId={team.id} squad={squad} fixtures={teamFixtures} />

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Group {team?.group}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Group stage opponents
            </h2>
          </div>
          <Link
            href="/teams"
            className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            View all teams
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groupMates.map((mate) => (
            <li
              key={mate.id}
              className="group rounded-2xl border border-white/10 bg-white/3 p-4 transition-colors hover:border-emerald-400/40 hover:bg-white/5"
            >
              <Link
                href={`/teams/${mate.id}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                  <Image
                    src={mate.flag}
                    alt={`${mate.name} flag`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{mate.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatPoints(mate)} pts
                  </p>
                </div>
                <Badge variant="primary">{formatRank(mate)}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
