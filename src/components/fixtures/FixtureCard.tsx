"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TEAMS_BY_ID } from "@/data/teams";
import { cn, formatKickoffUtc } from "@/lib/utils";
import type { Fixture } from "@/types";

interface FixtureCardProps {
  fixture: Fixture;
  index?: number;
  highlightTeamId?: string;
  className?: string;
}

const STAGE_LABEL: Record<Fixture["stage"], string> = {
  group: "Group stage",
  round_of_32: "Round of 32",
  round_of_16: "Round of 16",
  quarter: "Quarter-final",
  semi: "Semi-final",
  third_place: "Third place",
  final: "Final",
};

function TeamRow({
  teamId,
  side,
  isHighlight,
}: {
  teamId: string;
  side: "home" | "away";
  isHighlight: boolean;
}) {
  const team = TEAMS_BY_ID[teamId];
  if (!team) return null;

  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-white/[0.06]",
        side === "away" && "flex-row-reverse text-right",
        isHighlight && "bg-emerald-400/10 ring-1 ring-emerald-400/25",
      )}
    >
      <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
        <Image src={team.flag} alt="" fill sizes="48px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{team.name}</p>
        {/* <p className="truncate text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
          {side === "home" ? "Home" : "Away"}
        </p> */}
      </div>
    </Link>
  );
}

export function FixtureCard({
  fixture,
  index = 0,
  highlightTeamId,
  className,
}: FixtureCardProps) {
  const isKnockoutMilestone = Boolean(fixture.label);
  const statusLabel =
    fixture.status === "scheduled"
      ? "Scheduled"
      : fixture.status === "live"
        ? "Live"
        : fixture.status === "finished"
          ? "Full time"
          : fixture.status;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.35) }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-colors hover:border-emerald-400/30 sm:p-5",
        fixture.stage === "final" && "border-amber-400/30 hover:border-amber-400/50",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {fixture.group && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
              Group {fixture.group}
            </Badge>
          )}
          {fixture.matchday && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">
              MD {fixture.matchday}
            </Badge>
          )}
          {fixture.stage !== "group" && (
            <Badge variant="accent" className="text-[10px] uppercase tracking-widest">
              {STAGE_LABEL[fixture.stage]}
            </Badge>
          )}
          <Badge
            variant={
              fixture.status === "live"
                ? "destructive"
                : fixture.status === "finished"
                  ? "primary"
                  : "default"
            }
            className="text-[10px] uppercase tracking-widest"
          >
            {statusLabel}
          </Badge>
        </div>
        <time dateTime={fixture.kickoffUtc} className="text-xs font-semibold text-emerald-300">
          {formatKickoffUtc(fixture.kickoffUtc)}
        </time>
      </div>

      {isKnockoutMilestone ? (
        <motion.div className="mt-4 flex items-center gap-3 py-2">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30">
            <Trophy className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight">{fixture.label}</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Teams confirmed after the group stage
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 flex items-center gap-2">
          <TeamRow
            teamId={fixture.homeTeamId}
            side="home"
            isHighlight={highlightTeamId === fixture.homeTeamId}
          />
          <div className="flex shrink-0 flex-col items-center px-1">
            {fixture.score ? (
              <p className="text-xl font-black tabular-nums tracking-tight">
                {fixture.score.home}
                <span className="mx-1 text-[var(--muted-foreground)]">–</span>
                {fixture.score.away}
              </p>
            ) : (
              <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                vs
              </span>
            )}
          </div>
          <TeamRow
            teamId={fixture.awayTeamId}
            side="away"
            isHighlight={highlightTeamId === fixture.awayTeamId}
          />
        </div>
      )}

      <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-300/80" />
        <span>
          {fixture.venue.name} · {fixture.venue.city}, {fixture.venue.country}
        </span>
      </p>
    </motion.article>
  );
}
