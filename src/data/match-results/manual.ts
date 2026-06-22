import type { MatchDetailExtras } from "@/types/match-detail";

/**
 * Manual match detail — goal scorers & stats (football-data.org free tier has no events).
 * Add an entry after each match finishes.
 */
export const MANUAL_MATCH_DETAILS: Record<string, MatchDetailExtras> = {
  // Example structure — replace with real data when matches finish:
  // "wc26-001": {
  //   score: { home: 2, away: 1 },
  //   status: "finished",
  //   htScore: { home: 1, away: 0 },
  //   events: [
  //     { minute: 23, type: "goal", teamId: "mex", player: "Lozano", assist: "Álvarez" },
  //   ],
  //   stats: {
  //     home: { possession: 58, shots: 14, shotsOnTarget: 6, corners: 7, fouls: 11 },
  //     away: { possession: 42, shots: 9, shotsOnTarget: 3, corners: 4, fouls: 14 },
  //   },
  // },
};
