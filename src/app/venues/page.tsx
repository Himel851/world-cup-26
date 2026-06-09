import { HostStadiums } from "@/components/home/HostStadiums";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Host Venues",
  description:
    "FIFA World Cup 2026 stadiums — every host venue in the USA, Mexico and Canada with cities, capacity, and match info.",
  path: "/venues",
  keywords: [...WC26_KEYWORDS, "World Cup stadiums", "host cities", "MetLife Stadium", "venues"],
});

export const revalidate = 3600;

export default function VenuesPage() {
  return <HostStadiums />;
}
