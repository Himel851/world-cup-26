import { NextResponse } from "next/server";

import { API_FOOTBALL_KEY, API_FOOTBALL_SEASON } from "@/config/global-variables";
import { TEAMS_BY_ID } from "@/data/teams";
import {
  getApiSeason,
  getTeamSquadByFifaCode,
  isApiFootballConfigured,
  squadUnavailableReason,
} from "@/lib/api-football";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "arg";
  const team = TEAMS_BY_ID[id];

  if (!team) {
    return NextResponse.json({ error: "Team not found", teamId: id }, { status: 404 });
  }

  const squad = isApiFootballConfigured()
    ? await getTeamSquadByFifaCode(team.fifaCode, team.name)
    : null;

  return NextResponse.json({
    teamId: id,
    fifaCode: team.fifaCode,
    teamName: team.name,
    apiConfigured: isApiFootballConfigured(),
    apiKeyLength: API_FOOTBALL_KEY.trim().length,
    season: getApiSeason(),
    configuredSeason: API_FOOTBALL_SEASON,
    squadLoaded: Boolean(squad),
    playerCount: squad?.players.length ?? 0,
    unavailableReason: squad ? null : squadUnavailableReason(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
