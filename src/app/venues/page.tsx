import type { Metadata } from "next";

import { HostStadiums } from "@/components/home/HostStadiums";

export const metadata: Metadata = {
  title: "Host Venues",
  description: "All stadiums hosting FIFA World Cup 2026 matches across the USA, Mexico and Canada.",
};

export const revalidate = 3600;

export default function VenuesPage() {
  return <HostStadiums />;
}
