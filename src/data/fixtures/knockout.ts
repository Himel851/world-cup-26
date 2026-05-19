import { WC26_VENUES } from "@/data/venues";
import type { Fixture } from "@/types";

/**
 * Knockout phase timeline (teams TBD until bracket is set).
 * Dates per FIFA World Cup 2026 calendar.
 */
export const KNOCKOUT_MILESTONES: Fixture[] = [
  {
    id: "wc26-ko-r32",
    homeTeamId: "",
    awayTeamId: "",
    stage: "round_of_32",
    kickoffUtc: "2026-06-28T16:00:00.000Z",
    venue: WC26_VENUES.metlife,
    status: "scheduled",
    label: "Round of 32 · Jun 28 – Jul 3",
  },
  {
    id: "wc26-ko-r16",
    homeTeamId: "",
    awayTeamId: "",
    stage: "round_of_16",
    kickoffUtc: "2026-07-04T16:00:00.000Z",
    venue: WC26_VENUES.att,
    status: "scheduled",
    label: "Round of 16 · Jul 4 – Jul 7",
  },
  {
    id: "wc26-ko-qf",
    homeTeamId: "",
    awayTeamId: "",
    stage: "quarter",
    kickoffUtc: "2026-07-09T16:00:00.000Z",
    venue: WC26_VENUES.mercedes,
    status: "scheduled",
    label: "Quarter-finals · Jul 9 – Jul 11",
  },
  {
    id: "wc26-ko-sf",
    homeTeamId: "",
    awayTeamId: "",
    stage: "semi",
    kickoffUtc: "2026-07-14T16:00:00.000Z",
    venue: WC26_VENUES.att,
    status: "scheduled",
    label: "Semi-finals · Jul 14 – Jul 15",
  },
  {
    id: "wc26-ko-3rd",
    homeTeamId: "",
    awayTeamId: "",
    stage: "third_place",
    kickoffUtc: "2026-07-18T20:00:00.000Z",
    venue: WC26_VENUES.hardRock,
    status: "scheduled",
    label: "Third-place match · Jul 18",
  },
  {
    id: "wc26-ko-final",
    homeTeamId: "",
    awayTeamId: "",
    stage: "final",
    kickoffUtc: "2026-07-19T20:00:00.000Z",
    venue: WC26_VENUES.metlife,
    status: "scheduled",
    label: "FIFA World Cup Final · Jul 19",
  },
];
