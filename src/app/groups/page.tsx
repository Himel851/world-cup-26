import type { Metadata } from "next";

import { GroupsGrid } from "@/components/home/GroupsGrid";

export const metadata: Metadata = {
  title: "Groups",
  description: "All 12 World Cup 2026 groups — 48 nations drawn across Groups A to L.",
};

export const revalidate = 3600;

export default function GroupsPage() {
  return <GroupsGrid />;
}
