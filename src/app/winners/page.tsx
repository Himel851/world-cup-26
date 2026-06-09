import { WorldCupWinners } from "@/components/home/WorldCupWinners";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "World Cup Winners",
  description:
    "All-time FIFA World Cup champions — every winner from 1930 to 2022, titles, finals, and historic nations.",
  path: "/winners",
  keywords: [...WC26_KEYWORDS, "World Cup winners", "champions", "Brazil", "Germany", "Argentina"],
});

export const revalidate = 3600;

export default function WinnersPage() {
  return <WorldCupWinners />;
}
