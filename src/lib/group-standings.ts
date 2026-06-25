import { getTeamsByGroup, GROUPS } from "@/data/teams";
import type { Fixture, GroupLetter } from "@/types";

export type MatchFormResult = "W" | "D" | "L";

export interface GroupStandingRow {
  teamId: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** Group-stage results in matchday order (up to 3). */
  form: (MatchFormResult | null)[];
}

export interface ThirdPlaceStandingRow extends GroupStandingRow {
  group: GroupLetter;
  /** Top 8 third-placed teams advance to the Round of 32. */
  qualifies: boolean;
}

export type GroupStandingsMap = Record<GroupLetter, GroupStandingRow[]>;

/** Number of third-placed teams that join the Round of 32. */
export const THIRD_PLACE_ADVANCERS = 8;

function resultForTeam(
  fixture: Fixture,
  teamId: string,
): MatchFormResult | null {
  if (fixture.status !== "finished" || !fixture.score) return null;

  const { home, away } = fixture.score;
  const isHome = fixture.homeTeamId === teamId;
  const isAway = fixture.awayTeamId === teamId;
  if (!isHome && !isAway) return null;

  const gf = isHome ? home : away;
  const ga = isHome ? away : home;
  if (gf == null || ga == null) return null;

  if (gf > ga) return "W";
  if (gf < ga) return "L";
  return "D";
}

function compareRows(a: GroupStandingRow, b: GroupStandingRow): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.teamId.localeCompare(b.teamId);
}

export function computeGroupStandings(
  fixtures: Fixture[],
  group: GroupLetter,
): GroupStandingRow[] {
  const teams = getTeamsByGroup(group);
  const groupFixtures = fixtures
    .filter((f) => f.stage === "group" && f.group === group)
    .sort(
      (a, b) =>
        (a.matchday ?? 0) - (b.matchday ?? 0) ||
        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );

  const rows: GroupStandingRow[] = teams.map((team) => {
    let played = 0;
    let won = 0;
    let drawn = 0;
    let lost = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    const form: (MatchFormResult | null)[] = [null, null, null];

    for (const fixture of groupFixtures) {
      const isHome = fixture.homeTeamId === team.id;
      const isAway = fixture.awayTeamId === team.id;
      if (!isHome && !isAway) continue;

      const outcome = resultForTeam(fixture, team.id);
      const matchday = (fixture.matchday ?? 1) - 1;
      if (matchday >= 0 && matchday < 3) {
        form[matchday] = outcome;
      }

      if (fixture.status !== "finished" || !fixture.score) continue;

      const { home, away } = fixture.score;
      const gf = isHome ? home : away;
      const ga = isHome ? away : home;
      if (gf == null || ga == null) continue;

      played += 1;
      goalsFor += gf;
      goalsAgainst += ga;

      if (gf > ga) won += 1;
      else if (gf < ga) lost += 1;
      else drawn += 1;
    }

    return {
      teamId: team.id,
      rank: 0,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
      form,
    };
  });

  rows.sort(compareRows);
  return rows.map((row, i) => ({ ...row, rank: i + 1 }));
}

export function computeAllGroupStandings(fixtures: Fixture[]): GroupStandingsMap {
  return Object.fromEntries(
    GROUPS.map((group) => [group, computeGroupStandings(fixtures, group)]),
  ) as GroupStandingsMap;
}

/** Rank all 12 third-placed teams; top 8 advance to the Round of 32. */
export function computeThirdPlaceRanking(fixtures: Fixture[]): ThirdPlaceStandingRow[] {
  const all = computeAllGroupStandings(fixtures);

  const thirdPlacers = GROUPS.map((group) => {
    const row = all[group][2];
    if (!row) return null;
    return { ...row, group };
  }).filter((row): row is GroupStandingRow & { group: GroupLetter } => row != null);

  thirdPlacers.sort(compareRows);

  return thirdPlacers.map((row, index) => ({
    ...row,
    rank: index + 1,
    qualifies: index < THIRD_PLACE_ADVANCERS,
  }));
}
