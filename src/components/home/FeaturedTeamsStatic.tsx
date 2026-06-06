import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TEAMS } from "@/data/teams";

export function FeaturedTeamsStatic() {
  const featured = [...TEAMS]
    .sort((a, b) => a.fifaRanking - b.fifaRanking)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Top of the Table
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Teams
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            The eight highest-ranked sides heading into the 2026 World Cup.
          </p>
        </div>

        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
        >
          Browse all 48
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {featured.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.id}`}
            className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-emerald-400/40 hover:bg-white/[0.05]"
          >
            <div className="relative mx-auto aspect-[3/2] w-full max-w-[140px] overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image
                src={team.flag}
                alt={`${team.name} flag`}
                fill
                sizes="(max-width: 768px) 50vw, 140px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div className="mt-3 flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold leading-tight sm:text-base">{team.name}</h3>
              <Badge variant="primary" className="shrink-0 text-[10px]">
                #{team.fifaRanking}
              </Badge>
            </div>

            <div className="mt-2 space-y-1 text-xs text-[var(--muted-foreground)]">
              <p className="flex items-center gap-1.5 truncate">
                <Shield className="h-3 w-3 shrink-0" />
                {team.captain}
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                {team.continent}
              </p>
            </div>

            <Badge variant="outline" className="mt-3 text-[10px] uppercase tracking-widest">
              Group {team.group}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
