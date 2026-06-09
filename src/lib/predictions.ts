import { getTeamsByGroup, GROUPS } from "@/data/teams";
import {
  BRACKET_MATCHES,
  FINAL_MATCH_ID,
  R32_MATCH_IDS,
  THIRD_PLACE_MATCH_ID,
  getBracketMatch,
} from "@/lib/bracket";
import { getR32MatchSides } from "@/lib/r32-bracket";
import type { GroupLetter } from "@/types";
import type {
  GroupPredictions,
  GroupStanding,
  TournamentPrediction,
} from "@/types/predictions";

export const PREDICTIONS_STORAGE_KEY = "wc26:predictions";

export function emptyGroupStanding(): GroupStanding {
  return ["", "", "", ""];
}

export function createEmptyPredictions(): TournamentPrediction {
  const groups = Object.fromEntries(
    GROUPS.map((g) => [g, emptyGroupStanding()]),
  ) as GroupPredictions;

  return {
    groups,
    thirdPlaceAdvancers: [],
    knockoutWinners: {},
  };
}

export function isGroupComplete(standing: GroupStanding): boolean {
  const filled = standing.filter(Boolean);
  if (filled.length !== 4) return false;
  return new Set(filled).size === 4;
}

export function allGroupsComplete(groups: GroupPredictions): boolean {
  return GROUPS.every((g) => isGroupComplete(groups[g]));
}

export function getThirdPlaceCandidates(groups: GroupPredictions): string[] {
  return GROUPS.map((g) => groups[g][2]).filter(Boolean);
}

export function isThirdPlaceComplete(
  groups: GroupPredictions,
  advancers: string[],
): boolean {
  if (!allGroupsComplete(groups)) return false;
  if (advancers.length !== 8) return false;
  const candidates = new Set(getThirdPlaceCandidates(groups));
  return advancers.every((id) => candidates.has(id));
}

function getMatchWinner(
  matchId: string,
  knockoutWinners: Record<string, string>,
): string | null {
  return knockoutWinners[matchId] || null;
}

function getMatchLoser(
  matchId: string,
  sides: [string, string],
  knockoutWinners: Record<string, string>,
): string | null {
  const winner = getMatchWinner(matchId, knockoutWinners);
  if (!winner) return null;
  const [a, b] = sides;
  if (winner === a) return b || null;
  if (winner === b) return a || null;
  return null;
}

/** Resolve home/away team ids for any bracket match from predictions. */
export function getMatchSides(
  matchId: string,
  prediction: TournamentPrediction,
): [string, string] {
  const match = getBracketMatch(matchId);
  if (!match) return ["", ""];

  if (matchId === THIRD_PLACE_MATCH_ID) {
    const sf1 = getMatchSides("sf-01", prediction);
    const sf2 = getMatchSides("sf-02", prediction);
    const loser1 = getMatchLoser("sf-01", sf1, prediction.knockoutWinners);
    const loser2 = getMatchLoser("sf-02", sf2, prediction.knockoutWinners);
    return [loser1 ?? "", loser2 ?? ""];
  }

  if (match.feedsFrom[0] === null && match.feedsFrom[1] === null) {
    if (R32_MATCH_IDS.includes(matchId as (typeof R32_MATCH_IDS)[number])) {
      return getR32MatchSides(matchId, prediction);
    }
    return ["", ""];
  }

  const [parentA, parentB] = match.feedsFrom;
  const sideA = parentA
    ? getMatchWinner(parentA, prediction.knockoutWinners)
    : null;
  const sideB = parentB
    ? getMatchWinner(parentB, prediction.knockoutWinners)
    : null;

  if (matchId === FINAL_MATCH_ID) {
    return [sideA ?? "", sideB ?? ""];
  }

  return [sideA ?? "", sideB ?? ""];
}

export function isKnockoutMatchReady(
  matchId: string,
  prediction: TournamentPrediction,
): boolean {
  const [a, b] = getMatchSides(matchId, prediction);
  return Boolean(a && b);
}

export function isKnockoutRoundComplete(
  matchIds: string[],
  prediction: TournamentPrediction,
): boolean {
  return matchIds.every((id) => {
    if (!isKnockoutMatchReady(id, prediction)) return false;
    return Boolean(prediction.knockoutWinners[id]);
  });
}

export function isKnockoutComplete(prediction: TournamentPrediction): boolean {
  const koIds = BRACKET_MATCHES.filter((m) => m.stage !== "round_of_32").map(
    (m) => m.id,
  );
  const r32Complete = isKnockoutRoundComplete(R32_MATCH_IDS, prediction);
  const restComplete = koIds.every((id) => {
    if (!isKnockoutMatchReady(id, prediction)) return false;
    return Boolean(prediction.knockoutWinners[id]);
  });
  return r32Complete && restComplete;
}

export function getChampion(prediction: TournamentPrediction): string | null {
  return prediction.knockoutWinners[FINAL_MATCH_ID] || null;
}

export function setGroupPosition(
  groups: GroupPredictions,
  group: GroupLetter,
  teamId: string,
  position: 0 | 1 | 2 | 3,
): GroupPredictions {
  const standing = [...groups[group]] as GroupStanding;
  const prevIdx = standing.indexOf(teamId);
  if (prevIdx >= 0) standing[prevIdx] = "";
  if (standing[position]) {
    const displaced = standing[position];
    standing[position] = teamId;
    if (prevIdx >= 0 && displaced) standing[prevIdx] = displaced;
  } else {
    standing[position] = teamId;
  }
  return { ...groups, [group]: standing };
}

export function clearGroupPosition(
  groups: GroupPredictions,
  group: GroupLetter,
  position: 0 | 1 | 2 | 3,
): GroupPredictions {
  const standing = [...groups[group]] as GroupStanding;
  standing[position] = "";
  return { ...groups, [group]: standing };
}

export function resetGroup(
  groups: GroupPredictions,
  group: GroupLetter,
): GroupPredictions {
  return { ...groups, [group]: emptyGroupStanding() };
}

/** Move a team to another rank (shifts other placed teams). */
export function reorderGroupStanding(
  groups: GroupPredictions,
  group: GroupLetter,
  from: 0 | 1 | 2 | 3,
  to: 0 | 1 | 2 | 3,
): GroupPredictions {
  if (from === to) return groups;

  const standing = [...groups[group]] as GroupStanding;
  const teamId = standing[from];
  if (!teamId) return groups;

  const placed = standing.filter(Boolean);
  const fromPlaced = placed.indexOf(teamId);
  if (fromPlaced < 0) return groups;

  placed.splice(fromPlaced, 1);
  const target = Math.max(0, Math.min(to, placed.length));
  placed.splice(target, 0, teamId);

  const next: GroupStanding = ["", "", "", ""];
  placed.forEach((id, i) => {
    next[i] = id;
  });

  return { ...groups, [group]: next };
}

/** Auto-rank teams in a group (alphabetical — adjust order manually). */
export function autoFillGroup(
  groups: GroupPredictions,
  group: GroupLetter,
): GroupPredictions {
  const ordered = getTeamsByGroup(group)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => t.id);
  return {
    ...groups,
    [group]: [
      ordered[0] ?? "",
      ordered[1] ?? "",
      ordered[2] ?? "",
      ordered[3] ?? "",
    ],
  };
}

export function toggleThirdPlaceAdvancer(
  advancers: string[],
  teamId: string,
): string[] {
  if (advancers.includes(teamId)) {
    return advancers.filter((id) => id !== teamId);
  }
  if (advancers.length >= 8) return advancers;
  return [...advancers, teamId];
}

/** When upstream picks change, drop stale knockout winners. */
export function pruneKnockoutWinners(
  prediction: TournamentPrediction,
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const match of BRACKET_MATCHES) {
    const winner = prediction.knockoutWinners[match.id];
    if (!winner) continue;
    const [a, b] = getMatchSides(match.id, prediction);
    if (winner === a || winner === b) {
      next[match.id] = winner;
    }
  }
  return next;
}

function getDownstreamMatchIds(fromMatchId: string): string[] {
  const out: string[] = [];
  const queue = [fromMatchId];
  const seen = new Set<string>([fromMatchId]);

  while (queue.length) {
    const id = queue.pop()!;
    for (const m of BRACKET_MATCHES) {
      if (m.feedsFrom.includes(id) && !seen.has(m.id)) {
        seen.add(m.id);
        out.push(m.id);
        queue.push(m.id);
      }
    }
  }
  return out;
}

export function setKnockoutWinner(
  prediction: TournamentPrediction,
  matchId: string,
  teamId: string,
): TournamentPrediction {
  const knockoutWinners = { ...prediction.knockoutWinners, [matchId]: teamId };

  for (const downstreamId of getDownstreamMatchIds(matchId)) {
    delete knockoutWinners[downstreamId];
  }

  const updated: TournamentPrediction = { ...prediction, knockoutWinners };
  return {
    ...updated,
    knockoutWinners: pruneKnockoutWinners(updated),
  };
}

export function completionPercent(prediction: TournamentPrediction): number {
  const total = GROUPS.length * 4 + 8 + BRACKET_MATCHES.length;
  let done = 0;

  for (const g of GROUPS) {
    done += prediction.groups[g].filter(Boolean).length;
  }
  done += prediction.thirdPlaceAdvancers.length;

  for (const m of BRACKET_MATCHES) {
    if (prediction.knockoutWinners[m.id]) done += 1;
  }

  return Math.round((done / total) * 100);
}
