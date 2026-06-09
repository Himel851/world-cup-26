import { WC26_VENUES, type VenueKey } from "@/data/venues";
import type { Fixture } from "@/types";

function ko(
  id: string,
  stage: Fixture["stage"],
  kickoffUtc: string,
  venue: VenueKey,
  label: string,
): Fixture {
  return {
    id,
    homeTeamId: "",
    awayTeamId: "",
    stage,
    kickoffUtc,
    venue: WC26_VENUES[venue],
    status: "scheduled",
    label,
  };
}

/**
 * FIFA World Cup 2026 knockout phase — official match numbers M73–M104.
 * All kickoffs authored in Bangladesh Standard Time (UTC+6).
 */
export const KNOCKOUT_FIXTURES: Fixture[] = [
  // Round of 32 — M73–M88
  ko("wc26-ko-r32-01", "round_of_32", "2026-06-29T07:00:00+06:00", "sofi", "M73 · 2A vs 2B"),
  ko("wc26-ko-r32-02", "round_of_32", "2026-06-29T22:00:00+06:00", "gillette", "M74 · 1E vs 3rd"),
  ko("wc26-ko-r32-03", "round_of_32", "2026-06-30T01:00:00+06:00", "monterrey", "M75 · 1F vs 2C"),
  ko("wc26-ko-r32-04", "round_of_32", "2026-06-30T07:00:00+06:00", "nrg", "M76 · 1C vs 2F"),
  ko("wc26-ko-r32-05", "round_of_32", "2026-06-30T22:00:00+06:00", "metlife", "M77 · 1I vs 3rd"),
  ko("wc26-ko-r32-06", "round_of_32", "2026-07-01T01:00:00+06:00", "att", "M78 · 2E vs 2I"),
  ko("wc26-ko-r32-07", "round_of_32", "2026-07-01T07:00:00+06:00", "mexicoCity", "M79 · 1A vs 3rd"),
  ko("wc26-ko-r32-08", "round_of_32", "2026-07-01T22:00:00+06:00", "mercedes", "M80 · 1L vs 3rd"),
  ko("wc26-ko-r32-09", "round_of_32", "2026-07-02T01:00:00+06:00", "lumen", "M81 · 1G vs 3rd"),
  ko("wc26-ko-r32-10", "round_of_32", "2026-07-02T07:00:00+06:00", "levis", "M82 · 1D vs 3rd"),
  ko("wc26-ko-r32-11", "round_of_32", "2026-07-03T00:00:00+06:00", "toronto", "M83 · 2K vs 2L"),
  ko("wc26-ko-r32-12", "round_of_32", "2026-07-03T04:00:00+06:00", "sofi", "M84 · 1H vs 2J"),
  ko("wc26-ko-r32-13", "round_of_32", "2026-07-03T08:00:00+06:00", "vancouver", "M85 · 1K vs 3rd"),
  ko("wc26-ko-r32-14", "round_of_32", "2026-07-03T23:00:00+06:00", "nrg", "M86 · 1J vs 2H"),
  ko("wc26-ko-r32-15", "round_of_32", "2026-07-04T02:00:00+06:00", "hardRock", "M87 · 1B vs 3rd"),
  ko("wc26-ko-r32-16", "round_of_32", "2026-07-04T07:00:00+06:00", "att", "M88 · 2D vs 2G"),

  // Round of 16 — M89–M96
  ko("wc26-ko-r16-01", "round_of_16", "2026-07-04T22:00:00+06:00", "metlife", "M89 · W74 vs W77"),
  ko("wc26-ko-r16-02", "round_of_16", "2026-07-05T02:00:00+06:00", "mexicoCity", "M90 · W73 vs W75"),
  ko("wc26-ko-r16-03", "round_of_16", "2026-07-05T06:00:00+06:00", "levis", "M91 · W76 vs W78"),
  ko("wc26-ko-r16-04", "round_of_16", "2026-07-06T04:00:00+06:00", "att", "M92 · W79 vs W80"),
  ko("wc26-ko-r16-05", "round_of_16", "2026-07-06T08:00:00+06:00", "lumen", "M93 · W82 vs W83"),
  ko("wc26-ko-r16-06", "round_of_16", "2026-07-07T06:00:00+06:00", "vancouver", "M94 · W81 vs W85"),
  ko("wc26-ko-r16-07", "round_of_16", "2026-07-07T22:00:00+06:00", "nrg", "M95 · W84 vs W88"),
  ko("wc26-ko-r16-08", "round_of_16", "2026-07-08T01:00:00+06:00", "mercedes", "M96 · W86 vs W87"),

  // Quarter-finals — M97–M100
  ko("wc26-ko-qf-01", "quarter", "2026-07-10T04:00:00+06:00", "gillette", "M97 · W89 vs W90"),
  ko("wc26-ko-qf-02", "quarter", "2026-07-11T01:00:00+06:00", "sofi", "M98 · W93 vs W94"),
  ko("wc26-ko-qf-03", "quarter", "2026-07-11T08:00:00+06:00", "hardRock", "M99 · W91 vs W92"),
  ko("wc26-ko-qf-04", "quarter", "2026-07-12T04:00:00+06:00", "arrowhead", "M100 · W95 vs W96"),

  // Semi-finals — M101–M102
  ko("wc26-ko-sf-01", "semi", "2026-07-15T05:00:00+06:00", "att", "M101 · W97 vs W98"),
  ko("wc26-ko-sf-02", "semi", "2026-07-16T05:00:00+06:00", "mercedes", "M102 · W99 vs W100"),

  // Third place (M103) & Final (M104)
  ko("wc26-ko-3rd", "third_place", "2026-07-19T05:00:00+06:00", "hardRock", "M103 · Third place play-off"),
  ko("wc26-ko-final", "final", "2026-07-20T02:00:00+06:00", "metlife", "M104 · Final"),
];

/** @deprecated Prefer `KNOCKOUT_FIXTURES` — kept for backwards compatibility */
export const KNOCKOUT_MILESTONES = KNOCKOUT_FIXTURES;
