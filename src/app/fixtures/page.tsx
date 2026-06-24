import { FixturesExplorer } from "@/components/fixtures/FixturesExplorer";
import { getEnrichedFixtures } from "@/lib/match-service";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Fixtures",
  description:
    "FIFA World Cup 2026 full schedule — 72 group-stage matches and knockout rounds through the final at MetLife Stadium, New Jersey.",
  path: "/fixtures",
  keywords: [...WC26_KEYWORDS, "World Cup schedule", "match fixtures", "kickoff times", "knockout bracket"],
});

export const revalidate = 300;

export default async function FixturesPage() {
  const fixtures = await getEnrichedFixtures();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
      <FixturesExplorer fixtures={fixtures} />
    </div>
  );
}
