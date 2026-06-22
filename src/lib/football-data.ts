import { unstable_cache } from "next/cache";

import { FOOTBALL_DATA_TOKEN } from "@/config/global-variables";
import type { FdMatch, FdMatchesResponse } from "@/types/football-data";

const BASE_URL = "https://api.football-data.org/v4";
const WC_COMPETITION = "WC";
const WC_SEASON = 2026;

/** Free tier: delayed scores — refresh every 5 minutes during the tournament. */
const MATCHES_REVALIDATE = 5 * 60;

export function isFootballDataConfigured(): boolean {
  return Boolean(FOOTBALL_DATA_TOKEN.trim());
}

async function footballDataFetch<T>(path: string): Promise<T | null> {
  const token = FOOTBALL_DATA_TOKEN.trim();
  if (!token) return null;

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": token },
    cache: "no-store",
  });

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[football-data] ${path} → ${res.status}`);
    }
    return null;
  }

  return (await res.json()) as T;
}

const fetchWorldCupMatchesCached = unstable_cache(
  async (): Promise<FdMatch[]> => {
    const data = await footballDataFetch<FdMatchesResponse>(
      `/competitions/${WC_COMPETITION}/matches?season=${WC_SEASON}`,
    );
    return data?.matches ?? [];
  },
  ["football-data", "wc", String(WC_SEASON), "matches"],
  { revalidate: MATCHES_REVALIDATE },
);

export async function getWorldCupMatches(): Promise<FdMatch[]> {
  if (!isFootballDataConfigured()) return [];
  return fetchWorldCupMatchesCached();
}
