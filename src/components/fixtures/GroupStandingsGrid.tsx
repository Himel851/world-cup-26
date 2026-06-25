"use client";

import * as React from "react";

import { GroupStandingsTable } from "@/components/fixtures/GroupStandingsTable";
import { ThirdPlaceStandingsTable } from "@/components/fixtures/ThirdPlaceStandingsTable";
import { GROUPS } from "@/data/teams";
import { computeAllGroupStandings, computeThirdPlaceRanking } from "@/lib/group-standings";
import type { Fixture, GroupLetter } from "@/types";

interface GroupStandingsGridProps {
  fixtures: Fixture[];
  filterGroup?: GroupLetter | "All";
  highlightTeamId?: string;
}

export function GroupStandingsGrid({
  fixtures,
  filterGroup = "All",
  highlightTeamId,
}: GroupStandingsGridProps) {
  const standings = React.useMemo(
    () => computeAllGroupStandings(fixtures),
    [fixtures],
  );

  const thirdPlaceRanking = React.useMemo(
    () => computeThirdPlaceRanking(fixtures),
    [fixtures],
  );

  const groups =
    filterGroup === "All" ? [...GROUPS] : [filterGroup];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-2">
        {groups.map((group) => (
          <GroupStandingsTable
            key={group}
            group={group}
            rows={standings[group]}
            highlightTeamId={highlightTeamId}
          />
        ))}
      </div>

      {filterGroup === "All" && (
        <ThirdPlaceStandingsTable
          rows={thirdPlaceRanking}
          highlightTeamId={highlightTeamId}
        />
      )}
    </div>
  );
}
