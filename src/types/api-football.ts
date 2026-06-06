export type SquadPlayer = {
  id: number;
  name: string;
  photo: string | null;
  number: number | null;
  position: string;
  age: number | null;
  nationality: string | null;
  height: string | null;
  weight: string | null;
  club: string | null;
  clubLogo: string | null;
};

export type SquadCoach = {
  id: number;
  name: string;
  photo: string | null;
  nationality: string | null;
  age: number | null;
};

export type ApiFootballTeam = {
  id: number;
  name: string;
  code: string | null;
  logo: string | null;
  country: string | null;
  confederation: string | null;
  coach: SquadCoach | null;
};

export type TeamSquadData = {
  team: ApiFootballTeam;
  players: SquadPlayer[];
};

export type PlayerDetail = SquadPlayer & {
  firstname: string | null;
  lastname: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  birthCountry: string | null;
};

/** Raw API-Football response shapes (subset we use). */
export type ApiFootballEnvelope<T> = {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | unknown[];
  results: number;
  paging: { current: number; total: number };
  response: T;
};

export type RawApiTeam = {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue?: {
    id: number;
    name: string;
    city: string;
  };
};

export type RawSquadPlayer = {
  id: number;
  name: string;
  age: number | null;
  number: number | null;
  position: string | null;
  photo: string | null;
};

export type RawSquadResponse = {
  team: { id: number; name: string; logo: string };
  players: RawSquadPlayer[];
};

export type RawCoach = {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number | null;
  nationality: string | null;
  photo: string | null;
  team: { id: number; name: string; logo: string };
  career: Array<{ team: { id: number; name: string }; start: string; end: string | null }>;
};

export type RawPlayerStatistics = {
  player: {
    id: number;
    name: string;
    firstname: string;
    lastname: string;
    age: number | null;
    birth: { date: string | null; place: string | null; country: string | null };
    nationality: string | null;
    height: string | null;
    weight: string | null;
    photo: string | null;
  };
  statistics: Array<{
    team: { id: number; name: string; logo: string };
    league: { id: number; name: string; country: string; logo: string };
    games: { number: number | null; position: string | null; captain: boolean };
  }>;
};
