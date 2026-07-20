import { PredictionsClient } from "@/components/predictions/PredictionsClient";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Tournament Results",
  description:
    "Official FIFA World Cup 2026 results — group standings, third-place advancers, and the full knockout bracket through the final.",
  path: "/predictions",
  keywords: [...WC26_KEYWORDS, "World Cup results", "tournament bracket", "group standings", "knockout"],
});

export default function PredictionsPage() {
  return <PredictionsClient />;
}
