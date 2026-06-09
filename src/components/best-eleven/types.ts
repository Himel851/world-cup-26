import type { SquadPlayer } from "@/types/api-football";

export type BestElevenPlayer = SquadPlayer & {
  teamId: string;
  teamName: string;
  teamFlag: string;
  teamFifaCode: string;
};

export type CompactPlayer = Pick<SquadPlayer, "id" | "name" | "position">;
