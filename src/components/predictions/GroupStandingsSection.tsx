"use client";

import * as React from "react";

import { GroupPredictionCard } from "@/components/predictions/GroupPredictionCard";
import { GROUPS } from "@/data/teams";
import type { GroupLetter } from "@/types";
import type { GroupPredictions } from "@/types/predictions";

interface GroupStandingsSectionProps {
  groups: GroupPredictions;
  onChange: (groups: GroupPredictions) => void;
  readOnly?: boolean;
}

export function GroupStandingsSection({
  groups,
  onChange,
  readOnly = false,
}: GroupStandingsSectionProps) {
  const [activeGroup, setActiveGroup] = React.useState<GroupLetter | null>(null);
  const [activePosition, setActivePosition] = React.useState<0 | 1 | 2 | 3 | null>(null);

  function handleSelectPosition(group: GroupLetter, position: 0 | 1 | 2 | 3) {
    if (activeGroup === group && activePosition === position) {
      setActiveGroup(null);
      setActivePosition(null);
      return;
    }
    setActiveGroup(group);
    setActivePosition(position);
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-600 via-sky-600 to-blue-700 p-4 shadow-inner sm:p-5">
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-left">
        {readOnly
          ? "Official group-stage final standings"
          : "Tap flags to place teams · Drag rows to reorder standings"}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GROUPS.map((group) => (
          <GroupPredictionCard
            key={group}
            group={group}
            groups={groups}
            onChange={onChange}
            activePosition={activeGroup === group ? activePosition : null}
            onSelectPosition={(position) => handleSelectPosition(group, position)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
