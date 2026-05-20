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
        "flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/[0.06] sm:gap-2.5 sm:rounded-xl sm:p-2",
        side === "away" && "flex-row-reverse text-right",
        isHighlight && "bg-emerald-400/10 ring-1 ring-emerald-400/25",
      )}
    >
      <div className="relative h-8 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10 sm:h-9 sm:w-12">
        <Image src={team.flag} alt="" fill sizes="(max-width:640px) 40px, 48px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold sm:text-sm">{team.name}</p>
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
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl transition-colors hover:border-emerald-400/30 sm:p-5",
        fixture.stage === "final" && "border-amber-400/30 hover:border-amber-400/50",
        className,
      )}
    >
      <div className="flex flex-col gap-2 border-b border-white/10 pb-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2 sm:pb-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
          {fixture.group && (
            <Badge variant="outline" className="text-[9px] uppercase tracking-widest sm:text-[10px]">
              Group {fixture.group}
            </Badge>
          )}
          {fixture.matchday && (
            <Badge variant="secondary" className="text-[9px] uppercase tracking-widest sm:text-[10px]">
              MD {fixture.matchday}
            </Badge>
          )}
          {fixture.stage !== "group" && (
            <Badge variant="accent" className="max-w-full text-[9px] uppercase tracking-widest sm:text-[10px]">
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
            className="text-[9px] uppercase tracking-widest sm:text-[10px]"
          >
            {statusLabel}
          </Badge>
        </div>
        <time
          dateTime={fixture.kickoffUtc}
          className="shrink-0 text-[11px] font-semibold tabular-nums text-emerald-300 sm:text-xs"
        >
          {formatKickoffUtc(fixture.kickoffUtc)}
        </time>
      </div>

      {isKnockoutMilestone ? (
        <motion.div className="mt-3 flex items-center gap-2.5 py-1 sm:mt-4 sm:gap-3 sm:py-2">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 sm:h-12 sm:w-12 sm:rounded-xl">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold leading-tight tracking-tight sm:text-lg">{fixture.label}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Teams confirmed after the group stage
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="mt-3 flex items-center gap-1.5 sm:mt-4 sm:gap-2">
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

      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground sm:mt-4 sm:items-center sm:text-xs">
        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-sky-300/80 sm:mt-0 sm:h-3.5 sm:w-3.5" />
        <span className="min-w-0 break-words">
          {fixture.venue.name} · {fixture.venue.city}, {fixture.venue.country}
        </span>
      </p>
    </motion.article>
  );
}
