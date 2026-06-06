export type FifaRankingTeamName = {
  Locale: string;
  Description: string;
};

export type FifaRankingResult = {
  IdTeam: string;
  TeamName: FifaRankingTeamName[];
  Gender: number;
  IdConfederation: string;
  RankingMovement: number;
  ConfederationName: string;
  IdCountry: string;
  RatedMatches: number;
  Rank: number;
  PrevRank: number;
  TotalPoints: number;
  PrevPoints: number;
  RankingStatus: number;
};

export type FifaRankingsResponse = {
  ContinuationToken: string | null;
  ContinuationHash: string | null;
  Results: FifaRankingResult[];
};

export type FifaRankingEntry = {
  idTeam: string;
  name: string;
  idCountry: string;
  confederation: string;
  rank: number;
  prevRank: number;
  movement: number;
  points: number;
  prevPoints: number;
  ratedMatches: number;
  /** Link to /teams/[id] when nation is in WC26 squad list */
  teamId?: string;
  flagCode: string;
};

export type MovementFilter = "all" | "up" | "down" | "unchanged";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
