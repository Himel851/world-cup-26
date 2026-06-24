import { FixtureMatchRow, FixtureRowMeta } from "@/components/fixtures/FixtureCard";
import { FIXTURE_KICKOFF_TIMEZONE } from "@/lib/utils";
import type { Fixture, GroupMatchday } from "@/types";

const STAGE_LABEL: Record<Fixture["stage"], string> = {
  group: "Group stage",
  round_of_32: "Round of 32",
  round_of_16: "Round of 16",
  quarter: "Quarter-finals",
  semi: "Semi-finals",
  third_place: "Third place play-off",
  final: "Final",
};

function formatDayShort(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    timeZone: FIXTURE_KICKOFF_TIMEZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function daySectionTitle(fixtures: Fixture[]): string {
  if (fixtures.length === 0) return "Fixtures";

  const stage = fixtures[0]!.stage;
  if (stage === "group") {
    const matchdays = new Set(
      fixtures.map((f) => f.matchday).filter((md): md is GroupMatchday => md != null),
    );
    if (matchdays.size === 1) {
      return `Matchday ${[...matchdays][0]} · Group stage`;
    }
    return "Group stage";
  }

  if (fixtures.every((f) => f.stage === stage)) {
    return STAGE_LABEL[stage];
  }

  return "Knockout phase";
}

interface FixtureDaySectionProps {
  dateKey: string;
  fixtures: Fixture[];
  highlightTeamId?: string;
  sectionId?: string;
  isToday?: boolean;
  isUpNext?: boolean;
}

export function FixtureDaySection({
  dateKey,
  fixtures,
  highlightTeamId,
  sectionId,
  isToday,
  isUpNext,
}: FixtureDaySectionProps) {
  const kickoff = fixtures[0]?.kickoffUtc ?? dateKey;
  const title = daySectionTitle(fixtures);

  return (
    <section id={sectionId} className="scroll-mt-24 sm:scroll-mt-28">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs text-muted-foreground sm:text-sm">
          {formatDayShort(kickoff)}
        </p>
        {isToday && (
          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/35">
            Today
          </span>
        )}
        {isUpNext && (
          <span className="rounded-full bg-sky-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300 ring-1 ring-sky-400/35">
            Up next
          </span>
        )}
      </div>
      <h2 className="mt-0.5 text-base font-bold tracking-tight text-foreground sm:text-lg">
        {title}
      </h2>

      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:mt-4">
        <ul className="divide-y divide-white/8">
          {fixtures.map((fixture) => (
            <li key={fixture.id}>
              <FixtureMatchRow fixture={fixture} highlightTeamId={highlightTeamId} />
              <FixtureRowMeta fixture={fixture} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
