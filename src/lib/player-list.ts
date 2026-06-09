import { cache } from "react";

import { TEAMS_BY_ID } from "@/data/teams";
import playerListData from "@/data/player-list.json";
import type { TeamSquadData, SquadPlayer, PlayerDetail } from "@/types/api-football";

type RawPlayer = {
  id: number;
  name: string;
  photo: string | null;
  blog_slug: string | null;
  blog_title: string | null;
  country_name: string;
  country_code: string;
  position: string;
  birthdate: string | null;
  height: string | null;
  weight: string | null;
  place_of_birth: string | null;
  current_club: string | null;
};

type PlayerListFile = {
  data: {
    players: RawPlayer[];
  };
};

/** Local team id → blog_slug in player-list.json */
const TEAM_BLOG_SLUG: Record<string, string> = {
  mex: "team-mexico",
  rsa: "team-south-africa",
  kor: "team-korea",
  cze: "team-czechia",
  can: "team-canada",
  bih: "team-bosnia-and-herzegovina",
  qat: "team-qatar",
  swi: "team-switzerland",
  bra: "team-brazil",
  mar: "team-morocco",
  hai: "team-haiti",
  sct: "team-scotland",
  usa: "team-united-states",
  par: "team-paraguay",
  aus: "team-australia",
  tur: "team-turkey",
  ger: "team-germany",
  cuw: "team-curacao",
  civ: "team-ivory-coast",
  ecu: "team-ecuador",
  ned: "team-netherlands",
  jpn: "team-japan",
  swe: "team-sweden",
  tun: "team-tunisia",
  bel: "team-belgium",
  egy: "team-egypt",
  irn: "team-iran",
  nzl: "team-new-zealand",
  esp: "team-spain",
  cpv: "team-cape-verde",
  ksa: "team-saudi-arabia",
  uru: "team-uruguay",
  fra: "team-france",
  sen: "team-senegal",
  irq: "team-iraq",
  nor: "team-norway",
  arg: "team-argentina",
  alg: "team-algeria",
  aut: "team-austria",
  jor: "team-jordan",
  por: "team-portugal",
  cod: "team-congo-democratic-republic",
  uzb: "team-uzbekistan",
  col: "team-colombia",
  eng: "team-england",
  cro: "team-croatia",
  gha: "team-ghana",
  pan: "team-panama",
};

const POSITION_ORDER: Record<string, number> = {
  GK: 0,
  DEF: 1,
  MID: 2,
  FWD: 3,
};

const allPlayers = (playerListData as PlayerListFile).data.players;

function mapPlayer(raw: RawPlayer): SquadPlayer {
  return {
    id: raw.id,
    name: raw.name,
    photo: raw.photo,
    number: null,
    position: raw.position,
    age: null,
    nationality: raw.country_name,
    height: raw.height,
    weight: raw.weight,
    club: raw.current_club,
    clubLogo: null,
  };
}

function playerMatchesTeam(raw: RawPlayer, blogSlug: string, teamName: string): boolean {
  if (raw.blog_slug === blogSlug) return true;
  if (!raw.blog_slug && raw.country_name.toLowerCase() === teamName.toLowerCase()) return true;
  return false;
}

export function getTeamBlogSlug(localTeamId: string): string | null {
  return TEAM_BLOG_SLUG[localTeamId] ?? null;
}

export const getPlayersForTeam = cache((localTeamId: string): SquadPlayer[] => {
  const team = TEAMS_BY_ID[localTeamId];
  const blogSlug = getTeamBlogSlug(localTeamId);
  if (!team || !blogSlug) return [];

  return allPlayers
    .filter((p) => playerMatchesTeam(p, blogSlug, team.name))
    .map(mapPlayer)
    .sort((a, b) => {
      const po =
        (POSITION_ORDER[a.position] ?? 99) - (POSITION_ORDER[b.position] ?? 99);
      if (po !== 0) return po;
      return a.name.localeCompare(b.name);
    });
});

export const getTeamSquadFromList = cache((localTeamId: string): TeamSquadData | null => {
  const team = TEAMS_BY_ID[localTeamId];
  if (!team) return null;

  const players = getPlayersForTeam(localTeamId);
  if (players.length === 0) return null;

  return {
    team: {
      id: 0,
      name: team.name,
      code: team.fifaCode,
      logo: team.flag,
      country: team.name,
      confederation: team.continent,
      coach: null,
    },
    players,
  };
});

export const getPlayerFromList = cache((playerId: number): PlayerDetail | null => {
  const raw = allPlayers.find((p) => p.id === playerId);
  if (!raw) return null;

  return {
    ...mapPlayer(raw),
    firstname: null,
    lastname: null,
    birthDate: raw.birthdate,
    birthPlace: raw.place_of_birth,
    birthCountry: raw.country_name,
  };
});
