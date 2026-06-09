import { GroupsGrid } from "@/components/home/GroupsGrid";
import { createPageMetadata, WC26_KEYWORDS } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Groups",
  description:
    "FIFA World Cup 2026 group draw — all 12 groups (A–L) with 48 nations, hosts, and matchups across USA, Mexico and Canada.",
  path: "/groups",
  keywords: [...WC26_KEYWORDS, "World Cup groups", "group stage", "draw", "Group A to L"],
});

export const revalidate = 3600;

export default function GroupsPage() {
  return <GroupsGrid />;
}
