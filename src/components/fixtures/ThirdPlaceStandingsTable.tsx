import Image from "next/image";
import Link from "next/link";

import { TEAMS_BY_ID } from "@/data/teams";
import type { ThirdPlaceStandingRow } from "@/lib/group-standings";
import { cn } from "@/lib/utils";

interface ThirdPlaceStandingsTableProps {
  rows: ThirdPlaceStandingRow[];
  highlightTeamId?: string;
  className?: string;
}

export function ThirdPlaceStandingsTable({
  rows,
  highlightTeamId,
  className,
}: ThirdPlaceStandingsTableProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]/90",
        className,
      )}
    >
      <header className="border-b border-white/8 px-3 py-2.5 sm:px-4">
        <h3 className="text-sm font-bold text-foreground sm:text-base">
          Third-placed teams ranking
        </h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
          Top 8 advance to the Round of 32
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/8 text-[10px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
              <th className="w-6 px-2 py-2 text-left font-semibold sm:px-3" scope="col">
                #
              </th>
              <th className="min-w-[8rem] px-2 py-2 text-left font-semibold sm:px-3" scope="col">
                Team
              </th>
              <th className="px-1.5 py-2 text-center font-semibold tabular-nums" scope="col">
                P
              </th>
              <th className="hidden px-1.5 py-2 text-center font-semibold tabular-nums sm:table-cell" scope="col">
                W
              </th>
              <th className="hidden px-1.5 py-2 text-center font-semibold tabular-nums sm:table-cell" scope="col">
                D
              </th>
              <th className="hidden px-1.5 py-2 text-center font-semibold tabular-nums sm:table-cell" scope="col">
                L
              </th>
              <th className="px-1.5 py-2 text-center font-semibold tabular-nums" scope="col">
                F/A
              </th>
              <th className="px-2 py-2 text-center font-bold tabular-nums sm:px-3" scope="col">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const team = TEAMS_BY_ID[row.teamId];
              if (!team) return null;
              const highlighted = highlightTeamId === row.teamId;

              return (
                <tr
                  key={row.teamId}
                  className={cn(
                    "border-b border-white/6 last:border-0",
                    row.qualifies
                      ? "bg-emerald-500/[0.12]"
                      : "bg-white/[0.02] text-muted-foreground",
                    highlighted && "ring-1 ring-inset ring-emerald-400/40",
                  )}
                >
                  <td className="px-2 py-2.5 tabular-nums sm:px-3">{row.rank}</td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <Link
                      href={`/teams/${team.id}`}
                      className={cn(
                        "flex min-w-0 items-center gap-2 transition-colors hover:text-emerald-300",
                        row.qualifies ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <div className="relative h-4 w-6 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/15 sm:h-5 sm:w-7">
                        <Image
                          src={team.flag}
                          alt=""
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                      <span className="truncate font-medium">{team.name}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        ({row.group})
                      </span>
                    </Link>
                  </td>
                  <td className="px-1.5 py-2.5 text-center tabular-nums">{row.played}</td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums sm:table-cell">
                    {row.won}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums sm:table-cell">
                    {row.drawn}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums sm:table-cell">
                    {row.lost}
                  </td>
                  <td className="px-1.5 py-2.5 text-center tabular-nums">
                    {row.goalsFor}/{row.goalsAgainst}
                  </td>
                  <td
                    className={cn(
                      "px-2 py-2.5 text-center text-sm font-bold tabular-nums sm:px-3",
                      row.qualifies && "text-foreground",
                    )}
                  >
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
