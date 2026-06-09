import type { MetadataRoute } from "next";

import { TEAMS } from "@/data/teams";
import { getPlayersForTeam } from "@/lib/player-list";
import { SITE_URL } from "@/lib/seo";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/best-11", priority: 0.9, changeFrequency: "weekly" },
  { path: "/teams", priority: 0.9, changeFrequency: "daily" },
  { path: "/fixtures", priority: 0.9, changeFrequency: "daily" },
  { path: "/groups", priority: 0.85, changeFrequency: "weekly" },
  { path: "/rankings", priority: 0.85, changeFrequency: "daily" },
  { path: "/quiz", priority: 0.85, changeFrequency: "weekly" },
  { path: "/daily-challenge", priority: 0.85, changeFrequency: "daily" },
  { path: "/predictions", priority: 0.8, changeFrequency: "weekly" },
  { path: "/leaderboard", priority: 0.75, changeFrequency: "daily" },
  { path: "/tournament", priority: 0.75, changeFrequency: "monthly" },
  { path: "/venues", priority: 0.75, changeFrequency: "monthly" },
  { path: "/winners", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ path, priority, changeFrequency }) => ({
      url: path ? `${SITE_URL}${path}` : SITE_URL,
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  const teamRoutes: MetadataRoute.Sitemap = TEAMS.map((team) => ({
    url: `${SITE_URL}/teams/${team.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const playerRoutes: MetadataRoute.Sitemap = TEAMS.flatMap((team) =>
    getPlayersForTeam(team.id).map((player) => ({
      url: `${SITE_URL}/teams/${team.id}/players/${player.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  );

  return [...staticRoutes, ...teamRoutes, ...playerRoutes];
}
