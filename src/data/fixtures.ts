import { GROUP_STAGE_FIXTURES } from "@/data/fixtures/group-stage";
import { KNOCKOUT_MILESTONES } from "@/data/fixtures/knockout";
import type { Fixture, GroupLetter } from "@/types";

/** All 72 official group-stage matches. */
export const GROUP_FIXTURES = GROUP_STAGE_FIXTURES;

/** Knockout phase milestones (teams TBD). */
export const KNOCKOUT_FIXTURES = KNOCKOUT_MILESTONES;

/** Group stage + knockout timeline for the fixtures page. */
export const FIXTURES: Fixture[] = [...GROUP_STAGE_FIXTURES, ...KNOCKOUT_MILESTONES];

export const FIXTURES_BY_ID: Record<string, Fixture> = Object.fromEntries(
  FIXTURES.map((f) => [f.id, f]),
);

export function getFixtureById(id: string): Fixture | undefined {
  return FIXTURES_BY_ID[id];
}

export function getFixturesForTeam(teamId: string): Fixture[] {
  return GROUP_STAGE_FIXTURES.filter(
    (f) => f.homeTeamId === teamId || f.awayTeamId === teamId,
  );
}

export function getFixturesForGroup(group: GroupLetter): Fixture[] {
  return GROUP_STAGE_FIXTURES.filter((f) => f.group === group);
}
