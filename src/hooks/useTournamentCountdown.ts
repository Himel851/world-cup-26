"use client";

import { useEffect, useState } from "react";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function computeParts(target: Date): CountdownParts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    expired: diff === 0,
  };
}

/** Live countdown to a fixed tournament kickoff instant. */
export function useTournamentCountdown(kickoffIso: string): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() =>
    computeParts(new Date(kickoffIso)),
  );

  useEffect(() => {
    const target = new Date(kickoffIso);
    const tick = () => setParts(computeParts(target));
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [kickoffIso]);

  return parts;
}
