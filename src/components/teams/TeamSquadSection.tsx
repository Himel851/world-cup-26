import Image from "next/image";
import Link from "next/link";
import { Shirt, User } from "lucide-react";

import type { TeamSquadData } from "@/types/api-football";

const POSITION_LABEL: Record<string, string> = {
  Goalkeeper: "Goalkeepers",
  Defender: "Defenders",
  Midfielder: "Midfielders",
  Attacker: "Forwards",
};

function groupLabel(position: string): string {
  if (position === "G" || position.toLowerCase().includes("goal")) return "Goalkeepers";
  if (position === "D" || position.toLowerCase().includes("def")) return "Defenders";
  if (position === "M" || position.toLowerCase().includes("mid")) return "Midfielders";
  if (position === "F" || position.toLowerCase().includes("att")) return "Forwards";
  return POSITION_LABEL[position] ?? position;
}

interface TeamSquadSectionProps {
  squad: TeamSquadData;
  localTeamId: string;
}

export function TeamSquadSection({ squad, localTeamId }: TeamSquadSectionProps) {
  const groups = new Map<string, typeof squad.players>();

  for (const player of squad.players) {
    const label = groupLabel(player.position);
    const list = groups.get(label) ?? [];
    list.push(player);
    groups.set(label, list);
  }

  const order = ["Goalkeepers", "Defenders", "Midfielders", "Forwards"];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 mt-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            World Cup 2026
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Squad list</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {squad.players.length} players
            {squad.team.coach ? ` · Coach: ${squad.team.coach.name}` : ""}
          </p>
        </div>
        {squad.team.coach?.photo && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-3 py-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/10">
              <Image src={squad.team.coach.photo} alt="" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Head coach
              </p>
              <p className="text-sm font-semibold">{squad.team.coach.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {order
          .filter((g) => groups.has(g))
          .map((groupName) => (
            <div key={groupName}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/90">
                {groupName}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {groups.get(groupName)!.map((player) => (
                  <li key={player.id}>
                    <Link
                      href={`/teams/${localTeamId}/players/${player.id}`}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3 transition-colors hover:border-emerald-400/40 hover:bg-white/5"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                        {player.photo ? (
                          <Image
                            src={player.photo}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid h-full w-full place-items-center text-muted-foreground">
                            <User className="h-5 w-5" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{player.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {player.club ?? player.position}
                          {player.age ? ` · ${player.age} yrs` : ""}
                        </p>
                      </div>

                      {player.number != null && (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-sm font-black tabular-nums text-emerald-300 ring-1 ring-emerald-400/20">
                          {player.number}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {squad.players.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-muted-foreground">
          <Shirt className="mx-auto h-8 w-8 opacity-50" />
          <p className="mt-3 font-medium">No squad data available yet.</p>
        </div>
      )}
    </section>
  );
}

export function SquadUnavailable({ reason }: { reason: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 px-6 py-10 text-center">
        <Shirt className="mx-auto h-8 w-8 text-amber-300/70" />
        <h2 className="mt-3 text-lg font-semibold">Squad data unavailable</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{reason}</p>
      </div>
    </section>
  );
}
