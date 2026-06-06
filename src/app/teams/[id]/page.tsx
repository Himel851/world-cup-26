import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  Globe2,
  Goal,
  Minus,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { FixtureCard } from "@/components/fixtures/FixtureCard";
import { SquadUnavailable, TeamSquadSection } from "@/components/teams/TeamSquadSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFixturesForTeam } from "@/data/fixtures";
import { TEAMS, TEAMS_BY_ID } from "@/data/teams";
import { getTeamSquadByFifaCode, isApiFootballConfigured, squadUnavailableReason } from "@/lib/api-football";
import { formatPoints, formatRank, getTeamWithRanking, getTeamsWithRankings } from "@/lib/teams-with-rankings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  return TEAMS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const team = await getTeamWithRanking(id);
  if (!team) return { title: "Team not found" };
  return {
    title: team.name,
    description: `${team.name} at FIFA World Cup 2026 — Group ${team.group}, live FIFA ranking ${formatRank(team)}.`,
    openGraph: { images: [team.flag] },
  };
}

function Movement({ movement }: { movement: number }) {
  if (movement > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400">
        <ArrowUp className="h-4 w-4" />+{movement}
      </span>
    );
  }
  if (movement < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-rose-400">
        <ArrowDown className="h-4 w-4" />
        {movement}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Minus className="h-4 w-4" />—
    </span>
  );
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [team, allTeams, squad] = await Promise.all([
    getTeamWithRanking(id),
    getTeamsWithRankings(),
    isApiFootballConfigured()
      ? getTeamSquadByFifaCode(TEAMS_BY_ID[id]?.fifaCode ?? "", TEAMS_BY_ID[id]?.name ?? "")
      : null,
  ]);
  if (!team) notFound();

  const groupMates = allTeams.filter((t) => t.group === team.group && t.id !== team.id);
  const teamFixtures = getFixturesForTeam(team.id);
  const r = team.ranking;

  return (
    <div className="relative">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-emerald-400/5 opacity-40" />
        <div className="pointer-events-none absolute inset-0 pitch-grid opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/teams">
              <ArrowLeft className="h-4 w-4" />
              All teams
            </Link>
          </Button>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Group {team.group} · {r?.confederation ?? team.continent}
            </p>
            <h1 className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15 sm:h-11 sm:w-14">
                <Image
                  src={team.flag}
                  alt={`${team.name} flag`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </span>
              <span className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {team.name}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground sm:text-lg">
              Live FIFA ranking data for {team.name} at World Cup 2026 — Group {team.group}.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="primary">FIFA {formatRank(team)}</Badge>
              <Badge variant="secondary">{team.continent}</Badge>
              <Badge variant="accent">Group {team.group}</Badge>
              {r && <Badge variant="outline">{r.confederation}</Badge>}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="default">
                <Link href={`/quiz?team=${team.id}`}>
                  <Sparkles className="h-4 w-4" />
                  Quiz on {team.name}
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/fixtures?team=${team.id}`}>
                  <Calendar className="h-4 w-4" />
                  View fixtures
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/rankings">
                  <TrendingUp className="h-4 w-4" />
                  Full rankings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <InfoCard icon={TrendingUp} label="FIFA Rank" value={formatRank(team)} accent="text-emerald-300" />
        <InfoCard icon={Trophy} label="Total Points" value={formatPoints(team)} accent="text-amber-300" />
        <InfoCard
          icon={Globe2}
          label="Confederation"
          value={r?.confederation ?? team.continent}
          accent="text-violet-300"
        />
        <InfoCard
          icon={Calendar}
          label="Previous Rank"
          value={r ? `#${r.prevRank}` : "—"}
          accent="text-cyan-300"
        />
        <InfoCard
          icon={Goal}
          label="Rated Matches"
          value={r ? String(r.ratedMatches) : "—"}
          accent="text-sky-300"
        />
        <InfoCard
          icon={TrendingUp}
          label="Rank Movement"
          value={r ? <Movement movement={r.movement} /> : "—"}
          accent="text-rose-300"
        />
      </div>

      {squad ? (
        <TeamSquadSection squad={squad} localTeamId={team.id} />
      ) : (
        <SquadUnavailable reason={squadUnavailableReason()} />
      )}

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Official schedule</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Group stage fixtures</h2>
          </div>
          <Link href={`/fixtures?team=${team.id}`} className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            All fixtures
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {teamFixtures.map((fixture) => (
            <li key={fixture.id}>
              <FixtureCard fixture={fixture} highlightTeamId={team.id} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Group {team.group}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Group stage opponents</h2>
          </div>
          <Link href="/teams" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            View all teams
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groupMates.map((mate) => (
            <li
              key={mate.id}
              className="group rounded-2xl border border-white/10 bg-white/3 p-4 transition-colors hover:border-emerald-400/40 hover:bg-white/5"
            >
              <Link href={`/teams/${mate.id}`} className="flex items-center gap-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                  <Image src={mate.flag} alt={`${mate.name} flag`} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{mate.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{formatPoints(mate)} pts</p>
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

interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  accent: string;
}

function InfoCard({ icon: Icon, label, value, accent }: InfoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-5 transition-colors hover:border-white/20">
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold leading-snug">{value}</p>
    </div>
  );
}
