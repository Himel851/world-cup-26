import type { SquadPlayer } from "@/types/api-football";

export type SlotRole = "GK" | "DEF" | "MID" | "CAM" | "FWD";

export type FormationSlot = {
  id: string;
  role: SlotRole;
  label: string;
  x: number;
  y: number;
};

export type FormationDefinition = {
  id: string;
  name: string;
  slots: FormationSlot[];
};

const GK: FormationSlot = { id: "gk", role: "GK", label: "GK", x: 50, y: 90 };

export const FORMATIONS: FormationDefinition[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: [
      GK,
      { id: "lb", role: "DEF", label: "LB", x: 14, y: 74 },
      { id: "cb1", role: "DEF", label: "CB", x: 36, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 64, y: 76 },
      { id: "rb", role: "DEF", label: "RB", x: 86, y: 74 },
      { id: "cm1", role: "MID", label: "CM", x: 25, y: 48 },
      { id: "cm2", role: "MID", label: "CM", x: 50, y: 46 },
      { id: "cm3", role: "MID", label: "CM", x: 75, y: 48 },
      { id: "lw", role: "FWD", label: "LW", x: 20, y: 22 },
      { id: "st", role: "FWD", label: "ST", x: 50, y: 20 },
      { id: "rw", role: "FWD", label: "RW", x: 80, y: 22 },
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    slots: [
      GK,
      { id: "lb", role: "DEF", label: "LB", x: 14, y: 74 },
      { id: "cb1", role: "DEF", label: "CB", x: 36, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 64, y: 76 },
      { id: "rb", role: "DEF", label: "RB", x: 86, y: 74 },
      { id: "lm", role: "MID", label: "LM", x: 18, y: 50 },
      { id: "cm1", role: "MID", label: "CM", x: 40, y: 48 },
      { id: "cm2", role: "MID", label: "CM", x: 60, y: 48 },
      { id: "rm", role: "MID", label: "RM", x: 82, y: 50 },
      { id: "st1", role: "FWD", label: "ST", x: 38, y: 22 },
      { id: "st2", role: "FWD", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    slots: [
      GK,
      { id: "lb", role: "DEF", label: "LB", x: 14, y: 74 },
      { id: "cb1", role: "DEF", label: "CB", x: 36, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 64, y: 76 },
      { id: "rb", role: "DEF", label: "RB", x: 86, y: 74 },
      { id: "cdm1", role: "MID", label: "CDM", x: 38, y: 56 },
      { id: "cdm2", role: "MID", label: "CDM", x: 62, y: 56 },
      { id: "lam", role: "CAM", label: "LAM", x: 22, y: 40 },
      { id: "cam", role: "CAM", label: "CAM", x: 50, y: 38 },
      { id: "ram", role: "CAM", label: "RAM", x: 78, y: 40 },
      { id: "st", role: "FWD", label: "ST", x: 50, y: 20 },
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    slots: [
      GK,
      { id: "cb1", role: "DEF", label: "CB", x: 25, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 50, y: 78 },
      { id: "cb3", role: "DEF", label: "CB", x: 75, y: 76 },
      { id: "lwb", role: "MID", label: "LWB", x: 10, y: 52 },
      { id: "cm1", role: "MID", label: "CM", x: 30, y: 46 },
      { id: "cm2", role: "MID", label: "CM", x: 50, y: 44 },
      { id: "cm3", role: "MID", label: "CM", x: 70, y: 46 },
      { id: "rwb", role: "MID", label: "RWB", x: 90, y: 52 },
      { id: "st1", role: "FWD", label: "ST", x: 38, y: 22 },
      { id: "st2", role: "FWD", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "4-1-2-1-2",
    name: "4-1-2-1-2",
    slots: [
      GK,
      { id: "lb", role: "DEF", label: "LB", x: 14, y: 74 },
      { id: "cb1", role: "DEF", label: "CB", x: 36, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 64, y: 76 },
      { id: "rb", role: "DEF", label: "RB", x: 86, y: 74 },
      { id: "cdm", role: "MID", label: "CDM", x: 50, y: 62 },
      { id: "lm", role: "MID", label: "LM", x: 28, y: 44 },
      { id: "rm", role: "MID", label: "RM", x: 72, y: 44 },
      { id: "cam", role: "CAM", label: "CAM", x: 50, y: 36 },
      { id: "st1", role: "FWD", label: "ST", x: 38, y: 22 },
      { id: "st2", role: "FWD", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    slots: [
      GK,
      { id: "cb1", role: "DEF", label: "CB", x: 25, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 50, y: 78 },
      { id: "cb3", role: "DEF", label: "CB", x: 75, y: 76 },
      { id: "lm", role: "MID", label: "LM", x: 18, y: 50 },
      { id: "cm1", role: "MID", label: "CM", x: 40, y: 48 },
      { id: "cm2", role: "MID", label: "CM", x: 60, y: 48 },
      { id: "rm", role: "MID", label: "RM", x: 82, y: 50 },
      { id: "lw", role: "FWD", label: "LW", x: 20, y: 22 },
      { id: "st", role: "FWD", label: "ST", x: 50, y: 20 },
      { id: "rw", role: "FWD", label: "RW", x: 80, y: 22 },
    ],
  },
  {
    id: "4-3-1-2",
    name: "4-3-1-2",
    slots: [
      GK,
      { id: "lb", role: "DEF", label: "LB", x: 14, y: 74 },
      { id: "cb1", role: "DEF", label: "CB", x: 36, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 64, y: 76 },
      { id: "rb", role: "DEF", label: "RB", x: 86, y: 74 },
      { id: "lm", role: "MID", label: "LM", x: 20, y: 50 },
      { id: "cm", role: "MID", label: "CM", x: 50, y: 48 },
      { id: "rm", role: "MID", label: "RM", x: 80, y: 50 },
      { id: "cam", role: "CAM", label: "CAM", x: 50, y: 38 },
      { id: "st1", role: "FWD", label: "ST", x: 36, y: 22 },
      { id: "st2", role: "FWD", label: "ST", x: 64, y: 22 },
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    slots: [
      GK,
      { id: "lwb", role: "DEF", label: "LWB", x: 10, y: 72 },
      { id: "cb1", role: "DEF", label: "CB", x: 28, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 50, y: 78 },
      { id: "cb3", role: "DEF", label: "CB", x: 72, y: 76 },
      { id: "rwb", role: "DEF", label: "RWB", x: 90, y: 72 },
      { id: "cm1", role: "MID", label: "CM", x: 30, y: 46 },
      { id: "cm2", role: "MID", label: "CM", x: 50, y: 44 },
      { id: "cm3", role: "MID", label: "CM", x: 70, y: 46 },
      { id: "st1", role: "FWD", label: "ST", x: 38, y: 22 },
      { id: "st2", role: "FWD", label: "ST", x: 62, y: 22 },
    ],
  },
  {
    id: "4-4-1-1",
    name: "4-4-1-1",
    slots: [
      GK,
      { id: "lb", role: "DEF", label: "LB", x: 14, y: 74 },
      { id: "cb1", role: "DEF", label: "CB", x: 36, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 64, y: 76 },
      { id: "rb", role: "DEF", label: "RB", x: 86, y: 74 },
      { id: "lm", role: "MID", label: "LM", x: 18, y: 50 },
      { id: "cm1", role: "MID", label: "CM", x: 40, y: 48 },
      { id: "cm2", role: "MID", label: "CM", x: 60, y: 48 },
      { id: "rm", role: "MID", label: "RM", x: 82, y: 50 },
      { id: "cam", role: "CAM", label: "CAM", x: 50, y: 35 },
      { id: "st", role: "FWD", label: "ST", x: 50, y: 20 },
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1",
    slots: [
      GK,
      { id: "cb1", role: "DEF", label: "CB", x: 25, y: 76 },
      { id: "cb2", role: "DEF", label: "CB", x: 50, y: 78 },
      { id: "cb3", role: "DEF", label: "CB", x: 75, y: 76 },
      { id: "lm", role: "MID", label: "LM", x: 18, y: 50 },
      { id: "cm1", role: "MID", label: "CM", x: 38, y: 48 },
      { id: "cm2", role: "MID", label: "CM", x: 62, y: 48 },
      { id: "rm", role: "MID", label: "RM", x: 82, y: 50 },
      { id: "cam1", role: "CAM", label: "CAM", x: 38, y: 35 },
      { id: "cam2", role: "CAM", label: "CAM", x: 62, y: 35 },
      { id: "st", role: "FWD", label: "ST", x: 50, y: 20 },
    ],
  },
];

export const DEFAULT_FORMATION_ID = "4-3-3";

/** Pull lines toward center so GK + all 10 outfield players fit without scrolling. */
const GK_SLOT_Y = 84;
const VERTICAL_COMPRESS = 0.86;

function layoutSlotY(slot: FormationSlot): FormationSlot {
  if (slot.role === "GK") return { ...slot, y: GK_SLOT_Y };
  return { ...slot, y: Math.round(50 + (slot.y - 50) * VERTICAL_COMPRESS) };
}

export function getFormation(id: string): FormationDefinition {
  const formation = FORMATIONS.find((f) => f.id === id) ?? FORMATIONS[0]!;
  return {
    ...formation,
    slots: formation.slots.map(layoutSlotY),
  };
}

/** @deprecated Use getFormation(DEFAULT_FORMATION_ID).slots */
export const FORMATION_4_3_1_2 = getFormation("4-3-1-2").slots;

export type PositionFilter = "ALL" | "GK" | "DEF" | "MID" | "FWD";

export function shortPlayerName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  return parts[parts.length - 1] ?? name;
}

/** Maps a pitch slot to the squad-list position bucket (GK / DEF / MID / FWD). */
export function slotToPositionFilter(slot: FormationSlot): PositionFilter {
  switch (slot.role) {
    case "GK":
      return "GK";
    case "DEF":
      return "DEF";
    case "MID":
    case "CAM":
      return "MID";
    case "FWD":
      return "FWD";
    default:
      return "ALL";
  }
}

export function slotAcceptsPosition(slot: FormationSlot, position: string): boolean {
  const p = position.toUpperCase();
  switch (slot.role) {
    case "GK":
      return p === "GK";
    case "DEF":
      return p === "DEF";
    case "MID":
    case "CAM":
      return p === "MID";
    case "FWD":
      return p === "FWD";
    default:
      return false;
  }
}

export function filterPlayersByRole<T extends SquadPlayer>(
  players: T[],
  role: PositionFilter,
): T[] {
  if (role === "ALL") return players;
  return players.filter((p) => p.position.toUpperCase() === role);
}

export function playersForSlot<T extends SquadPlayer>(
  players: T[],
  slot: FormationSlot,
  assigned: Record<string, number>,
): T[] {
  const used = new Set(Object.values(assigned));
  return players.filter(
    (p) => !used.has(p.id) && slotAcceptsPosition(slot, p.position),
  );
}

export function autoFillLineup<T extends SquadPlayer>(
  players: T[],
  slots: FormationSlot[],
): Record<string, number> {
  const lineup: Record<string, number> = {};
  const used = new Set<number>();

  for (const slot of slots) {
    const pick = players.find(
      (p) => !used.has(p.id) && slotAcceptsPosition(slot, p.position),
    );
    if (pick) {
      lineup[slot.id] = pick.id;
      used.add(pick.id);
    }
  }

  return lineup;
}
