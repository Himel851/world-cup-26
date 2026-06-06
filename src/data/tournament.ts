import { GROUP_STAGE_FIXTURES } from "@/data/fixtures/group-stage";
import { KNOCKOUT_FIXTURES } from "@/data/fixtures/knockout";
import { WC26_VENUES } from "@/data/venues";
import { TEAMS, GROUPS } from "@/data/teams";

/** Opening match kickoff — Mexico vs South Africa, Group A (Bangladesh Standard Time). */
export const TOURNAMENT_KICKOFF = "2026-06-12T01:00:00+06:00";

export const OPENING_MATCH = GROUP_STAGE_FIXTURES.find((f) => f.id === "wc26-001")!;

export const TOURNAMENT_STATS = {
  nations: TEAMS.length,
  groups: GROUPS.length,
  groupMatches: GROUP_STAGE_FIXTURES.length,
  knockoutMatches: KNOCKOUT_FIXTURES.length,
  totalMatches: GROUP_STAGE_FIXTURES.length + KNOCKOUT_FIXTURES.length,
  hostVenues: Object.keys(WC26_VENUES).length,
  hostCountries: 3,
} as const;
