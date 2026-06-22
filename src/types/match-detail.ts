export type MatchEventType =
  | "goal"
  | "penalty"
  | "own_goal"
  | "yellow_card"
  | "red_card"
  | "substitution";

export interface MatchEvent {
  minute: number;
  extraMinute?: number;
  type: MatchEventType;
  teamId: string;
  player: string;
  assist?: string;
  detail?: string;
}

export interface MatchTeamStats {
  possession?: number;
  shots?: number;
  shotsOnTarget?: number;
  corners?: number;
  fouls?: number;
  offsides?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface MatchDetailExtras {
  events?: MatchEvent[];
  stats?: { home: MatchTeamStats; away: MatchTeamStats };
  htScore?: { home: number; away: number };
  /** Override final score when API data is unavailable */
  score?: { home: number; away: number };
  status?: import("@/types").MatchStatus;
}

export interface MatchDetail {
  fixture: import("@/types").Fixture;
  events: MatchEvent[];
  stats: { home: MatchTeamStats; away: MatchTeamStats } | null;
  htScore?: { home: number; away: number };
  sources: {
    scores: "football-data" | "manual" | "scheduled";
    detail: "manual" | "none";
  };
}
