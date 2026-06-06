import type { FixtureVenue } from "@/types";
import { WC26_VENUES } from "@/data/venues";

export type HostCountry = "USA" | "Mexico" | "Canada";

export type HostStadium = FixtureVenue & {
  id: string;
  /** Metro / marketing label shown under the stadium name */
  displayCity: string;
};

export type HostCountryGroup = {
  country: HostCountry;
  flagCode: string;
  stadiums: HostStadium[];
};

const flag = (code: string) => `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

/** WC26 venues grouped by host nation, ordered to match the official host list. */
export const HOST_STADIUM_GROUPS: HostCountryGroup[] = [
  {
    country: "USA",
    flagCode: "us",
    stadiums: [
      { id: "metlife", ...WC26_VENUES.metlife, displayCity: "New York / NJ" },
      { id: "sofi", ...WC26_VENUES.sofi, displayCity: "Los Angeles" },
      { id: "att", ...WC26_VENUES.att, displayCity: "Dallas" },
      { id: "hardRock", ...WC26_VENUES.hardRock, displayCity: "Miami" },
      { id: "levis", ...WC26_VENUES.levis, displayCity: "San Francisco" },
      { id: "mercedes", ...WC26_VENUES.mercedes, displayCity: "Atlanta" },
      { id: "gillette", ...WC26_VENUES.gillette, displayCity: "Boston" },
      { id: "arrowhead", ...WC26_VENUES.arrowhead, displayCity: "Kansas City" },
      { id: "lincoln", ...WC26_VENUES.lincoln, displayCity: "Philadelphia" },
      { id: "lumen", ...WC26_VENUES.lumen, displayCity: "Seattle" },
      { id: "nrg", ...WC26_VENUES.nrg, displayCity: "Houston" },
    ],
  },
  {
    country: "Mexico",
    flagCode: "mx",
    stadiums: [
      { id: "mexicoCity", ...WC26_VENUES.mexicoCity, displayCity: "Mexico City" },
      { id: "monterrey", ...WC26_VENUES.monterrey, displayCity: "Monterrey" },
      { id: "guadalajara", ...WC26_VENUES.guadalajara, displayCity: "Guadalajara" },
    ],
  },
  {
    country: "Canada",
    flagCode: "ca",
    stadiums: [
      { id: "toronto", ...WC26_VENUES.toronto, displayCity: "Toronto" },
      { id: "vancouver", ...WC26_VENUES.vancouver, displayCity: "Vancouver" },
    ],
  },
];

export function hostFlag(code: string) {
  return flag(code);
}

export const TOTAL_HOST_STADIUMS = HOST_STADIUM_GROUPS.reduce(
  (n, g) => n + g.stadiums.length,
  0,
);
