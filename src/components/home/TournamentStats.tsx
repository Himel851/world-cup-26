import { Building2, Flag, Globe2, Trophy } from "lucide-react";

import { TOURNAMENT_STATS } from "@/data/tournament";

const STATS = [
  {
    label: "Nations",
    value: String(TOURNAMENT_STATS.nations),
    icon: Flag,
    accent: "text-emerald-300",
  },
  {
    label: "Groups",
    value: String(TOURNAMENT_STATS.groups),
    icon: Globe2,
    accent: "text-sky-300",
  },
  {
    label: "Matches",
    value: String(TOURNAMENT_STATS.totalMatches),
    icon: Trophy,
    accent: "text-amber-300",
  },
  {
    label: "Host Venues",
    value: String(TOURNAMENT_STATS.hostVenues),
    icon: Building2,
    accent: "text-violet-300",
  },
] as const;

export function TournamentStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-lg sm:p-10">
        <div className="pointer-events-none absolute inset-0 pitch-grid opacity-10" />

        <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center">
                <Icon className={`mx-auto h-6 w-6 sm:h-7 sm:w-7 ${s.accent}`} />
                <p className="mt-3 text-3xl font-black tabular-nums sm:text-5xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] sm:text-xs">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
