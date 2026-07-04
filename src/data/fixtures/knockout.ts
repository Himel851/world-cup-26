import { WC26_VENUES, type VenueKey } from "@/data/venues";
import type { Fixture } from "@/types";

type KoInput = {
  id: string;
  stage: Fixture["stage"];
  kickoffUtc: string;
  venue: VenueKey;
  label: string;
  homeTeamId?: string;
  awayTeamId?: string;
  status?: Fixture["status"];
  score?: Fixture["score"];
  penalties?: Fixture["penalties"];
  wentToExtraTime?: boolean;
};

function ko(input: KoInput): Fixture {
  return {
    id: input.id,
    homeTeamId: input.homeTeamId ?? "",
    awayTeamId: input.awayTeamId ?? "",
    stage: input.stage,
    kickoffUtc: input.kickoffUtc,
    venue: WC26_VENUES[input.venue],
    status: input.status ?? "scheduled",
    label: input.label,
    ...(input.score ? { score: input.score } : {}),
    ...(input.penalties ? { penalties: input.penalties } : {}),
    ...(input.wentToExtraTime ? { wentToExtraTime: true } : {}),
  };
}

/**
 * FIFA World Cup 2026 knockout phase — official match numbers M73–M104.
 * All kickoffs authored in Bangladesh Standard Time (UTC+6).
 * Round of 32 results: 28 Jun – 3 Jul 2026.
 */
export const KNOCKOUT_FIXTURES: Fixture[] = [
  // Round of 32 — M73–M88
  ko({
    id: "wc26-ko-r32-01",
    stage: "round_of_32",
    kickoffUtc: "2026-06-29T07:00:00+06:00",
    venue: "sofi",
    label: "M73 · 2A vs 2B",
    homeTeamId: "rsa",
    awayTeamId: "can",
    status: "finished",
    score: { home: 0, away: 1 },
  }),
  ko({
    id: "wc26-ko-r32-02",
    stage: "round_of_32",
    kickoffUtc: "2026-06-29T22:00:00+06:00",
    venue: "gillette",
    label: "M74 · 1E vs 3rd",
    homeTeamId: "ger",
    awayTeamId: "par",
    status: "finished",
    score: { home: 1, away: 1 },
    penalties: { home: 3, away: 4 },
    wentToExtraTime: true,
  }),
  ko({
    id: "wc26-ko-r32-03",
    stage: "round_of_32",
    kickoffUtc: "2026-06-30T01:00:00+06:00",
    venue: "monterrey",
    label: "M75 · 1F vs 2C",
    homeTeamId: "ned",
    awayTeamId: "mar",
    status: "finished",
    score: { home: 1, away: 1 },
    penalties: { home: 2, away: 3 },
    wentToExtraTime: true,
  }),
  ko({
    id: "wc26-ko-r32-04",
    stage: "round_of_32",
    kickoffUtc: "2026-06-30T07:00:00+06:00",
    venue: "nrg",
    label: "M76 · 1C vs 2F",
    homeTeamId: "bra",
    awayTeamId: "jpn",
    status: "finished",
    score: { home: 2, away: 1 },
  }),
  ko({
    id: "wc26-ko-r32-05",
    stage: "round_of_32",
    kickoffUtc: "2026-06-30T22:00:00+06:00",
    venue: "metlife",
    label: "M77 · 1I vs 3rd",
    homeTeamId: "fra",
    awayTeamId: "swe",
    status: "finished",
    score: { home: 3, away: 0 },
  }),
  ko({
    id: "wc26-ko-r32-06",
    stage: "round_of_32",
    kickoffUtc: "2026-07-01T01:00:00+06:00",
    venue: "att",
    label: "M78 · 2E vs 2I",
    homeTeamId: "civ",
    awayTeamId: "nor",
    status: "finished",
    score: { home: 1, away: 2 },
  }),
  ko({
    id: "wc26-ko-r32-07",
    stage: "round_of_32",
    kickoffUtc: "2026-07-01T07:00:00+06:00",
    venue: "mexicoCity",
    label: "M79 · 1A vs 3rd",
    homeTeamId: "mex",
    awayTeamId: "ecu",
    status: "finished",
    score: { home: 2, away: 0 },
  }),
  ko({
    id: "wc26-ko-r32-08",
    stage: "round_of_32",
    kickoffUtc: "2026-07-01T22:00:00+06:00",
    venue: "mercedes",
    label: "M80 · 1L vs 3rd",
    homeTeamId: "eng",
    awayTeamId: "cod",
    status: "finished",
    score: { home: 2, away: 1 },
  }),
  ko({
    id: "wc26-ko-r32-09",
    stage: "round_of_32",
    kickoffUtc: "2026-07-02T01:00:00+06:00",
    venue: "lumen",
    label: "M81 · 1D vs 3rd",
    homeTeamId: "bel",
    awayTeamId: "sen",
    status: "finished",
    score: { home: 3, away: 2 },
    wentToExtraTime: true,
  }),
  ko({
    id: "wc26-ko-r32-10",
    stage: "round_of_32",
    kickoffUtc: "2026-07-02T07:00:00+06:00",
    venue: "levis",
    label: "M82 · 1G vs 3rd",
    homeTeamId: "usa",
    awayTeamId: "bih",
    status: "finished",
    score: { home: 2, away: 0 },
  }),
  ko({
    id: "wc26-ko-r32-11",
    stage: "round_of_32",
    kickoffUtc: "2026-07-03T00:00:00+06:00",
    venue: "toronto",
    label: "M83 · 2K vs 2L",
    homeTeamId: "por",
    awayTeamId: "cro",
    status: "finished",
    score: { home: 2, away: 1 },
  }),
  ko({
    id: "wc26-ko-r32-12",
    stage: "round_of_32",
    kickoffUtc: "2026-07-03T04:00:00+06:00",
    venue: "sofi",
    label: "M84 · 1H vs 2J",
    homeTeamId: "esp",
    awayTeamId: "aut",
    status: "finished",
    score: { home: 3, away: 0 },
  }),
  ko({
    id: "wc26-ko-r32-13",
    stage: "round_of_32",
    kickoffUtc: "2026-07-03T08:00:00+06:00",
    venue: "vancouver",
    label: "M85 · 1B vs 3rd",
    homeTeamId: "swi",
    awayTeamId: "alg",
    status: "finished",
    score: { home: 2, away: 0 },
  }),
  ko({
    id: "wc26-ko-r32-14",
    stage: "round_of_32",
    kickoffUtc: "2026-07-03T23:00:00+06:00",
    venue: "att",
    label: "M86 · 1J vs 2H",
    homeTeamId: "aus",
    awayTeamId: "egy",
    status: "finished",
    score: { home: 1, away: 1 },
    penalties: { home: 2, away: 4 },
    wentToExtraTime: true,
  }),
  ko({
    id: "wc26-ko-r32-15",
    stage: "round_of_32",
    kickoffUtc: "2026-07-04T02:00:00+06:00",
    venue: "hardRock",
    label: "M87 · 1K vs 3rd",
    homeTeamId: "arg",
    awayTeamId: "cpv",
    status: "finished",
    score: { home: 3, away: 2 },
    wentToExtraTime: true,
  }),
  ko({
    id: "wc26-ko-r32-16",
    stage: "round_of_32",
    kickoffUtc: "2026-07-04T07:00:00+06:00",
    venue: "arrowhead",
    label: "M88 · 2D vs 2G",
    homeTeamId: "col",
    awayTeamId: "gha",
    status: "finished",
    score: { home: 1, away: 0 },
  }),

  // Round of 16 — M89–M96 (kickoffs in BST / UTC+6)
  ko({
    id: "wc26-ko-r16-01",
    stage: "round_of_16",
    kickoffUtc: "2026-07-04T23:00:00+06:00",
    venue: "nrg",
    label: "M89 · W73 vs W75",
    homeTeamId: "can",
    awayTeamId: "mar",
  }),
  ko({
    id: "wc26-ko-r16-02",
    stage: "round_of_16",
    kickoffUtc: "2026-07-05T03:00:00+06:00",
    venue: "metlife",
    label: "M90 · W74 vs W77",
    homeTeamId: "par",
    awayTeamId: "fra",
  }),
  ko({
    id: "wc26-ko-r16-03",
    stage: "round_of_16",
    kickoffUtc: "2026-07-06T02:00:00+06:00",
    venue: "levis",
    label: "M91 · W76 vs W78",
    homeTeamId: "bra",
    awayTeamId: "nor",
  }),
  ko({
    id: "wc26-ko-r16-04",
    stage: "round_of_16",
    kickoffUtc: "2026-07-06T06:00:00+06:00",
    venue: "mexicoCity",
    label: "M92 · W79 vs W80",
    homeTeamId: "mex",
    awayTeamId: "eng",
  }),
  ko({
    id: "wc26-ko-r16-05",
    stage: "round_of_16",
    kickoffUtc: "2026-07-07T01:00:00+06:00",
    venue: "att",
    label: "M93 · W83 vs W84",
    homeTeamId: "por",
    awayTeamId: "esp",
  }),
  ko({
    id: "wc26-ko-r16-06",
    stage: "round_of_16",
    kickoffUtc: "2026-07-07T06:00:00+06:00",
    venue: "lumen",
    label: "M94 · W82 vs W81",
    homeTeamId: "usa",
    awayTeamId: "bel",
  }),
  ko({
    id: "wc26-ko-r16-07",
    stage: "round_of_16",
    kickoffUtc: "2026-07-07T22:00:00+06:00",
    venue: "mercedes",
    label: "M95 · W87 vs W86",
    homeTeamId: "arg",
    awayTeamId: "egy",
  }),
  ko({
    id: "wc26-ko-r16-08",
    stage: "round_of_16",
    kickoffUtc: "2026-07-08T02:00:00+06:00",
    venue: "vancouver",
    label: "M96 · W85 vs W88",
    homeTeamId: "swi",
    awayTeamId: "col",
  }),

  // Quarter-finals — M97–M100
  ko({
    id: "wc26-ko-qf-01",
    stage: "quarter",
    kickoffUtc: "2026-07-10T04:00:00+06:00",
    venue: "gillette",
    label: "M97 · W89 vs W90",
  }),
  ko({
    id: "wc26-ko-qf-02",
    stage: "quarter",
    kickoffUtc: "2026-07-11T01:00:00+06:00",
    venue: "sofi",
    label: "M98 · W93 vs W94",
  }),
  ko({
    id: "wc26-ko-qf-03",
    stage: "quarter",
    kickoffUtc: "2026-07-11T08:00:00+06:00",
    venue: "hardRock",
    label: "M99 · W91 vs W92",
  }),
  ko({
    id: "wc26-ko-qf-04",
    stage: "quarter",
    kickoffUtc: "2026-07-12T04:00:00+06:00",
    venue: "arrowhead",
    label: "M100 · W95 vs W96",
  }),

  // Semi-finals — M101–M102
  ko({
    id: "wc26-ko-sf-01",
    stage: "semi",
    kickoffUtc: "2026-07-15T05:00:00+06:00",
    venue: "att",
    label: "M101 · W97 vs W98",
  }),
  ko({
    id: "wc26-ko-sf-02",
    stage: "semi",
    kickoffUtc: "2026-07-16T05:00:00+06:00",
    venue: "mercedes",
    label: "M102 · W99 vs W100",
  }),

  // Third place (M103) & Final (M104)
  ko({
    id: "wc26-ko-3rd",
    stage: "third_place",
    kickoffUtc: "2026-07-19T05:00:00+06:00",
    venue: "hardRock",
    label: "M103 · Third place play-off",
  }),
  ko({
    id: "wc26-ko-final",
    stage: "final",
    kickoffUtc: "2026-07-20T02:00:00+06:00",
    venue: "metlife",
    label: "M104 · Final",
  }),
];

/** @deprecated Prefer `KNOCKOUT_FIXTURES` — kept for backwards compatibility */
export const KNOCKOUT_MILESTONES = KNOCKOUT_FIXTURES;
