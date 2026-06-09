import { TournamentStats } from "@/components/home/TournamentStats";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tournament Facts",
  description:
    "FIFA World Cup 2026 facts and figures — 48 teams, 12 groups, 104 matches, and 16 host cities across North America.",
  path: "/tournament",
  keywords: [...WC26_KEYWORDS, "tournament format", "World Cup facts", "host nations", "expanded World Cup"],
});

export const revalidate = 3600;

export default function TournamentPage() {
  return <TournamentStats />;
}
