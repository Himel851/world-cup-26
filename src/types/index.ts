export type Continent =
  | "Europe"
  | "South America"
  | "North America"
  | "Africa"
  | "Asia"
  | "Oceania";

export type GroupLetter =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  continent: Continent;
  group: GroupLetter;
  /** FIFA 3-letter country code for rankings API lookup */
  fifaCode: string;
}

export interface TeamRanking {
  rank: number;
  prevRank: number;
  movement: number;
  points: number;
  prevPoints: number;
  ratedMatches: number;
  confederation: string;
}

export type TeamWithRanking = Team & {
  ranking: TeamRanking | null;
};

export type QuizType =
  | "flag"
  | "ranking"
  | "continent"
  | "group";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: string;
  /** seconds */
  timeLimit: number;
  meta?: {
    teamId?: string;
    continent?: Continent;
    group?: GroupLetter;
  };
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  country: string;
  countryCode: string;
  score: number;
  streak: number;
  accuracy: number;
  badge?: "gold" | "silver" | "bronze" | "rising";
}

export interface QuizResultRecord {
  date: string;
  score: number;
  total: number;
  streak: number;
  accuracy: number;
  type: "standard" | "daily";
}

export type MatchStatus =
  | "scheduled"
  | "live"
  | "finished"
  | "postponed"
  | "cancelled";

export type MatchStage =
  | "group"
  | "round_of_32"
  | "round_of_16"
  | "quarter"
  | "semi"
  | "third_place"
  | "final";

export type GroupMatchday = 1 | 2 | 3;

export interface FixtureVenue {
  name: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
}

export interface Fixture {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  group?: GroupLetter;
  matchday?: GroupMatchday;
  stage: MatchStage;
  /** ISO 8601 datetime; data uses Bangladesh local wall time with `+06:00` offset. */
  kickoffUtc: string;
  venue: FixtureVenue;
  status: MatchStatus;
  score?: { home: number; away: number };
  /** Knockout rounds only — label when teams are TBD */
  label?: string;
}
