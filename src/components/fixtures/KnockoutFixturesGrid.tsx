"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";

import { TEAMS_BY_ID } from "@/data/teams";
import { cn, formatKickoffDate, formatKickoffTime } from "@/lib/utils";
import type { Fixture } from "@/types";

const STAGE_LABEL: Record<Fixture["stage"], string> = {
  group: "Group stage",
  round_of_32: "Round of 32",
  round_of_16: "Round of 16",
  quarter: "Quarter-finals",
  semi: "Semi-finals",
  third_place: "Third place play-off",
  final: "Final",
};

function TeamRow({
  teamId,
  highlight,
}: {
  teamId: string;
  highlight: boolean;
}) {
  const team = teamId ? TEAMS_BY_ID[teamId] : undefined;

  if (!team) {
    return (
      <div className="flex items-center gap-2.5 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10">
          <Shield className="h-4 w-4 text-muted-foreground/70" />
        </div>
        <span className="text-sm font-semibold italic text-muted-foreground">TBD</span>
      </div>
    );
  }

  return (
    <Link href={`/teams/${team.id}`} className="block hover:text-emerald-300">
      <div
        className={cn(
          "flex items-center gap-2.5 py-2 transition-colors",
          highlight && "rounded-lg bg-emerald-400/10 px-1 -mx-1",
        )}
      >
        <div className="relative h-8 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15">
          <Image src={team.flag} alt="" fill sizes="40px" className="object-cover" />
        </div>
        <span className="min-w-0 truncate text-sm font-semibold text-foreground">{team.name}</span>
      </div>
    </Link>
  );
}

function KnockoutMatchCard({
  fixture,
  highlightTeamId,
}: {
  fixture: Fixture;
  highlightTeamId?: string;
}) {
  const hasBothTeams = Boolean(fixture.homeTeamId && fixture.awayTeamId);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]/95">
      <div className="border-b border-white/8 bg-white/[0.03] px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {STAGE_LABEL[fixture.stage]}
        </p>
      </div>

      <div className="flex flex-1 gap-3 p-3 sm:p-4">
        <div className="min-w-0 flex-1 divide-y divide-white/8">
          <TeamRow teamId={fixture.homeTeamId} highlight={highlightTeamId === fixture.homeTeamId} />
          <TeamRow teamId={fixture.awayTeamId} highlight={highlightTeamId === fixture.awayTeamId} />
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-2 text-right">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">
              {formatKickoffDate(fixture.kickoffUtc)}
            </p>
            <p className="text-sm font-bold tabular-nums text-foreground">
              {formatKickoffTime(fixture.kickoffUtc)}
            </p>
            {fixture.score && (
              <p className="mt-1 text-base font-black tabular-nums">
                {fixture.score.home}–{fixture.score.away}
              </p>
            )}
          </div>
          {hasBothTeams && (
            <Link
              href={`/fixtures/${fixture.id}`}
              className="rounded-lg bg-white/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-foreground ring-1 ring-white/10 transition-colors hover:bg-white/12"
            >
              Match details
            </Link>
          )}
        </div>
      </div>

      <p className="border-t border-white/8 px-3 py-2 text-[10px] text-muted-foreground">
        {fixture.label ?? STAGE_LABEL[fixture.stage]} · {fixture.venue.city}
      </p>
    </article>
  );
}

interface KnockoutFixturesGridProps {
  fixtures: Fixture[];
  highlightTeamId?: string;
}

export function KnockoutFixturesGrid({
  fixtures,
  highlightTeamId,
}: KnockoutFixturesGridProps) {
  const byStage = React.useMemo(() => {
    const order: Fixture["stage"][] = [
      "round_of_32",
      "round_of_16",
      "quarter",
      "semi",
      "third_place",
      "final",
    ];
    const groups = new Map<Fixture["stage"], Fixture[]>();
    for (const f of fixtures) {
      const list = groups.get(f.stage) ?? [];
      list.push(f);
      groups.set(f.stage, list);
    }
    return order
      .filter((stage) => groups.has(stage))
      .map((stage) => ({
        stage,
        label: STAGE_LABEL[stage],
        fixtures: groups.get(stage)!.sort(
          (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
        ),
      }));
  }, [fixtures]);

  return (
    <div className="space-y-10">
      {byStage.map(({ stage, label, fixtures: stageFixtures }) => (
        <section key={stage}>
          <h2 className="mb-4 text-lg font-bold text-foreground sm:text-xl">{label}</h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {stageFixtures.map((fixture) => (
              <KnockoutMatchCard
                key={fixture.id}
                fixture={fixture}
                highlightTeamId={highlightTeamId}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
