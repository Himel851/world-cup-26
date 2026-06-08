import { unstable_cache } from "next/cache";
import { cache } from "react";

import { API_FOOTBALL_KEY, API_FOOTBALL_SEASON } from "@/config/global-variables";
import { API_CACHE_REVALIDATE } from "@/lib/api-cache";
import { fetchFifaRankings } from "@/lib/fifa-rankings";
import type {
  ApiFootballEnvelope,
  ApiFootballTeam,
  PlayerDetail,
  RawCoach,
  RawPlayerStatistics,
  RawSquadResponse,
  RawApiTeam,
  SquadCoach,
  SquadPlayer,
  TeamSquadData,
} from "@/types/api-football";

const BASE_URL = "https://v3.football.api-sports.io";
export const WC_LEAGUE_ID = 1;
export { API_CACHE_REVALIDATE, API_CACHE_REVALIDATE as SQUAD_REVALIDATE } from "@/lib/api-cache";

const MIN_REQUEST_GAP_MS = 200;
let lastRequestAt = 0;

/** FIFA 3-letter code → alternate codes used by API-Football. */
const API_CODE_ALIASES: Record<string, string[]> = {
  NED: ["NED", "NLD"],
  SUI: ["SUI", "SWI"],
  RSA: ["RSA", "ZAF"],
  SCO: ["SCO", "SCT"],
  KOR: ["KOR", "KOR"],
  USA: ["USA", "US"],
  ENG: ["ENG", "GB-ENG"],
};

export class ApiFootballError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiFootballError";
  }
}

/** Free API-Football plans only allow seasons 2022–2024. Default to 2022. */
export function getApiSeason(): number {
  return API_FOOTBALL_SEASON;
}

function cacheTtl(): number {
  return API_CACHE_REVALIDATE;
}

export function isApiFootballConfigured(): boolean {
  return Boolean(API_FOOTBALL_KEY.trim());
}

function apiKey(): string {
  const key = API_FOOTBALL_KEY.trim();
  if (!key) {
    throw new ApiFootballError("API_FOOTBALL_KEY is not configured in global-variables.ts");
  }
  return key;
}


async function throttle() {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_REQUEST_GAP_MS) {
    await new Promise((r) => setTimeout(r, MIN_REQUEST_GAP_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

function parseEnvelope<T>(data: ApiFootballEnvelope<T>): ApiFootballEnvelope<T> {
  if (data.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    const msgs = Object.values(data.errors as Record<string, string>);
    if (msgs.length > 0) {
      throw new ApiFootballError(msgs.join("; "));
    }
  }
  return data;
}

/** Raw fetch — never writes API error responses into the Next.js fetch cache. */
async function rawApiFetch<T>(
  path: string,
  attempt = 1,
): Promise<ApiFootballEnvelope<T>> {
  await throttle();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": apiKey() },
    cache: "no-store",
  });

  if (res.status === 429 && attempt < 3) {
    await new Promise((r) => setTimeout(r, 1000 * attempt));
    return rawApiFetch(path, attempt + 1);
  }

  if (!res.ok) {
    throw new ApiFootballError(`API-Football request failed: ${res.status}`, res.status);
  }

  return parseEnvelope((await res.json()) as ApiFootballEnvelope<T>);
}

/** Cache only successful responses (errors throw and are not stored). */
function fetchCached<T>(path: string, cacheKey: string[]): Promise<ApiFootballEnvelope<T> | null> {
  return unstable_cache(
    () => rawApiFetch<T>(path),
    ["api-football", ...cacheKey],
    { revalidate: cacheTtl() },
  )().catch((error: unknown) => {
    if (error instanceof ApiFootballError) {
      logApiWarning(error.message);
    }
    return null;
  });
}

async function confederationByTeamCode(): Promise<Map<string, string>> {
  try {
    const rankings = await fetchFifaRankings();
    return new Map(rankings.map((r) => [r.idCountry.toUpperCase(), r.confederation]));
  } catch {
    return new Map();
  }
}

function mapRawTeam(
  { team }: RawApiTeam,
  confederations: Map<string, string>,
): ApiFootballTeam {
  return {
    id: team.id,
    name: team.name,
    code: team.code?.toUpperCase() ?? null,
    logo: team.logo,
    country: team.country,
    confederation: team.code ? confederations.get(team.code.toUpperCase()) ?? null : null,
    coach: null,
  };
}

function codesMatch(fifaCode: string, apiCode: string | null): boolean {
  if (!apiCode) return false;
  const aliases = API_CODE_ALIASES[fifaCode] ?? [fifaCode];
  return aliases.includes(apiCode.toUpperCase());
}

function pickNationalTeam(
  entries: RawApiTeam[],
  fifaCode: string,
  teamName: string,
): RawApiTeam | undefined {
  const nationals = entries.filter(({ team }) => team.national);
  if (!nationals.length) return undefined;

  const byCode = nationals.find(({ team }) => codesMatch(fifaCode, team.code));
  if (byCode) return byCode;

  const normalized = teamName.toLowerCase();
  const byCountry = nationals.find(
    ({ team }) =>
      team.country.toLowerCase() === normalized || team.name.toLowerCase() === normalized,
  );
  if (byCountry) return byCountry;

  if (nationals.length === 1) return nationals[0];

  return undefined;
}

function mapCoach(raw: RawCoach | undefined): SquadCoach | null {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    photo: raw.photo,
    nationality: raw.nationality,
    age: raw.age,
  };
}

function positionOrder(pos: string): number {
  const p = pos.toLowerCase();
  if (p.includes("goal")) return 0;
  if (p.includes("def")) return 1;
  if (p.includes("mid")) return 2;
  if (p.includes("att") || p.includes("for")) return 3;
  return 4;
}

function extractClub(
  stats: RawPlayerStatistics["statistics"],
  nationalTeamId: number,
): { club: string | null; clubLogo: string | null } {
  const clubStat = stats.find(
    (s) => s.team.id !== nationalTeamId && s.league.id !== WC_LEAGUE_ID,
  );
  if (!clubStat) return { club: null, clubLogo: null };
  return { club: clubStat.team.name, clubLogo: clubStat.team.logo };
}

function mapSquadPlayer(
  raw: SquadPlayer,
  nationalTeamId: number,
  enriched?: RawPlayerStatistics,
): SquadPlayer {
  if (!enriched) return raw;

  const club = extractClub(enriched.statistics, nationalTeamId);
  const wcStat = enriched.statistics.find((s) => s.league.id === WC_LEAGUE_ID);

  return {
    ...raw,
    age: enriched.player.age ?? raw.age,
    nationality: enriched.player.nationality ?? raw.nationality,
    height: enriched.player.height ?? raw.height,
    weight: enriched.player.weight ?? raw.weight,
    photo: enriched.player.photo ?? raw.photo,
    number: wcStat?.games.number ?? raw.number,
    position: wcStat?.games.position ?? raw.position,
    club: club.club,
    clubLogo: club.clubLogo,
  };
}

async function fetchTeamPlayerStats(teamId: number): Promise<Map<number, RawPlayerStatistics>> {
  const season = getApiSeason();
  const map = new Map<number, RawPlayerStatistics>();
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const path = `/players?team=${teamId}&season=${season}&page=${page}`;
    const data = await fetchCached<RawPlayerStatistics[]>(path, [
      "player-stats",
      String(teamId),
      String(season),
      String(page),
    ]);
    if (!data) break;

    totalPages = data.paging.total || 1;

    for (const entry of data.response) {
      map.set(entry.player.id, entry);
    }

    page += 1;
  }

  return map;
}

/** World Cup teams for the configured season (paid plans only for 2025+). */
export const getQualifiedTeams = cache(async (): Promise<ApiFootballTeam[]> => {
  if (!isApiFootballConfigured()) return [];

  const season = getApiSeason();
  const path = `/teams?league=${WC_LEAGUE_ID}&season=${season}`;
  const data = await fetchCached<RawApiTeam[]>(path, ["wc-teams", String(season)]);
  if (!data) return [];

  const confederations = await confederationByTeamCode();
  return data.response.map((entry) => mapRawTeam(entry, confederations));
});

/** Resolve national team via WC list, then country/search lookups. */
async function resolveApiTeam(
  fifaCode: string,
  teamName: string,
): Promise<ApiFootballTeam | null> {
  const code = fifaCode.toUpperCase();

  const qualifiedTeams = await getQualifiedTeams();

  const fromLeague = qualifiedTeams.find((t) => codesMatch(code, t.code));
  if (fromLeague) {
    return fromLeague;
  }

  const confederations = await confederationByTeamCode();
  const queries = [
    `/teams?country=${encodeURIComponent(teamName)}`,
    `/teams?search=${encodeURIComponent(teamName)}`,
  ];

  for (const path of queries) {
    const data = await fetchCached<RawApiTeam[]>(path, ["team-lookup", path]);
    if (!data?.response.length) continue;

    const match = pickNationalTeam(data.response, code, teamName);
    if (match) {
      return mapRawTeam(match, confederations);
    }
  }

  return null;
}

export async function getCoach(teamId: number): Promise<SquadCoach | null> {
  if (!isApiFootballConfigured()) return null;

  const path = `/coachs?team=${teamId}`;
  const data = await fetchCached<RawCoach[]>(path, ["coach", String(teamId)]);
  if (!data) return null;

  const active = data.response.find((c) => c.team.id === teamId) ?? data.response[0];
  return mapCoach(active);
}

/** Complete squad for a national team (API numeric id). */
export const getTeamSquad = cache(
  async (teamId: number, meta?: ApiFootballTeam | null): Promise<TeamSquadData | null> => {
    if (!isApiFootballConfigured()) return null;

    const path = `/players/squads?team=${teamId}`;
    const squadData = await fetchCached<RawSquadResponse[]>(path, ["squad", String(teamId)]);
    if (!squadData?.response[0]) return null;

    const squad = squadData.response[0];
    const coach = await getCoach(teamId);

    let enrichedStats = new Map<number, RawPlayerStatistics>();
    try {
      enrichedStats = await fetchTeamPlayerStats(teamId);
    } catch {
      // Squad list still works without club enrichment
    }

    const players: SquadPlayer[] = squad.players
      .map((p) => {
        const base: SquadPlayer = {
          id: p.id,
          name: p.name,
          photo: p.photo,
          number: p.number,
          position: p.position ?? "Unknown",
          age: p.age,
          nationality: null,
          height: null,
          weight: null,
          club: null,
          clubLogo: null,
        };
        return mapSquadPlayer(base, teamId, enrichedStats.get(p.id));
      })
      .sort((a, b) => {
        const po = positionOrder(a.position) - positionOrder(b.position);
        if (po !== 0) return po;
        return (a.number ?? 99) - (b.number ?? 99);
      });

    return {
      team: {
        id: squad.team.id,
        name: squad.team.name,
        code: meta?.code ?? null,
        logo: squad.team.logo ?? meta?.logo ?? null,
        country: meta?.country ?? null,
        confederation: meta?.confederation ?? null,
        coach,
      },
      players,
    };
  },
);

/** Squad for a local WC26 team via fifaCode + name lookup. */
export async function getTeamSquadByFifaCode(
  fifaCode: string,
  teamName: string,
): Promise<TeamSquadData | null> {
  if (!fifaCode || !teamName || !isApiFootballConfigured()) {
    return null;
  }

  try {
    const apiTeam = await resolveApiTeam(fifaCode, teamName);
    if (!apiTeam) {
      logApiWarning(`No API team matched for ${teamName} (${fifaCode})`);
      return null;
    }

    return getTeamSquad(apiTeam.id, apiTeam);
  } catch (error) {
    if (error instanceof ApiFootballError) {
      logApiWarning(error.message);
    }
    return null;
  }
}

function mapPlayerDetail(entry: RawPlayerStatistics): PlayerDetail {
  const nationalStat =
    entry.statistics.find((s) => s.league.id === WC_LEAGUE_ID) ?? entry.statistics[0];

  const nationalTeamId = nationalStat?.team.id;
  const club = nationalTeamId
    ? extractClub(entry.statistics, nationalTeamId)
    : { club: null, clubLogo: null };

  return {
    id: entry.player.id,
    name: entry.player.name,
    firstname: entry.player.firstname,
    lastname: entry.player.lastname,
    photo: entry.player.photo,
    number: nationalStat?.games.number ?? null,
    position: nationalStat?.games.position ?? "Unknown",
    age: entry.player.age,
    nationality: entry.player.nationality,
    height: entry.player.height,
    weight: entry.player.weight,
    club: club.club,
    clubLogo: club.clubLogo,
    birthDate: entry.player.birth.date,
    birthPlace: entry.player.birth.place,
    birthCountry: entry.player.birth.country,
  };
}

function mapSquadPlayerToDetail(player: SquadPlayer): PlayerDetail {
  return {
    ...player,
    firstname: null,
    lastname: null,
    birthDate: null,
    birthPlace: null,
    birthCountry: null,
  };
}

async function fetchPlayerBySeason(playerId: number, season: number): Promise<PlayerDetail | null> {
  const path = `/players?id=${playerId}&season=${season}`;
  const data = await fetchCached<RawPlayerStatistics[]>(path, [
    "player",
    String(playerId),
    String(season),
  ]);
  if (!data?.response[0]) return null;
  return mapPlayerDetail(data.response[0]);
}

/** Full player profile — tries multiple seasons, then squad list fallback. */
export const getPlayer = cache(async (playerId: number): Promise<PlayerDetail | null> => {
  if (!isApiFootballConfigured()) return null;

  const seasons = [...new Set([getApiSeason(), 2024, 2023, 2022])];
  for (const season of seasons) {
    const player = await fetchPlayerBySeason(playerId, season);
    if (player) return player;
  }

  return null;
});

/** Player profile with squad-list fallback when season stats are unavailable. */
export async function getPlayerForTeam(
  localTeamId: string,
  playerId: number,
  fifaCode: string,
  teamName: string,
): Promise<PlayerDetail | null> {
  const fromStats = await getPlayer(playerId);
  if (fromStats) return fromStats;

  const squad = await getTeamSquadByFifaCode(fifaCode, teamName);
  const fromSquad = squad?.players.find((p) => p.id === playerId);
  if (fromSquad) return mapSquadPlayerToDetail(fromSquad);

  return null;
}

export function squadUnavailableReason(): string {
  if (!isApiFootballConfigured()) {
    return "Set API_FOOTBALL_KEY in src/config/global-variables.ts to load live squad lists from API-Football.";
  }
  const season = getApiSeason();
  if (season >= 2025) {
    return `Squad data for season ${season} requires a paid API-Football plan. Free plans support seasons 2022–2024 — set API_FOOTBALL_SEASON=2022 in global-variables.ts.`;
  }
  return "Squad data is not available for this team yet, or the team could not be matched in API-Football.";
}
