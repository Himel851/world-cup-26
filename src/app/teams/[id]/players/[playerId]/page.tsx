import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Globe2, Ruler, Weight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TEAMS_BY_ID } from "@/data/teams";
import { getPlayer, getPlayerForTeam, isApiFootballConfigured } from "@/lib/api-football";
import { getPlayerFromList } from "@/lib/player-list";
import { getTeamWithRanking } from "@/lib/teams-with-rankings";

interface PageProps {
  params: Promise<{ id: string; playerId: string }>;
}

/** 30 days — matches SQUAD_REVALIDATE in api-football.ts */
export const revalidate = 2592000;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { playerId } = await params;
  const id = Number(playerId);
  const player =
    getPlayerFromList(id) ?? (isApiFootballConfigured() ? await getPlayer(id) : null);

  if (!player) return { title: "Player not found" };
  return {
    title: player.name,
    description: `${player.name} — FIFA World Cup 2026 squad player profile.`,
    openGraph: player.photo ? { images: [player.photo] } : undefined,
  };
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id, playerId } = await params;
  const team = TEAMS_BY_ID[id];
  if (!team) notFound();

  const teamWithRank = await getTeamWithRanking(id);
  const numericPlayerId = Number(playerId);

  const fromList = getPlayerFromList(numericPlayerId);
  const player =
    fromList ??
    (isApiFootballConfigured()
      ? await getPlayerForTeam(id, numericPlayerId, team.fifaCode, team.name)
      : null);

  if (!player) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href={`/teams/${id}`}>
          <ArrowLeft className="h-4 w-4" />
          {teamWithRank?.name ?? team.name}
        </Link>
      </Button>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3">
        <div className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
            {player.photo ? (
              <Image src={player.photo} alt={player.name} fill sizes="128px" className="object-cover" priority />
            ) : (
              <div className="grid h-full w-full place-items-center text-4xl font-black text-muted-foreground">
                {player.number ?? "?"}
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            {player.number != null && (
              <Badge variant="primary" className="mb-2">
                #{player.number}
              </Badge>
            )}
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{player.name}</h1>
            <p className="mt-2 text-muted-foreground">
              {player.position}
              {player.age ? ` · ${player.age} years old` : ""}
            </p>

            {player.club && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                {player.clubLogo && (
                  <div className="relative h-6 w-6">
                    <Image src={player.clubLogo} alt="" fill sizes="24px" className="object-contain" />
                  </div>
                )}
                <span className="text-sm font-medium">{player.club}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 sm:grid-cols-4">
          <Stat icon={Globe2} label="Nationality" value={player.nationality ?? "—"} />
          <Stat icon={Ruler} label="Height" value={player.height ?? "—"} />
          <Stat icon={Weight} label="Weight" value={player.weight ?? "—"} />
          <Stat
            icon={Calendar}
            label="Born"
            value={
              player.birthDate
                ? new Date(player.birthDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
          />
        </div>

        {(player.birthPlace || player.birthCountry) && (
          <p className="border-t border-white/10 px-6 py-4 text-sm text-muted-foreground">
            Place of birth: {[player.birthPlace, player.birthCountry].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background px-4 py-4">
      <Icon className="h-4 w-4 text-emerald-300/80" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
