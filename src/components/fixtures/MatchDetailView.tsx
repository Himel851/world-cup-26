import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TEAMS_BY_ID } from "@/data/teams";
import { getTeamForFixtureSide } from "@/lib/match-service";
import {
  formatKickoffDate,
  formatKickoffTime,
} from "@/lib/utils";
import type { MatchDetail, MatchEvent } from "@/types/match-detail";
import type { Fixture } from "@/types";

function StatusBadge({ fixture }: { fixture: Fixture }) {
  if (fixture.status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
        Live
      </span>
    );
  }
  if (fixture.status === "finished") {
    return (
      <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Full time
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
      Scheduled
    </span>
  );
}

function ScoreHeader({ detail }: { detail: MatchDetail }) {
  const { fixture } = detail;
  const home = getTeamForFixtureSide(fixture, "home");
  const away = getTeamForFixtureSide(fixture, "away");
  if (!home || !away) return null;

  const hasScore = fixture.score != null;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
      <Link href={`/teams/${home.id}`} className="flex flex-col items-center gap-2 text-center">
        <div className="relative h-14 w-20 overflow-hidden rounded-lg ring-2 ring-white/15 sm:h-16 sm:w-24">
          <Image src={home.flag} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <span className="text-sm font-bold sm:text-base">{home.name}</span>
      </Link>

      <div className="text-center">
        <StatusBadge fixture={fixture} />
        {hasScore ? (
          <p className="mt-3 text-4xl font-black tabular-nums tracking-tight sm:text-5xl">
            {fixture.score!.home}
            <span className="mx-2 text-muted-foreground">–</span>
            {fixture.score!.away}
          </p>
        ) : (
          <p className="mt-3 text-2xl font-bold tabular-nums text-emerald-300 sm:text-3xl">
            {formatKickoffTime(fixture.kickoffUtc)}
          </p>
        )}
        {fixture.penalties && (
          <p className="mt-1 text-sm font-semibold tabular-nums text-amber-200">
            Pens {fixture.penalties.home} – {fixture.penalties.away}
          </p>
        )}
        {fixture.wentToExtraTime && !fixture.penalties && hasScore && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            After extra time
          </p>
        )}
        {detail.htScore && (
          <p className="mt-1 text-xs text-muted-foreground">
            HT {detail.htScore.home} – {detail.htScore.away}
          </p>
        )}
      </div>

      <Link href={`/teams/${away.id}`} className="flex flex-col items-center gap-2 text-center">
        <div className="relative h-14 w-20 overflow-hidden rounded-lg ring-2 ring-white/15 sm:h-16 sm:w-24">
          <Image src={away.flag} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <span className="text-sm font-bold sm:text-base">{away.name}</span>
      </Link>
    </div>
  );
}

function eventLabel(event: MatchEvent): string {
  switch (event.type) {
    case "goal":
      return "Goal";
    case "penalty":
      return "Penalty";
    case "own_goal":
      return "Own goal";
    case "yellow_card":
      return "Yellow card";
    case "red_card":
      return "Red card";
    case "substitution":
      return "Substitution";
    default:
      return event.type;
  }
}

function EventsList({ events, fixture }: { events: MatchEvent[]; fixture: Fixture }) {
  if (events.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-muted-foreground">
        Goal scorers and events will appear here after the match.
        <span className="mt-2 block text-xs">
          Add data in{" "}
          <code className="text-emerald-300/90">src/data/match-results/manual.ts</code>
        </span>
      </p>
    );
  }

  const sorted = [...events].sort((a, b) => a.minute - b.minute || (a.extraMinute ?? 0) - (b.extraMinute ?? 0));

  return (
    <ul className="space-y-2">
      {sorted.map((event, i) => {
        const team = TEAMS_BY_ID[event.teamId];
        const isHome = event.teamId === fixture.homeTeamId;
        return (
          <li
            key={`${event.minute}-${event.player}-${i}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 sm:px-4"
          >
            <span className="w-10 shrink-0 text-xs font-bold tabular-nums text-muted-foreground">
              {event.minute}
              {event.extraMinute ? `+${event.extraMinute}` : ""}&apos;
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="font-semibold text-foreground">{event.player}</span>
              {event.assist && (
                <span className="text-muted-foreground"> · assist {event.assist}</span>
              )}
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                {eventLabel(event)}
              </span>
            </span>
            {team && (
              <div className={`relative h-4 w-6 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/15 ${isHome ? "" : "order-first"}`}>
                <Image src={team.flag} alt="" fill sizes="24px" className="object-cover" />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  const total = home + away || 1;
  const homePct = Math.round((home / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs tabular-nums">
        <span className="font-bold">{home}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-bold">{away}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="bg-emerald-500/80" style={{ width: `${homePct}%` }} />
        <div className="flex-1 bg-sky-500/60" />
      </div>
    </div>
  );
}

function StatsPanel({ detail }: { detail: MatchDetail }) {
  const stats = detail.stats;
  if (!stats) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-muted-foreground">
        Match statistics will appear here after the match.
      </p>
    );
  }

  const rows: { label: string; key: keyof typeof stats.home }[] = [
    { label: "Possession %", key: "possession" },
    { label: "Shots", key: "shots" },
    { label: "On target", key: "shotsOnTarget" },
    { label: "Corners", key: "corners" },
    { label: "Fouls", key: "fouls" },
    { label: "Offsides", key: "offsides" },
    { label: "Yellow cards", key: "yellowCards" },
    { label: "Red cards", key: "redCards" },
  ];

  return (
    <div className="space-y-4">
      {rows.map(({ label, key }) => {
        const h = stats.home[key];
        const a = stats.away[key];
        if (h == null && a == null) return null;
        return (
          <StatBar
            key={key}
            label={label}
            home={h ?? 0}
            away={a ?? 0}
          />
        );
      })}
    </div>
  );
}

export function MatchDetailView({ detail }: { detail: MatchDetail }) {
  const { fixture } = detail;

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
        <Link href="/fixtures">
          <ArrowLeft className="h-4 w-4" />
          Back to schedule
        </Link>
      </Button>

      <header className="overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-lg sm:p-10">
        <div className="mb-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
            {fixture.group ? `Group ${fixture.group}` : fixture.stage.replace(/_/g, " ")}
            {fixture.matchday ? ` · Matchday ${fixture.matchday}` : ""}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatKickoffDate(fixture.kickoffUtc)} · {formatKickoffTime(fixture.kickoffUtc)}{" "}
            <span className="text-foreground/70">BST</span>
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {fixture.venue.name}, {fixture.venue.city}
          </p>
        </div>

        <ScoreHeader detail={detail} />
      </header>

      {/* <section className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-lg sm:p-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          Match events
        </h2>
        <EventsList events={detail.events} fixture={fixture} />
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/45 p-6 backdrop-blur-lg sm:p-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
          Statistics
        </h2>
        <StatsPanel detail={detail} />
      </section> */}

      
    </div>
  );
}
