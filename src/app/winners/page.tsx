import type { Metadata } from "next";

import { WorldCupWinners } from "@/components/home/WorldCupWinners";

export const metadata: Metadata = {
  title: "World Cup Winners",
  description: "All-time FIFA World Cup champions — titles, winning years, and nations.",
};

export const revalidate = 3600;

export default function WinnersPage() {
  return <WorldCupWinners />;
}
