import { R32_MATCHES } from "@/lib/r32-bracket";
import type { BracketMatch } from "@/types/predictions";

export const R32_MATCH_IDS = R32_MATCHES.map((m) => m.id) as [
  string, string, string, string, string, string, string, string,
  string, string, string, string, string, string, string, string,
];

export const R16_MATCH_IDS = Array.from({ length: 8 }, (_, i) =>
  `r16-${String(i + 1).padStart(2, "0")}`,
);

export const QF_MATCH_IDS = Array.from({ length: 4 }, (_, i) =>
  `qf-${String(i + 1).padStart(2, "0")}`,
);

export const SF_MATCH_IDS = ["sf-01", "sf-02"] as const;

export const THIRD_PLACE_MATCH_ID = "3rd";
export const FINAL_MATCH_ID = "final";

/** Round of 16 feeders — FIFA WC 2026 bracket (M89–M96). */
const R16_FEEDS: [string, string][] = [
  ["r32-02", "r32-05"], // M89 · W74 vs W77
  ["r32-01", "r32-03"], // M90 · W73 vs W75
  ["r32-04", "r32-06"], // M91 · W76 vs W78
  ["r32-07", "r32-08"], // M92 · W79 vs W80
  ["r32-11", "r32-12"], // M93 · W83 vs W84
  ["r32-09", "r32-10"], // M94 · W81 vs W82
  ["r32-14", "r32-16"], // M95 · W86 vs W88
  ["r32-13", "r32-15"], // M96 · W85 vs W87
];

/** Quarter-final feeders — bracket halves (M97–M100). */
const QF_FEEDS: [string, string][] = [
  ["r16-01", "r16-02"], // QF1
  ["r16-05", "r16-06"], // QF2
  ["r16-03", "r16-04"], // QF3
  ["r16-07", "r16-08"], // QF4
];

function knockoutMatch(
  id: string,
  stage: BracketMatch["stage"],
  label: string,
  feedsFrom: [string | null, string | null],
): BracketMatch {
  return { id, stage, label, feedsFrom };
}

export const BRACKET_MATCHES: BracketMatch[] = [
  ...R32_MATCHES.map((m) =>
    knockoutMatch(m.id, "round_of_32", m.label, [null, null]),
  ),
  ...R16_MATCH_IDS.map((id, i) =>
    knockoutMatch(
      id,
      "round_of_16",
      `Round of 16 · M${89 + i}`,
      R16_FEEDS[i]!,
    ),
  ),
  ...QF_MATCH_IDS.map((id, i) =>
    knockoutMatch(id, "quarter", `Quarter-finals · QF${i + 1}`, QF_FEEDS[i]!),
  ),
  knockoutMatch("sf-01", "semi", "Semi-finals · SF1", ["qf-01", "qf-02"]),
  knockoutMatch("sf-02", "semi", "Semi-finals · SF2", ["qf-03", "qf-04"]),
  knockoutMatch(THIRD_PLACE_MATCH_ID, "third_place", "Third place play-off", [
    "sf-01",
    "sf-02",
  ]),
  knockoutMatch(FINAL_MATCH_ID, "final", "Final", ["sf-01", "sf-02"]),
];

export const KNOCKOUT_STAGES = [
  { key: "round_of_32" as const, label: "Round of 32", matchIds: R32_MATCH_IDS },
  { key: "round_of_16" as const, label: "Round of 16", matchIds: R16_MATCH_IDS },
  { key: "quarter" as const, label: "Quarter-finals", matchIds: QF_MATCH_IDS },
  { key: "semi" as const, label: "Semi-finals", matchIds: [...SF_MATCH_IDS] },
  { key: "third_place" as const, label: "Third place", matchIds: [THIRD_PLACE_MATCH_ID] },
  { key: "final" as const, label: "Final", matchIds: [FINAL_MATCH_ID] },
];

export function getBracketMatch(id: string): BracketMatch | undefined {
  return BRACKET_MATCHES.find((m) => m.id === id);
}

/**
 * Visual tree order — each adjacent pair connects to one match in the next column.
 * Must match R16_FEEDS / QF_FEEDS wiring (FIFA WC 2026 bracket).
 */
export const R32_TREE_ORDER = [
  "r32-02",
  "r32-05", // → r16-01 (M89)
  "r32-01",
  "r32-03", // → r16-02 (M90)
  "r32-04",
  "r32-06", // → r16-03 (M91)
  "r32-07",
  "r32-08", // → r16-04 (M92)
  "r32-11",
  "r32-12", // → r16-05 (M93)
  "r32-09",
  "r32-10", // → r16-06 (M94)
  "r32-14",
  "r32-16", // → r16-07 (M95)
  "r32-13",
  "r32-15", // → r16-08 (M96)
] as const;

export const R16_TREE_ORDER = [
  "r16-01",
  "r16-02", // → qf-01
  "r16-05",
  "r16-06", // → qf-02
  "r16-03",
  "r16-04", // → qf-03
  "r16-07",
  "r16-08", // → qf-04
] as const;

export const QF_TREE_ORDER = [...QF_MATCH_IDS] as const;
export const SF_TREE_ORDER = [...SF_MATCH_IDS] as const;
