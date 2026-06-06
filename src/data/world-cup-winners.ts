/** All-time FIFA World Cup champions, sorted by titles (most first). */
export type WorldCupWinner = {
  rank: number;
  country: string;
  /** ISO flag code for flagcdn.com */
  flagCode: string;
  titles: number;
  years: number[];
  /** Link to /teams/[id] when the nation is in the WC26 squad list */
  teamId?: string;
};

const flag = (code: string) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

const RAW: Omit<WorldCupWinner, "rank">[] = [
  {
    country: "Brazil",
    flagCode: "br",
    titles: 5,
    years: [1958, 1962, 1970, 1994, 2002],
    teamId: "bra",
  },
  {
    country: "Germany",
    flagCode: "de",
    titles: 4,
    years: [1954, 1974, 1990, 2014],
    teamId: "ger",
  },
  {
    country: "Italy",
    flagCode: "it",
    titles: 4,
    years: [1934, 1938, 1982, 2006],
  },
  {
    country: "Argentina",
    flagCode: "ar",
    titles: 3,
    years: [1978, 1986, 2022],
    teamId: "arg",
  },
  {
    country: "France",
    flagCode: "fr",
    titles: 2,
    years: [1998, 2018],
    teamId: "fra",
  },
  {
    country: "Uruguay",
    flagCode: "uy",
    titles: 2,
    years: [1930, 1950],
    teamId: "uru",
  },
  {
    country: "England",
    flagCode: "gb-eng",
    titles: 1,
    years: [1966],
    teamId: "eng",
  },
  {
    country: "Spain",
    flagCode: "es",
    titles: 1,
    years: [2010],
    teamId: "esp",
  },
];

export const WORLD_CUP_WINNERS: WorldCupWinner[] = RAW.map((entry, i) => ({
  ...entry,
  rank: i + 1,
}));

export function winnerFlag(code: string) {
  return flag(code);
}
