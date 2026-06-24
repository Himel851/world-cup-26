import Image from "next/image";
import Link from "next/link";
import { Check, Minus, X } from "lucide-react";

import { TEAMS_BY_ID } from "@/data/teams";
import type { GroupStandingRow } from "@/lib/group-standings";
import { cn } from "@/lib/utils";
import type { GroupLetter } from "@/types";

function FormDot({ result }: { result: GroupStandingRow["form"][number] }) {
  if (result === "W") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-400 ring-1 ring-emerald-500/40"
        title="Win"
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  }
  if (result === "L") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/35"
        title="Loss"
      >
        <X className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  }
  if (result === "D") {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-muted-foreground ring-1 ring-white/15"
        title="Draw"
      >
        <Minus className="h-3 w-3" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      className="h-5 w-5 rounded-full ring-1 ring-white/10"
      title="Not played"
      aria-hidden
    />
  );
}

interface GroupStandingsTableProps {
  group: GroupLetter;
  rows: GroupStandingRow[];
  highlightTeamId?: string;
  className?: string;
}

export function GroupStandingsTable({
  group,
  rows,
  highlightTeamId,
  className,
}: GroupStandingsTableProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]/90",
        className,
      )}
    >
      <header className="border-b border-white/8 px-3 py-2.5 sm:px-4">
        <h3 className="text-sm font-bold text-foreground sm:text-base">Group {group}</h3>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/8 text-[10px] uppercase tracking-wide text-muted-foreground sm:text-[11px]">
              <th className="w-6 px-2 py-2 text-left font-semibold sm:px-3" scope="col">
                #
              </th>
              <th className="min-w-[7rem] px-2 py-2 text-left font-semibold sm:px-3" scope="col">
                Team
              </th>
              <th className="px-1.5 py-2 text-center font-semibold tabular-nums" scope="col">
                MP
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
              <th className="hidden px-1.5 py-2 text-center font-semibold tabular-nums md:table-cell" scope="col">
                GF
              </th>
              <th className="hidden px-1.5 py-2 text-center font-semibold tabular-nums md:table-cell" scope="col">
                GA
              </th>
              <th className="px-1.5 py-2 text-center font-semibold tabular-nums" scope="col">
                GD
              </th>
              <th className="px-2 py-2 text-center font-bold tabular-nums sm:px-3" scope="col">
                Pts
              </th>
              <th className="px-2 py-2 text-center font-semibold sm:px-3" scope="col">
                Form
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const team = TEAMS_BY_ID[row.teamId];
              if (!team) return null;
              const qualifies = row.rank <= 2;
              const highlighted = highlightTeamId === row.teamId;

              return (
                <tr
                  key={row.teamId}
                  className={cn(
                    "border-b border-white/6 last:border-0",
                    highlighted && "bg-emerald-400/8",
                  )}
                >
                  <td className="relative px-2 py-2.5 sm:px-3">
                    {qualifies && (
                      <span
                        className="absolute bottom-1 left-0 top-1 w-0.5 rounded-full bg-sky-400"
                        aria-hidden
                      />
                    )}
                    <span className="tabular-nums text-muted-foreground">{row.rank}</span>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <Link
                      href={`/teams/${team.id}`}
                      className="flex min-w-0 items-center gap-2 transition-colors hover:text-emerald-300"
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
                      <span className="truncate font-medium text-foreground">{team.name}</span>
                    </Link>
                  </td>
                  <td className="px-1.5 py-2.5 text-center tabular-nums text-muted-foreground">
                    {row.played}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums text-muted-foreground sm:table-cell">
                    {row.won}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums text-muted-foreground sm:table-cell">
                    {row.drawn}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums text-muted-foreground sm:table-cell">
                    {row.lost}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums text-muted-foreground md:table-cell">
                    {row.goalsFor}
                  </td>
                  <td className="hidden px-1.5 py-2.5 text-center tabular-nums text-muted-foreground md:table-cell">
                    {row.goalsAgainst}
                  </td>
                  <td
                    className={cn(
                      "px-1.5 py-2.5 text-center tabular-nums",
                      row.goalDifference > 0 && "text-emerald-400",
                      row.goalDifference < 0 && "text-rose-400",
                      row.goalDifference === 0 && "text-muted-foreground",
                    )}
                  >
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  <td className="px-2 py-2.5 text-center text-sm font-bold tabular-nums sm:px-3">
                    {row.points}
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((result, i) => (
                        <FormDot key={i} result={result} />
                      ))}
                    </div>
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
