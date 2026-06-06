import { TEAMS, TEAMS_BY_ID } from "@/data/teams";
import { fifaFlagUrl } from "@/data/fifa-country-codes";
import { fetchFifaRankings } from "@/lib/fifa-rankings";
import type { FifaRankingEntry } from "@/types/fifa-rankings";
import type { Team, TeamRanking, TeamWithRanking } from "@/types";

function toRanking(entry: FifaRankingEntry): TeamRanking {
  return {
    rank: entry.rank,
    prevRank: entry.prevRank,
    movement: entry.movement,
    points: entry.points,
    prevPoints: entry.prevPoints,
    ratedMatches: entry.ratedMatches,
    confederation: entry.confederation,
  };
}

function mergeTeam(team: Team, entry?: FifaRankingEntry): TeamWithRanking {
  return {
    ...team,
    name: entry?.name ?? team.name,
    flag: entry ? entryFlagFromRanking(entry) : team.flag,
    ranking: entry ? toRanking(entry) : null,
  };
}

function entryFlagFromRanking(entry: FifaRankingEntry): string {
  return fifaFlagUrl(entry.idCountry);
}

function indexRankings(rankings: FifaRankingEntry[]) {
  const byFifa = new Map<string, FifaRankingEntry>();
  const byTeamId = new Map<string, FifaRankingEntry>();
  for (const r of rankings) {
    byFifa.set(r.idCountry, r);
    if (r.teamId) byTeamId.set(r.teamId, r);
  }
  return { byFifa, byTeamId };
}

function lookupRanking(
  team: Team,
  byFifa: Map<string, FifaRankingEntry>,
  byTeamId: Map<string, FifaRankingEntry>,
): FifaRankingEntry | undefined {
  return byTeamId.get(team.id) ?? byFifa.get(team.fifaCode);
}

export async function getTeamsWithRankings(): Promise<TeamWithRanking[]> {
  const rankings = await fetchFifaRankings();
  const { byFifa, byTeamId } = indexRankings(rankings);

  return TEAMS.map((team) => mergeTeam(team, lookupRanking(team, byFifa, byTeamId))).sort(
    (a, b) => (a.ranking?.rank ?? 9999) - (b.ranking?.rank ?? 9999),
  );
}

export async function getTeamWithRanking(id: string): Promise<TeamWithRanking | undefined> {
  const team = TEAMS_BY_ID[id];
  if (!team) return undefined;

  const rankings = await fetchFifaRankings();
  const { byFifa, byTeamId } = indexRankings(rankings);
  return mergeTeam(team, lookupRanking(team, byFifa, byTeamId));
}

export async function getRankingsMap(): Promise<Map<string, TeamRanking>> {
  const teams = await getTeamsWithRankings();
  return new Map(
    teams.filter((t) => t.ranking).map((t) => [t.id, t.ranking!]),
  );
}

export function formatRank(team: TeamWithRanking): string {
  return team.ranking ? `#${team.ranking.rank}` : "—";
}

export function formatPoints(team: TeamWithRanking): string {
  return team.ranking ? team.ranking.points.toFixed(2) : "—";
}
