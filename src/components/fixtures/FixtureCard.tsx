import Image from "next/image";
import Link from "next/link";

import { TEAMS_BY_ID } from "@/data/teams";
import { cn, formatKickoffTime } from "@/lib/utils";
import type { Fixture } from "@/types";

interface FixtureMatchRowProps {
  fixture: Fixture;
  highlightTeamId?: string;
  className?: string;
}

function TeamSide({
  teamId,
  align,
  highlight,
  linkable = true,
}: {
  teamId: string;
  align: "home" | "away";
  highlight: boolean;
  linkable?: boolean;
}) {
  const team = TEAMS_BY_ID[teamId];
  if (!team) return null;

  const isHome = align === "home";

  const content = (
    <>
      {isHome && (
        <span
          className="min-w-0 truncate text-xs font-semibold leading-tight text-foreground group-hover/side:text-emerald-200 sm:text-sm"
          title={team.name}
        >
          {team.name}
        </span>
      )}
      <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/15 sm:h-7 sm:w-10 sm:rounded-md">
        <Image
          src={team.flag}
          alt=""
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      {!isHome && (
        <span
          className="min-w-0 truncate text-xs font-semibold leading-tight text-foreground group-hover/side:text-emerald-200 sm:text-sm"
          title={team.name}
        >
          {team.name}
        </span>
      )}
    </>
  );

  const className = cn(
    "group/side flex min-w-0 flex-1 items-center gap-2 py-3 transition-colors sm:gap-2.5 sm:py-3.5",
    isHome ? "justify-end text-right" : "justify-start text-left",
    highlight && "rounded-lg bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/25",
  );

  if (!linkable) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={`/teams/${team.id}`} className={className} onClick={(e) => e.stopPropagation()}>
      {content}
    </Link>
  );
}

function TimePill({ fixture }: { fixture: Fixture }) {
  const isLive = fixture.status === "live";

  if (fixture.score) {
    return (
      <div className="flex flex-col items-center">
        <p className="rounded-full bg-white/10 px-3 py-1 text-sm font-black tabular-nums tracking-tight text-foreground sm:px-4 sm:text-base">
          {fixture.score.home}
          <span className="mx-1 text-muted-foreground">–</span>
          {fixture.score.away}
        </p>
        {fixture.penalties && (
          <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-amber-200/90">
            Pens {fixture.penalties.home}–{fixture.penalties.away}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <time
        dateTime={fixture.kickoffUtc}
        className={cn(
          "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide sm:px-4 sm:py-1.5 sm:text-xs",
          isLive
            ? "bg-rose-500 text-white shadow-sm shadow-rose-500/30"
            : "bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/25",
        )}
      >
        {formatKickoffTime(fixture.kickoffUtc)}
      </time>
      {isLive && (
        <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-rose-400">
          Live
        </span>
      )}
    </div>
  );
}

export function FixtureMatchRow({
  fixture,
  highlightTeamId,
  className,
}: FixtureMatchRowProps) {
  const isKnockoutPlaceholder = !fixture.homeTeamId && !fixture.awayTeamId;

  if (isKnockoutPlaceholder) {
    return (
      <article
        className={cn(
          "flex flex-col items-center gap-2 px-3 py-4 text-center sm:px-5 sm:py-5",
          className,
        )}
      >
        <TimePill fixture={fixture} />
        <p className="text-sm font-semibold text-foreground sm:text-base">
          {fixture.label ?? "Knockout match"}
        </p>
        <p className="text-[11px] text-muted-foreground">Opponents TBD</p>
      </article>
    );
  }

  return (
    <Link
      href={`/fixtures/${fixture.id}`}
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 transition-colors hover:bg-white/[0.03] sm:gap-3 sm:px-5",
        className,
      )}
    >
      <TeamSide
        teamId={fixture.homeTeamId}
        align="home"
        highlight={highlightTeamId === fixture.homeTeamId}
        linkable={false}
      />
      <div className="flex shrink-0 justify-center px-1">
        <TimePill fixture={fixture} />
      </div>
      <TeamSide
        teamId={fixture.awayTeamId}
        align="away"
        highlight={highlightTeamId === fixture.awayTeamId}
        linkable={false}
      />
    </Link>
  );
}

/** @deprecated Use FixtureMatchRow inside FixtureDaySection */
export function FixtureCard(props: FixtureMatchRowProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <FixtureMatchRow {...props} />
      <FixtureRowMeta fixture={props.fixture} />
    </div>
  );
}

export function FixtureRowMeta({ fixture }: { fixture: Fixture }) {
  return (
    <p className="border-t border-white/8 px-3 py-2 text-center text-[10px] text-muted-foreground sm:px-5 sm:text-[11px]">
      {fixture.venue.name} · {fixture.venue.city}
      {fixture.group && (
        <span className="text-emerald-300/80"> · Group {fixture.group}</span>
      )}
      {fixture.matchday && (
        <span className="text-sky-300/80"> · MD {fixture.matchday}</span>
      )}
    </p>
  );
}
