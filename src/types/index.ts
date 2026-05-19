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
  code: string; // ISO 3166-1 alpha-2 (for placeholder flag urls)
  flag: string;
  continent: Continent;
  fifaRanking: number;
  captain: string;
  group: GroupLetter;
  stadium: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
  stats?: {
    worldCupTitles: number;
    appearances: number;
    bestFinish: string;
  };
}

export type QuizType =
  | "flag"
  | "captain"
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
