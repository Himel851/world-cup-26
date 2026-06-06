import type { Metadata } from "next";

import { TournamentStats } from "@/components/home/TournamentStats";

export const metadata: Metadata = {
  title: "Tournament Facts",
  description: "Key numbers for FIFA World Cup 2026 — nations, groups, matches and host venues.",
};

export const revalidate = 3600;

export default function TournamentPage() {
  return <TournamentStats />;
}
