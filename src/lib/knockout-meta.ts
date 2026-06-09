import { KNOCKOUT_FIXTURES } from "@/data/fixtures/knockout";
import { FINAL_MATCH_ID, THIRD_PLACE_MATCH_ID } from "@/lib/bracket";
import { formatKickoffDate, formatKickoffTime } from "@/lib/utils";

export interface KnockoutMatchMeta {
  venueName: string;
  dateLabel: string;
  timeLabel: string;
  matchLabel: string;
}

function bracketIdToFixtureId(matchId: string): string {
  if (matchId === FINAL_MATCH_ID) return "wc26-ko-final";
  if (matchId === THIRD_PLACE_MATCH_ID) return "wc26-ko-3rd";
  return `wc26-ko-${matchId}`;
}

export function getKnockoutMatchMeta(matchId: string): KnockoutMatchMeta {
  const fixture = KNOCKOUT_FIXTURES.find((f) => f.id === bracketIdToFixtureId(matchId));
  if (!fixture) {
    return {
      venueName: "Venue TBD",
      dateLabel: "Date TBD",
      timeLabel: "",
      matchLabel: "",
    };
  }
  return {
    venueName: fixture.venue.name,
    dateLabel: formatKickoffDate(fixture.kickoffUtc),
    timeLabel: `${formatKickoffTime(fixture.kickoffUtc)} BST`,
    matchLabel: fixture.label ?? "",
  };
}
