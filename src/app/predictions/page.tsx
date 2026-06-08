import type { Metadata } from "next";

import { PredictionsClient } from "@/components/predictions/PredictionsClient";

export const metadata: Metadata = {
  title: "Predictions",
  description:
    "Predict World Cup 2026 group standings, third-place advancers, and the full knockout bracket through the final.",
};

export default function PredictionsPage() {
  return <PredictionsClient />;
}
