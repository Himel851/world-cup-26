import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Flag,
  Globe2,
  Goal,
  History,
  MapPin,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";

import { FixtureCard } from "@/components/fixtures/FixtureCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamHeroAnimation } from "@/components/teams/TeamHeroAnimation";
import { getFixturesForTeam } from "@/data/fixtures";
import { TEAMS, TEAMS_BY_ID } from "@/data/teams";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return TEAMS.map((t) => ({ id: t.id }));
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  const { id } = await params;
  const team = TEAMS_BY_ID[id];
  if (!team) return { title: "Team not found" };
  return {
    title: team.name,
    description: team.description,
    openGraph: {
      images: [team.flag],
    },
  };
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const team = TEAMS_BY_ID[id];
  if (!team) notFound();

  const groupMates = TEAMS.filter((t) => t.group === team.group && t.id !== team.id);
  const teamFixtures = getFixturesForTeam(team.id);

  return (
    <div className="relative">
      {/* Backdrop hero */}
      <div className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(900px 400px at 30% 0%, ${team.colors.primary}55, transparent 60%), radial-gradient(700px 400px at 80% 30%, ${team.colors.secondary}44, transparent 60%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 pitch-grid opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link href="/teams">
              <ArrowLeft className="h-4 w-4" />
              All teams
            </Link>
          </Button>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Group {team.group} · {team.continent}
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                {team.name}
              </h1>
              <p className="mt-4 max-w-xl text-[var(--muted-foreground)] sm:text-lg">
                {team.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge variant="primary">FIFA #{team.fifaRanking}</Badge>
                <Badge variant="secondary">{team.continent}</Badge>
                <Badge variant="accent">Group {team.group}</Badge>
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
                  <Link href="/quiz">
                    <Goal className="h-4 w-4" />
                    Mixed quiz
                  </Link>
                </Button>
              </div>
            </div>

            <TeamHeroAnimation team={team} />
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <InfoCard
          icon={Shield}
          label="Captain"
          value={team.captain}
          accent="text-emerald-300"
        />
        <InfoCard
          icon={MapPin}
          label="Home Stadium"
          value={team.stadium}
          accent="text-sky-300"
        />
        <InfoCard
          icon={Globe2}
          label="Continent"
          value={team.continent}
          accent="text-violet-300"
        />
        <InfoCard
          icon={Trophy}
          label="World Cup Titles"
          value={team.stats?.worldCupTitles?.toString() ?? "0"}
          accent="text-amber-300"
        />
        <InfoCard
          icon={Calendar}
          label="Appearances"
          value={team.stats?.appearances?.toString() ?? "—"}
          accent="text-cyan-300"
        />
        <InfoCard
          icon={History}
          label="Best Finish"
          value={team.stats?.bestFinish ?? "—"}
          accent="text-rose-300"
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              Official schedule
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Group stage fixtures
            </h2>
          </div>
          <Link
            href={`/fixtures?team=${team.id}`}
            className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
          >
            All fixtures
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {teamFixtures.map((fixture, i) => (
            <li key={fixture.id}>
              <FixtureCard fixture={fixture} index={i} highlightTeamId={team.id} />
            </li>
          ))}
        </ul>
      </section>

      {/* Group mates */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Group {team.group}
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
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all hover:border-emerald-400/40 hover:bg-white/[0.05]"
            >
              <Link href={`/teams/${mate.id}`} className="flex items-center gap-3">
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
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {mate.captain}
                  </p>
                </div>
                <Badge variant="primary">#{mate.fifaRanking}</Badge>
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
  value: string;
  accent: string;
}

function InfoCard({ icon: Icon, label, value, accent }: InfoCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-white/20">
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] ${accent}`}>
          <Icon className="h-5 w-5" />
        </span>
        <Flag className="h-4 w-4 text-[var(--muted-foreground)]/40" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold leading-snug">{value}</p>
    </div>
  );
}
