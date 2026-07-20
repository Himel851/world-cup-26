import { KNOCKOUT_FIXTURES } from "@/data/fixtures/knockout";
import { FINAL_MATCH_ID, THIRD_PLACE_MATCH_ID } from "@/lib/bracket";
import type { Fixture } from "@/types";
import type { GroupPredictions, TournamentPrediction } from "@/types/predictions";

/** Final group standings — consistent with Round of 32 third-place advancers. */
const OFFICIAL_GROUP_STANDINGS: GroupPredictions = {
  A: ["mex", "rsa", "kor", "cze"],
  B: ["swi", "can", "bih", "qat"],
  C: ["bra", "mar", "sct", "hai"],
  D: ["aus", "tur", "par", "usa"],
  E: ["ger", "civ", "ecu", "cuw"],
  F: ["ned", "jpn", "swe", "tun"],
  G: ["bel", "egy", "irn", "nzl"],
  H: ["esp", "ksa", "cpv", "uru"],
  I: ["fra", "nor", "sen", "irq"],
  J: ["arg", "aut", "alg", "jor"],
  K: ["col", "por", "cod", "uzb"],
  L: ["eng", "cro", "gha", "pan"],
};

const OFFICIAL_THIRD_PLACE_ADVANCERS = [
  "par",
  "swe",
  "ecu",
  "cod",
  "sen",
  "bih",
  "alg",
  "cpv",
] as const;

function bracketIdToFixtureId(matchId: string): string {
  if (matchId === FINAL_MATCH_ID) return "wc26-ko-final";
  if (matchId === THIRD_PLACE_MATCH_ID) return "wc26-ko-3rd";
  return `wc26-ko-${matchId}`;
}

function fixtureIdToBracketId(fixtureId: string): string {
  if (fixtureId === "wc26-ko-final") return FINAL_MATCH_ID;
  if (fixtureId === "wc26-ko-3rd") return THIRD_PLACE_MATCH_ID;
  return fixtureId.replace("wc26-ko-", "");
}

export function getFixtureWinner(fixture: Fixture): string | null {
  if (fixture.status !== "finished" || !fixture.score) return null;

  if (fixture.penalties) {
    const { home, away } = fixture.penalties;
    if (home == null || away == null) return null;
    if (home > away) return fixture.homeTeamId;
    if (away > home) return fixture.awayTeamId;
    return null;
  }

  const { home, away } = fixture.score;
  if (home == null || away == null) return null;
  if (home > away) return fixture.homeTeamId;
  if (away > home) return fixture.awayTeamId;
  return null;
}

export function buildOfficialKnockoutWinners(): Record<string, string> {
  const winners: Record<string, string> = {};

  for (const fixture of KNOCKOUT_FIXTURES) {
    const winner = getFixtureWinner(fixture);
    if (!winner) continue;
    winners[fixtureIdToBracketId(fixture.id)] = winner;
  }

  return winners;
}

export function getOfficialKnockoutSides(matchId: string): [string, string] {
  const fixture = KNOCKOUT_FIXTURES.find(
    (f) => f.id === bracketIdToFixtureId(matchId),
  );
  if (!fixture) return ["", ""];
  return [fixture.homeTeamId ?? "", fixture.awayTeamId ?? ""];
}

export function isOfficialKnockoutMatchReady(matchId: string): boolean {
  const [home, away] = getOfficialKnockoutSides(matchId);
  return Boolean(home && away);
}

export function buildOfficialTournamentPrediction(): TournamentPrediction {
  return {
    groups: { ...OFFICIAL_GROUP_STANDINGS },
    thirdPlaceAdvancers: [...OFFICIAL_THIRD_PLACE_ADVANCERS],
    knockoutWinners: buildOfficialKnockoutWinners(),
  };
}
