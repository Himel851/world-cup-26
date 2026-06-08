import type { BracketMatch } from "@/types/predictions";

/** Round-of-32 slots — teams assigned sequentially from advancing pool. */
export const R32_MATCH_IDS = Array.from({ length: 16 }, (_, i) =>
  `r32-${String(i + 1).padStart(2, "0")}`,
) as [
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

function buildKnockoutRound(
  ids: string[],
  stage: BracketMatch["stage"],
  labelPrefix: string,
  parentIds: string[],
): BracketMatch[] {
  return ids.map((id, i) => ({
    id,
    stage,
    label: `${labelPrefix} · Match ${i + 1}`,
    feedsFrom: [
      parentIds[i * 2] ?? null,
      parentIds[i * 2 + 1] ?? null,
    ] as [string | null, string | null],
  }));
}

export const BRACKET_MATCHES: BracketMatch[] = [
  ...R32_MATCH_IDS.map((id, i) => ({
    id,
    stage: "round_of_32" as const,
    label: `Round of 32 · Match ${i + 1}`,
    feedsFrom: [null, null] as [null, null],
  })),
  ...buildKnockoutRound(R16_MATCH_IDS, "round_of_16", "Round of 16", R32_MATCH_IDS),
  ...buildKnockoutRound(QF_MATCH_IDS, "quarter", "Quarter-finals", R16_MATCH_IDS),
  ...buildKnockoutRound([...SF_MATCH_IDS], "semi", "Semi-finals", QF_MATCH_IDS),
  {
    id: THIRD_PLACE_MATCH_ID,
    stage: "third_place",
    label: "Third place play-off",
    feedsFrom: ["sf-01", "sf-02"],
  },
  {
    id: FINAL_MATCH_ID,
    stage: "final",
    label: "Final",
    feedsFrom: ["sf-01", "sf-02"],
  },
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
