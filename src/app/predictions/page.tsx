import { PredictionsClient } from "@/components/predictions/PredictionsClient";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Predictions",
  description:
    "Predict FIFA World Cup 2026 — pick group standings, third-place advancers, and the full knockout bracket through the final.",
  path: "/predictions",
  keywords: [...WC26_KEYWORDS, "World Cup predictions", "bracket predictor", "group standings", "knockout"],
});

export default function PredictionsPage() {
  return <PredictionsClient />;
}
