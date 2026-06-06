import Image from "next/image";
import { MapPin } from "lucide-react";

import { HOST_STADIUM_GROUPS, hostFlag, TOTAL_HOST_STADIUMS } from "@/data/host-stadiums";

export function HostStadiums() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            <MapPin className="h-3.5 w-3.5" />
            Host Stadiums
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {TOTAL_HOST_STADIUMS} Venues · 3 Nations
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Every stadium hosting matches across the United States, Mexico and Canada in 2026.
          </p>
        </div>
        <div className="h-px flex-1 bg-white/10 sm:max-w-xs" aria-hidden />
      </div>

      <div className="space-y-10">
        {HOST_STADIUM_GROUPS.map((group) => (
          <div key={group.country}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="relative h-4 w-6 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10">
                <Image
                  src={hostFlag(group.flagCode)}
                  alt=""
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground/90">
                {group.country}
              </h3>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.stadiums.map((stadium) => (
                <li
                  key={stadium.id}
                  className="rounded-xl border border-white/10 bg-white/3 px-4 py-3.5"
                >
                  <p className="font-semibold leading-snug">{stadium.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stadium.displayCity}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
