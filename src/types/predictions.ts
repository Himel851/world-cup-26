import type { GroupLetter, MatchStage } from "@/types";

/** Team ids ordered 1st → 4th within a group. Empty string = unassigned. */
export type GroupStanding = [string, string, string, string];

export type GroupPredictions = Record<GroupLetter, GroupStanding>;

export interface TournamentPrediction {
  groups: GroupPredictions;
  /** Exactly 8 third-place team ids selected to advance. */
  thirdPlaceAdvancers: string[];
  /** Knockout match id → predicted winner team id. */
  knockoutWinners: Record<string, string>;
}

export type PredictionStep = "groups" | "third_place" | "knockout";

export interface BracketMatch {
  id: string;
  stage: MatchStage;
  label: string;
  /** Parent match ids whose winners feed this slot (empty for R32). */
  feedsFrom: [string | null, string | null];
}
