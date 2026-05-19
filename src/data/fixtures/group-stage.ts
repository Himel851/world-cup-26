import { WC26_VENUES, type VenueKey } from "@/data/venues";
import type { Fixture, GroupLetter, GroupMatchday } from "@/types";

type RawGroupMatch = {
  id: string;
  group: GroupLetter;
  matchday: GroupMatchday;
  home: string;
  away: string;
  /** ISO 8601 UTC */
  kickoffUtc: string;
  venue: VenueKey;
};

/**
 * Official FIFA World Cup 2026 group-stage fixtures.
 * Schedule source: FIFA / published group-stage draw (Jun 11–28, 2026).
 */
const RAW: RawGroupMatch[] = [
  // ── Group A ──
  { id: "wc26-001", group: "A", matchday: 1, home: "mex", away: "rsa", kickoffUtc: "2026-06-12T01:00:00.000Z", venue: "mexicoCity" },
  { id: "wc26-002", group: "A", matchday: 1, home: "kor", away: "cze", kickoffUtc: "2026-06-12T08:00:00.000Z", venue: "guadalajara" },
  { id: "wc26-025", group: "A", matchday: 2, home: "cze", away: "rsa", kickoffUtc: "2026-06-18T20:00:00.000Z", venue: "mercedes" },
  { id: "wc26-028", group: "A", matchday: 2, home: "mex", away: "kor", kickoffUtc: "2026-06-19T05:00:00.000Z", venue: "guadalajara" },
  { id: "wc26-053", group: "A", matchday: 3, home: "cze", away: "mex", kickoffUtc: "2026-06-25T05:00:00.000Z", venue: "mexicoCity" },
  { id: "wc26-054", group: "A", matchday: 3, home: "rsa", away: "kor", kickoffUtc: "2026-06-25T05:00:00.000Z", venue: "monterrey" },

  // ── Group B ──
  { id: "wc26-003", group: "B", matchday: 1, home: "can", away: "bih", kickoffUtc: "2026-06-12T23:00:00.000Z", venue: "toronto" },
  { id: "wc26-008", group: "B", matchday: 1, home: "qat", away: "swi", kickoffUtc: "2026-06-14T03:00:00.000Z", venue: "levis" },
  { id: "wc26-026", group: "B", matchday: 2, home: "swi", away: "bih", kickoffUtc: "2026-06-19T03:00:00.000Z", venue: "sofi" },
  { id: "wc26-027", group: "B", matchday: 2, home: "can", away: "qat", kickoffUtc: "2026-06-19T06:00:00.000Z", venue: "vancouver" },
  { id: "wc26-051", group: "B", matchday: 3, home: "swi", away: "can", kickoffUtc: "2026-06-24T23:00:00.000Z", venue: "vancouver" },
  { id: "wc26-052", group: "B", matchday: 3, home: "bih", away: "qat", kickoffUtc: "2026-06-24T23:00:00.000Z", venue: "lumen" },

  // ── Group C ──
  { id: "wc26-007", group: "C", matchday: 1, home: "bra", away: "mar", kickoffUtc: "2026-06-14T06:00:00.000Z", venue: "metlife" },
  { id: "wc26-005", group: "C", matchday: 1, home: "hai", away: "sct", kickoffUtc: "2026-06-14T09:00:00.000Z", venue: "gillette" },
  { id: "wc26-030", group: "C", matchday: 2, home: "sct", away: "mar", kickoffUtc: "2026-06-20T06:00:00.000Z", venue: "gillette" },
  { id: "wc26-029", group: "C", matchday: 2, home: "bra", away: "hai", kickoffUtc: "2026-06-20T08:30:00.000Z", venue: "lincoln" },
  { id: "wc26-049", group: "C", matchday: 3, home: "sct", away: "bra", kickoffUtc: "2026-06-25T06:00:00.000Z", venue: "hardRock" },
  { id: "wc26-050", group: "C", matchday: 3, home: "mar", away: "hai", kickoffUtc: "2026-06-25T06:00:00.000Z", venue: "mercedes" },

  // ── Group D ──
  { id: "wc26-004", group: "D", matchday: 1, home: "usa", away: "par", kickoffUtc: "2026-06-13T05:00:00.000Z", venue: "sofi" },
  { id: "wc26-006", group: "D", matchday: 1, home: "aus", away: "tur", kickoffUtc: "2026-06-14T12:00:00.000Z", venue: "vancouver" },
  { id: "wc26-032", group: "D", matchday: 2, home: "usa", away: "aus", kickoffUtc: "2026-06-19T23:00:00.000Z", venue: "lumen" },
  { id: "wc26-031", group: "D", matchday: 2, home: "tur", away: "par", kickoffUtc: "2026-06-20T10:00:00.000Z", venue: "levis" },
  { id: "wc26-059", group: "D", matchday: 3, home: "tur", away: "usa", kickoffUtc: "2026-06-26T09:00:00.000Z", venue: "sofi" },
  { id: "wc26-060", group: "D", matchday: 3, home: "par", away: "aus", kickoffUtc: "2026-06-26T09:00:00.000Z", venue: "levis" },

  // ── Group E ──
  { id: "wc26-010", group: "E", matchday: 1, home: "ger", away: "cuw", kickoffUtc: "2026-06-14T21:00:00.000Z", venue: "nrg" },
  { id: "wc26-009", group: "E", matchday: 1, home: "civ", away: "ecu", kickoffUtc: "2026-06-15T03:00:00.000Z", venue: "lincoln" },
  { id: "wc26-033", group: "E", matchday: 2, home: "ger", away: "civ", kickoffUtc: "2026-06-21T00:00:00.000Z", venue: "toronto" },
  { id: "wc26-034", group: "E", matchday: 2, home: "ecu", away: "cuw", kickoffUtc: "2026-06-21T04:00:00.000Z", venue: "arrowhead" },
  { id: "wc26-055", group: "E", matchday: 3, home: "cuw", away: "civ", kickoffUtc: "2026-06-26T00:00:00.000Z", venue: "lincoln" },
  { id: "wc26-056", group: "E", matchday: 3, home: "ecu", away: "ger", kickoffUtc: "2026-06-26T00:00:00.000Z", venue: "metlife" },

  // ── Group F ──
  { id: "wc26-011", group: "F", matchday: 1, home: "ned", away: "jpn", kickoffUtc: "2026-06-15T00:00:00.000Z", venue: "att" },
  { id: "wc26-012", group: "F", matchday: 1, home: "swe", away: "tun", kickoffUtc: "2026-06-15T08:00:00.000Z", venue: "monterrey" },
  { id: "wc26-035", group: "F", matchday: 2, home: "ned", away: "swe", kickoffUtc: "2026-06-20T21:00:00.000Z", venue: "nrg" },
  { id: "wc26-036", group: "F", matchday: 2, home: "tun", away: "jpn", kickoffUtc: "2026-06-21T08:00:00.000Z", venue: "monterrey" },
  { id: "wc26-057", group: "F", matchday: 3, home: "jpn", away: "swe", kickoffUtc: "2026-06-26T03:00:00.000Z", venue: "att" },
  { id: "wc26-058", group: "F", matchday: 3, home: "tun", away: "ned", kickoffUtc: "2026-06-26T03:00:00.000Z", venue: "arrowhead" },

  // ── Group G ──
  { id: "wc26-016", group: "G", matchday: 1, home: "bel", away: "egy", kickoffUtc: "2026-06-15T23:00:00.000Z", venue: "lumen" },
  { id: "wc26-015", group: "G", matchday: 1, home: "irn", away: "nzl", kickoffUtc: "2026-06-16T05:00:00.000Z", venue: "sofi" },
  { id: "wc26-039", group: "G", matchday: 2, home: "bel", away: "irn", kickoffUtc: "2026-06-21T23:00:00.000Z", venue: "sofi" },
  { id: "wc26-040", group: "G", matchday: 2, home: "nzl", away: "egy", kickoffUtc: "2026-06-22T05:00:00.000Z", venue: "vancouver" },
  { id: "wc26-063", group: "G", matchday: 3, home: "egy", away: "irn", kickoffUtc: "2026-06-27T07:00:00.000Z", venue: "lumen" },
  { id: "wc26-064", group: "G", matchday: 3, home: "nzl", away: "bel", kickoffUtc: "2026-06-27T07:00:00.000Z", venue: "vancouver" },

  // ── Group H ──
  { id: "wc26-014", group: "H", matchday: 1, home: "esp", away: "cpv", kickoffUtc: "2026-06-15T20:00:00.000Z", venue: "mercedes" },
  { id: "wc26-013", group: "H", matchday: 1, home: "ksa", away: "uru", kickoffUtc: "2026-06-16T02:00:00.000Z", venue: "hardRock" },
  { id: "wc26-038", group: "H", matchday: 2, home: "esp", away: "ksa", kickoffUtc: "2026-06-21T20:00:00.000Z", venue: "mercedes" },
  { id: "wc26-037", group: "H", matchday: 2, home: "uru", away: "cpv", kickoffUtc: "2026-06-22T02:00:00.000Z", venue: "hardRock" },
  { id: "wc26-065", group: "H", matchday: 3, home: "cpv", away: "ksa", kickoffUtc: "2026-06-27T04:00:00.000Z", venue: "nrg" },
  { id: "wc26-066", group: "H", matchday: 3, home: "uru", away: "esp", kickoffUtc: "2026-06-27T04:00:00.000Z", venue: "guadalajara" },

  // ── Group I ──
  { id: "wc26-017", group: "I", matchday: 1, home: "fra", away: "sen", kickoffUtc: "2026-06-16T23:00:00.000Z", venue: "metlife" },
  { id: "wc26-018", group: "I", matchday: 1, home: "irq", away: "nor", kickoffUtc: "2026-06-17T02:00:00.000Z", venue: "gillette" },
  { id: "wc26-042", group: "I", matchday: 2, home: "fra", away: "irq", kickoffUtc: "2026-06-23T01:00:00.000Z", venue: "lincoln" },
  { id: "wc26-041", group: "I", matchday: 2, home: "nor", away: "sen", kickoffUtc: "2026-06-23T04:00:00.000Z", venue: "metlife" },
  { id: "wc26-061", group: "I", matchday: 3, home: "nor", away: "fra", kickoffUtc: "2026-06-26T23:00:00.000Z", venue: "gillette" },
  { id: "wc26-062", group: "I", matchday: 3, home: "sen", away: "irq", kickoffUtc: "2026-06-26T23:00:00.000Z", venue: "toronto" },

  // ── Group J ──
  { id: "wc26-019", group: "J", matchday: 1, home: "arg", away: "alg", kickoffUtc: "2026-06-17T05:00:00.000Z", venue: "arrowhead" },
  { id: "wc26-020", group: "J", matchday: 1, home: "aut", away: "jor", kickoffUtc: "2026-06-17T08:00:00.000Z", venue: "levis" },
  { id: "wc26-043", group: "J", matchday: 2, home: "arg", away: "aut", kickoffUtc: "2026-06-22T21:00:00.000Z", venue: "att" },
  { id: "wc26-044", group: "J", matchday: 2, home: "jor", away: "alg", kickoffUtc: "2026-06-23T07:00:00.000Z", venue: "levis" },
  { id: "wc26-069", group: "J", matchday: 3, home: "alg", away: "aut", kickoffUtc: "2026-06-28T06:00:00.000Z", venue: "arrowhead" },
  { id: "wc26-070", group: "J", matchday: 3, home: "jor", away: "arg", kickoffUtc: "2026-06-28T06:00:00.000Z", venue: "att" },

  // ── Group K ──
  { id: "wc26-023", group: "K", matchday: 1, home: "por", away: "cod", kickoffUtc: "2026-06-17T21:00:00.000Z", venue: "nrg" },
  { id: "wc26-024", group: "K", matchday: 1, home: "uzb", away: "col", kickoffUtc: "2026-06-18T08:00:00.000Z", venue: "mexicoCity" },
  { id: "wc26-047", group: "K", matchday: 2, home: "por", away: "uzb", kickoffUtc: "2026-06-23T21:00:00.000Z", venue: "nrg" },
  { id: "wc26-048", group: "K", matchday: 2, home: "col", away: "cod", kickoffUtc: "2026-06-24T08:00:00.000Z", venue: "guadalajara" },
  { id: "wc26-071", group: "K", matchday: 3, home: "col", away: "por", kickoffUtc: "2026-06-28T03:30:00.000Z", venue: "hardRock" },
  { id: "wc26-072", group: "K", matchday: 3, home: "cod", away: "uzb", kickoffUtc: "2026-06-28T03:30:00.000Z", venue: "mercedes" },

  // ── Group L ──
  { id: "wc26-022", group: "L", matchday: 1, home: "eng", away: "cro", kickoffUtc: "2026-06-18T00:00:00.000Z", venue: "att" },
  { id: "wc26-021", group: "L", matchday: 1, home: "gha", away: "pan", kickoffUtc: "2026-06-18T03:00:00.000Z", venue: "toronto" },
  { id: "wc26-045", group: "L", matchday: 2, home: "eng", away: "gha", kickoffUtc: "2026-06-24T00:00:00.000Z", venue: "gillette" },
  { id: "wc26-046", group: "L", matchday: 2, home: "pan", away: "cro", kickoffUtc: "2026-06-24T03:00:00.000Z", venue: "toronto" },
  { id: "wc26-067", group: "L", matchday: 3, home: "pan", away: "eng", kickoffUtc: "2026-06-28T01:00:00.000Z", venue: "metlife" },
  { id: "wc26-068", group: "L", matchday: 3, home: "cro", away: "gha", kickoffUtc: "2026-06-28T01:00:00.000Z", venue: "lincoln" },
];

export const GROUP_STAGE_FIXTURES: Fixture[] = RAW.map((m) => ({
  id: m.id,
  homeTeamId: m.home,
  awayTeamId: m.away,
  group: m.group,
  matchday: m.matchday,
  stage: "group" as const,
  kickoffUtc: m.kickoffUtc,
  venue: WC26_VENUES[m.venue],
  status: "scheduled" as const,
})).sort(
  (a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
);
