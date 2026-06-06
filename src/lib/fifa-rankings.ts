import { fifaFlagUrl, fifaTeamId } from "@/data/fifa-country-codes";
import type {
  FifaRankingEntry,
  FifaRankingResult,
  FifaRankingsResponse,
} from "@/types/fifa-rankings";

export const FIFA_RANKINGS_URL =
  "https://api.fifa.com/api/v3/fifarankings/rankings/live?gender=1&sportType=0&language=en";

function teamName(result: FifaRankingResult): string {
  const en =
    result.TeamName.find((t) => t.Locale.startsWith("en"))?.Description ??
    result.TeamName[0]?.Description;
  return en ?? result.IdCountry;
}

function normalize(result: FifaRankingResult): FifaRankingEntry {
  const idCountry = result.IdCountry.toUpperCase();
  return {
    idTeam: result.IdTeam,
    name: teamName(result),
    idCountry,
    confederation: result.ConfederationName,
    rank: result.Rank,
    prevRank: result.PrevRank,
    movement: result.RankingMovement,
    points: result.TotalPoints,
    prevPoints: result.PrevPoints,
    ratedMatches: result.RatedMatches,
    teamId: fifaTeamId(idCountry),
    flagCode: idCountry,
  };
}

export async function fetchFifaRankings(): Promise<FifaRankingEntry[]> {
  const res = await fetch(FIFA_RANKINGS_URL, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`FIFA rankings fetch failed: ${res.status}`);
  }

  const data = (await res.json()) as FifaRankingsResponse;
  return data.Results.map(normalize).sort((a, b) => a.rank - b.rank);
}

export function entryFlagUrl(entry: FifaRankingEntry): string {
  return fifaFlagUrl(entry.idCountry);
}

export function confederationsFromRankings(rankings: FifaRankingEntry[]): string[] {
  return [...new Set(rankings.map((r) => r.confederation))].sort();
}
