import { WC26_VENUES, type VenueKey } from "@/data/venues";
import type { Fixture } from "@/types";

const KO_VENUE_POOL: VenueKey[] = [
  "metlife",
  "sofi",
  "att",
  "lumen",
  "nrg",
  "hardRock",
  "mercedes",
  "gillette",
  "lincoln",
  "levis",
  "arrowhead",
  "vancouver",
  "toronto",
  "mexicoCity",
  "guadalajara",
  "monterrey",
];

function placeholderKo(
  id: string,
  stage: Fixture["stage"],
  kickoffUtc: string,
  venueIndex: number,
  label: string,
): Fixture {
  return {
    id,
    homeTeamId: "",
    awayTeamId: "",
    stage,
    kickoffUtc,
    venue: WC26_VENUES[KO_VENUE_POOL[venueIndex % KO_VENUE_POOL.length]],
    status: "scheduled",
    label,
  };
}

/**
 * Knockout phase — individual kickoff slots (opponents TBD until bracket is set).
 * Times: Bangladesh Standard Time (+06:00).
 */
export const KNOCKOUT_FIXTURES: Fixture[] = [
  // Round of 32 (16)
  placeholderKo("wc26-ko-r32-01", "round_of_32", "2026-06-29T01:00:00+06:00", 0, "Round of 32 · Match 1"),
  placeholderKo("wc26-ko-r32-02", "round_of_32", "2026-06-29T23:00:00+06:00", 1, "Round of 32 · Match 2"),
  placeholderKo("wc26-ko-r32-03", "round_of_32", "2026-06-30T02:30:00+06:00", 2, "Round of 32 · Match 3"),
  placeholderKo("wc26-ko-r32-04", "round_of_32", "2026-06-30T07:00:00+06:00", 3, "Round of 32 · Match 4"),
  placeholderKo("wc26-ko-r32-05", "round_of_32", "2026-06-30T23:00:00+06:00", 4, "Round of 32 · Match 5"),
  placeholderKo("wc26-ko-r32-06", "round_of_32", "2026-07-01T03:00:00+06:00", 5, "Round of 32 · Match 6"),
  placeholderKo("wc26-ko-r32-07", "round_of_32", "2026-07-01T07:00:00+06:00", 6, "Round of 32 · Match 7"),
  placeholderKo("wc26-ko-r32-08", "round_of_32", "2026-07-01T22:00:00+06:00", 7, "Round of 32 · Match 8"),
  placeholderKo("wc26-ko-r32-09", "round_of_32", "2026-07-02T02:00:00+06:00", 8, "Round of 32 · Match 9"),
  placeholderKo("wc26-ko-r32-10", "round_of_32", "2026-07-02T06:00:00+06:00", 9, "Round of 32 · Match 10"),
  placeholderKo("wc26-ko-r32-11", "round_of_32", "2026-07-03T01:00:00+06:00", 10, "Round of 32 · Match 11"),
  placeholderKo("wc26-ko-r32-12", "round_of_32", "2026-07-03T05:00:00+06:00", 11, "Round of 32 · Match 12"),
  placeholderKo("wc26-ko-r32-13", "round_of_32", "2026-07-03T09:00:00+06:00", 12, "Round of 32 · Match 13"),
  placeholderKo("wc26-ko-r32-14", "round_of_32", "2026-07-04T00:00:00+06:00", 13, "Round of 32 · Match 14"),
  placeholderKo("wc26-ko-r32-15", "round_of_32", "2026-07-04T04:00:00+06:00", 14, "Round of 32 · Match 15"),
  placeholderKo("wc26-ko-r32-16", "round_of_32", "2026-07-04T07:30:00+06:00", 15, "Round of 32 · Match 16"),

  // Round of 16 (8)
  placeholderKo("wc26-ko-r16-01", "round_of_16", "2026-07-04T23:00:00+06:00", 16, "Round of 16 · Match 1"),
  placeholderKo("wc26-ko-r16-02", "round_of_16", "2026-07-05T03:00:00+06:00", 17, "Round of 16 · Match 2"),
  placeholderKo("wc26-ko-r16-03", "round_of_16", "2026-07-06T02:00:00+06:00", 18, "Round of 16 · Match 3"),
  placeholderKo("wc26-ko-r16-04", "round_of_16", "2026-07-06T06:00:00+06:00", 19, "Round of 16 · Match 4"),
  placeholderKo("wc26-ko-r16-05", "round_of_16", "2026-07-07T01:00:00+06:00", 20, "Round of 16 · Match 5"),
  placeholderKo("wc26-ko-r16-06", "round_of_16", "2026-07-07T06:00:00+06:00", 21, "Round of 16 · Match 6"),
  placeholderKo("wc26-ko-r16-07", "round_of_16", "2026-07-07T22:00:00+06:00", 22, "Round of 16 · Match 7"),
  placeholderKo("wc26-ko-r16-08", "round_of_16", "2026-07-08T02:00:00+06:00", 23, "Round of 16 · Match 8"),

  // Quarter-finals (4)
  placeholderKo("wc26-ko-qf-01", "quarter", "2026-07-10T02:00:00+06:00", 24, "Quarter-finals · Match 1"),
  placeholderKo("wc26-ko-qf-02", "quarter", "2026-07-11T01:00:00+06:00", 25, "Quarter-finals · Match 2"),
  placeholderKo("wc26-ko-qf-03", "quarter", "2026-07-12T03:00:00+06:00", 26, "Quarter-finals · Match 3"),
  placeholderKo("wc26-ko-qf-04", "quarter", "2026-07-12T07:00:00+06:00", 27, "Quarter-finals · Match 4"),

  // Semi-finals (2)
  placeholderKo("wc26-ko-sf-01", "semi", "2026-07-15T01:00:00+06:00", 28, "Semi-finals · Match 1"),
  placeholderKo("wc26-ko-sf-02", "semi", "2026-07-16T01:00:00+06:00", 29, "Semi-finals · Match 2"),

  // Third place & final
  placeholderKo("wc26-ko-3rd", "third_place", "2026-07-19T03:00:00+06:00", 30, "Third place play-off"),
  placeholderKo("wc26-ko-final", "final", "2026-07-20T01:00:00+06:00", 31, "Final"),
];

/** @deprecated Prefer `KNOCKOUT_FIXTURES` — kept for backwards compatibility */
export const KNOCKOUT_MILESTONES = KNOCKOUT_FIXTURES;
