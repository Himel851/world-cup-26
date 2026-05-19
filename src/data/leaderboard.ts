import type { LeaderboardEntry } from "@/types";

/**
 * Static demo leaderboard. In a real product this would come from an API.
 * Scores tuned to feel competitive but believable for a quiz format.
 */
export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "MessiFan10", country: "Argentina", countryCode: "ar", score: 9820, streak: 47, accuracy: 96, badge: "gold" },
  { rank: 2, username: "Samba_King",  country: "Brazil",    countryCode: "br", score: 9560, streak: 41, accuracy: 94, badge: "silver" },
  { rank: 3, username: "DerKaiser",   country: "Germany",   countryCode: "de", score: 9240, streak: 38, accuracy: 92, badge: "bronze" },
  { rank: 4, username: "VivaEspana",  country: "Spain",     countryCode: "es", score: 8975, streak: 33, accuracy: 91 },
  { rank: 5, username: "LesBleus_98", country: "France",    countryCode: "fr", score: 8800, streak: 29, accuracy: 90 },
  { rank: 6, username: "Oranje_Pride",country: "Netherlands",countryCode: "nl",score: 8615, streak: 26, accuracy: 89 },
  { rank: 7, username: "ThreeLionsUK",country: "England",   countryCode: "gb-eng",score: 8480, streak: 24, accuracy: 88 },
  { rank: 8, username: "AtlasLion",   country: "Morocco",   countryCode: "ma", score: 8210, streak: 23, accuracy: 87, badge: "rising" },
  { rank: 9, username: "SamuraiBlue", country: "Japan",     countryCode: "jp", score: 8120, streak: 22, accuracy: 87 },
  { rank: 10, username: "Vatreni7",   country: "Croatia",   countryCode: "hr", score: 7990, streak: 21, accuracy: 86 },
  { rank: 11, username: "ElTri_MX",   country: "Mexico",    countryCode: "mx", score: 7820, streak: 19, accuracy: 85 },
  { rank: 12, username: "PortugalCR7",country: "Portugal",  countryCode: "pt", score: 7745, streak: 18, accuracy: 84 },
  { rank: 13, username: "Azzurri_06", country: "Italy",     countryCode: "it", score: 7610, streak: 17, accuracy: 83 },
  { rank: 14, username: "USMNT_4Ever",country: "United States",countryCode: "us",score: 7480, streak: 15, accuracy: 82 },
  { rank: 15, username: "SonHM7",     country: "South Korea",countryCode: "kr",score: 7325, streak: 14, accuracy: 81 },
  { rank: 16, username: "LionsTeranga",country:"Senegal",   countryCode: "sn", score: 7210, streak: 13, accuracy: 80, badge: "rising" },
  { rank: 17, username: "RedDevils",  country: "Belgium",   countryCode: "be", score: 7090, streak: 12, accuracy: 79 },
  { rank: 18, username: "AlphonsoCAN",country: "Canada",    countryCode: "ca", score: 6940, streak: 11, accuracy: 78 },
  { rank: 19, username: "Lewy9",      country: "Poland",    countryCode: "pl", score: 6810, streak: 10, accuracy: 77 },
  { rank: 20, username: "Haaland_NOR",country: "Norway",    countryCode: "no", score: 6680, streak: 9,  accuracy: 76 },
];
