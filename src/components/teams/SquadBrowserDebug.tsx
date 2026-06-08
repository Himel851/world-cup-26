"use client";

import { useEffect, useState } from "react";

type SquadDebugData = {
  teamId: string;
  fifaCode: string;
  teamName: string;
  apiConfigured: boolean;
  apiKeyLength: number;
  season: number;
  configuredSeason: number;
  squadLoaded: boolean;
  playerCount: number;
  unavailableReason: string | null;
  timestamp: string;
  env?: string;
  error?: string;
};

interface SquadBrowserDebugProps {
  teamId: string;
}

export function SquadBrowserDebug({ teamId }: SquadBrowserDebugProps) {
  const [debug, setDebug] = useState<SquadDebugData | null>(null);

  useEffect(() => {
    fetch(`/api/debug/squad?id=${teamId}`)
      .then((res) => res.json())
      .then((data: SquadDebugData) => {
        console.log("[squad-debug] browser console", data);
        setDebug(data);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[squad-debug] browser fetch failed", message);
        setDebug({
          teamId,
          fifaCode: "",
          teamName: "",
          apiConfigured: false,
          apiKeyLength: 0,
          season: 0,
          configuredSeason: 0,
          squadLoaded: false,
          playerCount: 0,
          unavailableReason: null,
          timestamp: new Date().toISOString(),
          error: message,
        });
      });
  }, [teamId]);

  if (!debug) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <details className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-amber-300">
          Squad debug (live) — open browser console for [squad-debug]
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs text-muted-foreground">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </details>
    </section>
  );
}
