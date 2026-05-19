import type { FixtureVenue } from "@/types";

/** FIFA World Cup 2026 host venues (FIFA stadium names). */
export const WC26_VENUES = {
  mexicoCity: {
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
  },
  guadalajara: {
    name: "Estadio Akron",
    city: "Guadalajara",
    country: "Mexico",
  },
  monterrey: {
    name: "Estadio BBVA",
    city: "Monterrey",
    country: "Mexico",
  },
  toronto: { name: "BMO Field", city: "Toronto", country: "Canada" },
  vancouver: { name: "BC Place", city: "Vancouver", country: "Canada" },
  metlife: {
    name: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
  },
  sofi: { name: "SoFi Stadium", city: "Inglewood", country: "USA" },
  levis: { name: "Levi's Stadium", city: "Santa Clara", country: "USA" },
  gillette: { name: "Gillette Stadium", city: "Foxborough", country: "USA" },
  lincoln: {
    name: "Lincoln Financial Field",
    city: "Philadelphia",
    country: "USA",
  },
  att: { name: "AT&T Stadium", city: "Arlington", country: "USA" },
  nrg: { name: "NRG Stadium", city: "Houston", country: "USA" },
  hardRock: {
    name: "Hard Rock Stadium",
    city: "Miami Gardens",
    country: "USA",
  },
  mercedes: {
    name: "Mercedes-Benz Stadium",
    city: "Atlanta",
    country: "USA",
  },
  lumen: { name: "Lumen Field", city: "Seattle", country: "USA" },
  arrowhead: {
    name: "Arrowhead Stadium",
    city: "Kansas City",
    country: "USA",
  },
} as const satisfies Record<string, FixtureVenue>;

export type VenueKey = keyof typeof WC26_VENUES;
