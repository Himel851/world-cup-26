export type FdMatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED"
  | "SUSPENDED";

export interface FdTeamRef {
  id: number;
  name: string | null;
  shortName: string | null;
  tla: string | null;
}

export interface FdScore {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration: string;
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: FdMatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: FdTeamRef;
  awayTeam: FdTeamRef;
  score: FdScore;
}

export interface FdMatchesResponse {
  matches: FdMatch[];
}
