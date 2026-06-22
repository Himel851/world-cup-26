import { FIXTURES, getFixtureById } from "@/data/fixtures";
import { MANUAL_MATCH_DETAILS } from "@/data/match-results/manual";
import { TEAMS, TEAMS_BY_ID } from "@/data/teams";
import { getWorldCupMatches } from "@/lib/football-data";
import { FIXTURE_KICKOFF_TIMEZONE } from "@/lib/utils";
import type { FdMatch } from "@/types/football-data";
import type { MatchDetail, MatchDetailExtras } from "@/types/match-detail";
import type { Fixture, MatchStatus, Team } from "@/types";

/** FIFA code aliases for matching football-data `tla` fields. */
const TLA_ALIASES: Record<string, string[]> = {
  MEX: ["MEX"],
  RSA: ["RSA", "ZAF", "SAF"],
  KOR: ["KOR", "KOR"],
  CZE: ["CZE"],
  NED: ["NED", "NLD"],
  SUI: ["SUI", "SWI"],
  SCO: ["SCO", "SCT"],
  USA: ["USA", "US"],
  ENG: ["ENG", "GB-ENG"],
  // ... others default to fifaCode
};

function tlaMatchesFifa(tla: string | null, fifaCode: string): boolean {
  if (!tla) return false;
  const aliases = TLA_ALIASES[fifaCode] ?? [fifaCode];
  return aliases.includes(tla.toUpperCase());
}

function dateKeyInBst(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: FIXTURE_KICKOFF_TIMEZONE });
}

function mapFdStatus(status: FdMatch["status"]): MatchStatus {
  switch (status) {
    case "IN_PLAY":
    case "PAUSED":
      return "live";
    case "FINISHED":
      return "finished";
    case "POSTPONED":
      return "postponed";
    case "CANCELLED":
    case "SUSPENDED":
      return "cancelled";
    default:
      return "scheduled";
  }
}

function findTeamByTla(
  tla: string | null,
  name: string | null | undefined,
  shortName?: string | null,
): Team | undefined {
  if (tla) {
    const byCode = TEAMS.find((t) => tlaMatchesFifa(tla, t.fifaCode));
    if (byCode) return byCode;
  }
  const label = name ?? shortName;
  if (!label) return undefined;
  const lower = label.toLowerCase();
  return TEAMS.find(
    (t) => t.name.toLowerCase() === lower || t.name.toLowerCase().includes(lower),
  );
}

function matchKey(homeId: string, awayId: string, dateKey: string): string {
  return `${dateKey}:${homeId}:${awayId}`;
}

function buildFdLookup(matches: FdMatch[]): Map<string, FdMatch> {
  const map = new Map<string, FdMatch>();
  for (const m of matches) {
    const home = findTeamByTla(m.homeTeam.tla, m.homeTeam.name, m.homeTeam.shortName);
    const away = findTeamByTla(m.awayTeam.tla, m.awayTeam.name, m.awayTeam.shortName);
    if (!home || !away) continue;
    const key = matchKey(home.id, away.id, dateKeyInBst(m.utcDate));
    map.set(key, m);
    map.set(matchKey(away.id, home.id, dateKeyInBst(m.utcDate)), m);
  }
  return map;
}

function applyFdMatch(fixture: Fixture, fd: FdMatch): Fixture {
  const home = fd.score.fullTime.home;
  const away = fd.score.fullTime.away;
  const status = mapFdStatus(fd.status);

  return {
    ...fixture,
    status,
    score:
      home != null && away != null
        ? { home, away }
        : fixture.score,
  };
}

function applyManual(fixture: Fixture, manual: MatchDetailExtras): Fixture {
  return {
    ...fixture,
    status: manual.status ?? fixture.status,
    score: manual.score ?? fixture.score,
  };
}

function findFdForFixture(fixture: Fixture, lookup: Map<string, FdMatch>): FdMatch | undefined {
  if (!fixture.homeTeamId || !fixture.awayTeamId) return undefined;
  const key = matchKey(fixture.homeTeamId, fixture.awayTeamId, dateKeyInBst(fixture.kickoffUtc));
  return lookup.get(key);
}

export async function getEnrichedFixtures(): Promise<Fixture[]> {
  const fdMatches = await getWorldCupMatches();
  const lookup = buildFdLookup(fdMatches);

  return FIXTURES.map((fixture) => {
    let enriched = { ...fixture };
    const fd = findFdForFixture(fixture, lookup);
    if (fd) enriched = applyFdMatch(enriched, fd);

    const manual = MANUAL_MATCH_DETAILS[fixture.id];
    if (manual) enriched = applyManual(enriched, manual);

    return enriched;
  });
}

export async function getMatchDetail(fixtureId: string): Promise<MatchDetail | null> {
  const base = getFixtureById(fixtureId);
  if (!base) return null;

  const fdMatches = await getWorldCupMatches();
  const lookup = buildFdLookup(fdMatches);
  const fd = findFdForFixture(base, lookup);
  const manual = MANUAL_MATCH_DETAILS[fixtureId];

  let fixture = { ...base };
  let scoresSource: MatchDetail["sources"]["scores"] = "scheduled";

  if (fd) {
    fixture = applyFdMatch(fixture, fd);
    scoresSource = "football-data";
  }
  if (manual) {
    fixture = applyManual(fixture, manual);
    if (manual.score) scoresSource = "manual";
  }

  const htScore =
    manual?.htScore ??
    (fd?.score.halfTime.home != null && fd?.score.halfTime.away != null
      ? { home: fd.score.halfTime.home, away: fd.score.halfTime.away }
      : undefined);

  const events = manual?.events ?? [];
  const stats = manual?.stats ?? null;

  return {
    fixture,
    events,
    stats,
    htScore,
    sources: {
      scores: scoresSource,
      detail: events.length > 0 || stats ? "manual" : "none",
    },
  };
}

export function getTodayFixtures(fixtures: Fixture[], now = new Date()): Fixture[] {
  const todayKey = now.toLocaleDateString("en-CA", { timeZone: FIXTURE_KICKOFF_TIMEZONE });
  return fixtures
    .filter((f) => dateKeyInBst(f.kickoffUtc) === todayKey)
    .sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());
}

export function getTeamForFixtureSide(fixture: Fixture, side: "home" | "away") {
  const id = side === "home" ? fixture.homeTeamId : fixture.awayTeamId;
  return id ? TEAMS_BY_ID[id] : undefined;
}
