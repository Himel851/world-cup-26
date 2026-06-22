"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Radio, Shirt } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TEAMS_BY_ID } from "@/data/teams";
import { TOURNAMENT_STATS } from "@/data/tournament";
import { FIXTURE_KICKOFF_TIMEZONE, formatKickoffTime } from "@/lib/utils";
import type { Fixture } from "@/types";

function dateKeyInBst(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: FIXTURE_KICKOFF_TIMEZONE });
}

function formatTodayHeading(now: Date): string {
  return now.toLocaleDateString(undefined, {
    timeZone: FIXTURE_KICKOFF_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function MatchRow({ fixture }: { fixture: Fixture }) {
  const home = TEAMS_BY_ID[fixture.homeTeamId];
  const away = TEAMS_BY_ID[fixture.awayTeamId];
  if (!home || !away) return null;

  const isLive = fixture.status === "live";
  const hasScore = fixture.score != null;

  return (
    <Link
      href={`/fixtures/${fixture.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-3 transition-colors hover:border-emerald-400/30 hover:bg-emerald-500/6 sm:px-4"
    >
      <div className="hidden min-w-16 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:block">
        {fixture.group ? `Group ${fixture.group}` : fixture.stage}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3">
        <span className="min-w-0 flex-1 truncate text-right text-xs font-semibold sm:text-sm">
          {home.name}
        </span>
        <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/15 sm:h-6 sm:w-9">
          <Image src={home.flag} alt="" fill sizes="36px" className="object-cover" />
        </div>

        <div className="flex shrink-0 flex-col items-center px-1">
          {hasScore ? (
            <span className="text-sm font-black tabular-nums sm:text-base">
              {fixture.score!.home}
              <span className="mx-1 text-muted-foreground">–</span>
              {fixture.score!.away}
            </span>
          ) : (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold tabular-nums text-emerald-200 sm:text-xs">
              {formatKickoffTime(fixture.kickoffUtc)}
            </span>
          )}
          {isLive && (
            <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              Live
            </span>
          )}
        </div>

        <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/15 sm:h-6 sm:w-9">
          <Image src={away.flag} alt="" fill sizes="36px" className="object-cover" />
        </div>
        <span className="min-w-0 flex-1 truncate text-left text-xs font-semibold sm:text-sm">
          {away.name}
        </span>
      </div>
    </Link>
  );
}

interface TournamentHeroProps {
  fixtures: Fixture[];
}

export function TournamentHero({ fixtures }: TournamentHeroProps) {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const todayKey = dateKeyInBst(now);
  const todayFixtures = fixtures
    .filter((f) => dateKeyInBst(new Date(f.kickoffUtc)) === todayKey)
    .sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());
  const todayHeading = formatTodayHeading(now);

  return (
    <section className="relative isolate overflow-hidden pt-10 sm:pt-14 lg:pt-20">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-lg sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_0%,rgba(34,211,164,0.1),transparent_70%)]" />

          <div className="relative text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <Radio className="h-3.5 w-3.5" />
              Tournament Live
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              FIFA World Cup 2026
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              টুর্নামেন্ট চলছে — USA · Mexico · Canada
            </p>

            <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              <span>{TOURNAMENT_STATS.nations} nations</span>
              <span className="text-white/20">·</span>
              <span>{TOURNAMENT_STATS.groups} groups</span>
              <span className="text-white/20">·</span>
              <span>{TOURNAMENT_STATS.totalMatches} matches</span>
            </div>

            <div className="mt-8 text-left">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                  Today&apos;s matches
                </h2>
                <span className="text-[10px] text-muted-foreground sm:text-xs">{todayHeading}</span>
              </div>

              {todayFixtures.length > 0 ? (
                <div className="space-y-2">
                  {todayFixtures.map((fixture) => (
                    <MatchRow key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground/90">
                    No matches scheduled for this date.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Check the full schedule for upcoming kickoffs.
                  </p>
                </div>
              )}

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                <MapPin className="h-3 w-3 shrink-0" />
                All times in Bangladesh Standard Time (UTC+6)
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="default">
                <Link href="/fixtures">
                  <Calendar className="h-4 w-4" />
                  Full Schedule
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/teams">
                  <Shirt className="h-4 w-4" />
                  View Squads
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
