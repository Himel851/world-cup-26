import thirdPlaceCombinations from "@/data/third-place-combinations.json";
import { TEAMS } from "@/data/teams";
import type { GroupLetter } from "@/types";
import type { TournamentPrediction } from "@/types/predictions";

/** Group winners that face a third-placed team in the Round of 32. */
export type WinnerThirdSlot = "A" | "B" | "D" | "E" | "G" | "I" | "K" | "L";

export type R32SlotDef =
  | { kind: "1"; group: GroupLetter }
  | { kind: "2"; group: GroupLetter }
  | { kind: "3"; vs: WinnerThirdSlot };

export interface R32MatchDef {
  id: string;
  fifaNumber: number;
  home: R32SlotDef;
  away: R32SlotDef;
  label: string;
}

/** FIFA World Cup 2026 Round of 32 — matches M73–M88 (regulations §12.5). */
export const R32_MATCHES: R32MatchDef[] = [
  {
    id: "r32-01",
    fifaNumber: 73,
    home: { kind: "2", group: "A" },
    away: { kind: "2", group: "B" },
    label: "M73 · 2A vs 2B",
  },
  {
    id: "r32-02",
    fifaNumber: 74,
    home: { kind: "1", group: "E" },
    away: { kind: "3", vs: "E" },
    label: "M74 · 1E vs 3rd",
  },
  {
    id: "r32-03",
    fifaNumber: 75,
    home: { kind: "1", group: "F" },
    away: { kind: "2", group: "C" },
    label: "M75 · 1F vs 2C",
  },
  {
    id: "r32-04",
    fifaNumber: 76,
    home: { kind: "1", group: "C" },
    away: { kind: "2", group: "F" },
    label: "M76 · 1C vs 2F",
  },
  {
    id: "r32-05",
    fifaNumber: 77,
    home: { kind: "1", group: "I" },
    away: { kind: "3", vs: "I" },
    label: "M77 · 1I vs 3rd",
  },
  {
    id: "r32-06",
    fifaNumber: 78,
    home: { kind: "2", group: "E" },
    away: { kind: "2", group: "I" },
    label: "M78 · 2E vs 2I",
  },
  {
    id: "r32-07",
    fifaNumber: 79,
    home: { kind: "1", group: "A" },
    away: { kind: "3", vs: "A" },
    label: "M79 · 1A vs 3rd",
  },
  {
    id: "r32-08",
    fifaNumber: 80,
    home: { kind: "1", group: "L" },
    away: { kind: "3", vs: "L" },
    label: "M80 · 1L vs 3rd",
  },
  {
    id: "r32-09",
    fifaNumber: 81,
    home: { kind: "1", group: "G" },
    away: { kind: "3", vs: "G" },
    label: "M81 · 1G vs 3rd",
  },
  {
    id: "r32-10",
    fifaNumber: 82,
    home: { kind: "1", group: "D" },
    away: { kind: "3", vs: "D" },
    label: "M82 · 1D vs 3rd",
  },
  {
    id: "r32-11",
    fifaNumber: 83,
    home: { kind: "2", group: "K" },
    away: { kind: "2", group: "L" },
    label: "M83 · 2K vs 2L",
  },
  {
    id: "r32-12",
    fifaNumber: 84,
    home: { kind: "1", group: "H" },
    away: { kind: "2", group: "J" },
    label: "M84 · 1H vs 2J",
  },
  {
    id: "r32-13",
    fifaNumber: 85,
    home: { kind: "1", group: "K" },
    away: { kind: "3", vs: "K" },
    label: "M85 · 1K vs 3rd",
  },
  {
    id: "r32-14",
    fifaNumber: 86,
    home: { kind: "1", group: "J" },
    away: { kind: "2", group: "H" },
    label: "M86 · 1J vs 2H",
  },
  {
    id: "r32-15",
    fifaNumber: 87,
    home: { kind: "1", group: "B" },
    away: { kind: "3", vs: "B" },
    label: "M87 · 1B vs 3rd",
  },
  {
    id: "r32-16",
    fifaNumber: 88,
    home: { kind: "2", group: "D" },
    away: { kind: "2", group: "G" },
    label: "M88 · 2D vs 2G",
  },
];

const COMBO_ROWS = Object.values(
  thirdPlaceCombinations as Record<string, Record<WinnerThirdSlot, GroupLetter>>,
);

/** FIFA Annex C rows keyed by sorted advancing third-place groups (e.g. "EFGHIJKL"). */
const COMBO_BY_ADVANCING = new Map<string, Record<WinnerThirdSlot, GroupLetter>>(
  COMBO_ROWS.map((row) => {
    const key = [...new Set(Object.values(row))].sort().join("");
    return [key, row] as const;
  }),
);

export function getR32MatchDef(id: string): R32MatchDef | undefined {
  return R32_MATCHES.find((m) => m.id === id);
}

function advancingThirdGroups(prediction: TournamentPrediction): GroupLetter[] | null {
  if (prediction.thirdPlaceAdvancers.length !== 8) return null;
  const groups = prediction.thirdPlaceAdvancers
    .map((teamId) => TEAMS.find((t) => t.id === teamId)?.group)
    .filter((g): g is GroupLetter => Boolean(g));
  if (groups.length !== 8) return null;
  return groups;
}

function thirdGroupForWinnerSlot(
  prediction: TournamentPrediction,
  slot: WinnerThirdSlot,
): GroupLetter | null {
  const advancing = advancingThirdGroups(prediction);
  if (!advancing) return null;
  const key = [...new Set(advancing)].sort().join("");
  const row = COMBO_BY_ADVANCING.get(key);
  if (!row) return null;
  return row[slot] ?? null;
}

function resolveR32Slot(
  slot: R32SlotDef,
  prediction: TournamentPrediction,
): string {
  if (slot.kind === "1") return prediction.groups[slot.group][0] ?? "";
  if (slot.kind === "2") return prediction.groups[slot.group][1] ?? "";
  const thirdGroup = thirdGroupForWinnerSlot(prediction, slot.vs);
  if (!thirdGroup) return "";
  return prediction.groups[thirdGroup][2] ?? "";
}

export function getR32MatchSides(
  matchId: string,
  prediction: TournamentPrediction,
): [string, string] {
  const match = getR32MatchDef(matchId);
  if (!match) return ["", ""];
  return [
    resolveR32Slot(match.home, prediction),
    resolveR32Slot(match.away, prediction),
  ];
}
