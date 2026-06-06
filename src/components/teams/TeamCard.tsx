import Image from "next/image";
import Link from "next/link";

import { formatPoints, formatRank } from "@/lib/teams-with-rankings";
import { cn } from "@/lib/utils";
import type { TeamWithRanking } from "@/types";

interface TeamCardProps {
  team: TeamWithRanking;
  className?: string;
}

export function TeamCard({ team, className }: TeamCardProps) {
  return (
    <div className={cn("group", className)}>
      <Link
        href={`/teams/${team.id}`}
        className="block h-full"
        aria-label={`View details for ${team.name}`}
      >
        <article className="flex h-full flex-col rounded border border-white/10 bg-card/60 p-3 transition-colors hover:border-emerald-400/35 hover:bg-card/90 sm:p-3.5">
          <div className="mb-3 flex justify-center sm:mb-3.5">
            <div className="relative h-12 w-16 overflow-hidden rounded shadow-sm ring-1 ring-white/15 sm:h-16 sm:w-20">
              <Image
                src={team.flag}
                alt={`${team.name} flag`}
                fill
                sizes="52px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex min-w-0 items-start justify-between gap-2">
            <h3 className="truncate text-[13px] font-semibold leading-tight tracking-tight sm:text-sm">
              {team.name}
            </h3>
            <span
              className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-black tabular-nums text-black sm:text-[11px]"
              aria-label={`FIFA rank ${formatRank(team)}`}
            >
              {formatRank(team)}
            </span>
          </div>

          <p className="mt-1.5 truncate text-[11px] text-muted-foreground sm:text-xs">
            <span className="tabular-nums">{formatPoints(team)}</span> pts
            <span className="mx-1.5 text-white/20">·</span>
            <span className="font-medium text-emerald-400/85">Group {team.group}</span>
          </p>
        </article>
      </Link>
    </div>
  );
}
