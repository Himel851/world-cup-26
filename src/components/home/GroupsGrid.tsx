import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { GROUPS, getTeamsByGroup } from "@/data/teams";

export function GroupsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            <Star className="h-3.5 w-3.5 fill-emerald-300/30" />
            Tournament Groups
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            All 12 Groups
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            48 nations drawn across Groups A–L for the expanded 2026 World Cup.
          </p>
        </div>
        <Link
          href="/fixtures"
          className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
        >
          View fixtures →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {GROUPS.map((group) => {
          const teams = getTeamsByGroup(group);
          return (
            <article
              key={group}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-emerald-400/30 hover:bg-white/[0.05]"
            >
              <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                Group {group}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {teams.map((team) => (
                  <li key={team.id}>
                    <Link
                      href={`/teams/${team.id}`}
                      className="flex items-center gap-2.5 rounded-lg py-0.5 transition-colors hover:text-emerald-200"
                    >
                      <span className="relative h-4 w-6 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10">
                        <Image
                          src={team.flag}
                          alt=""
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </span>
                      <span className="truncate text-sm font-medium">{team.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
