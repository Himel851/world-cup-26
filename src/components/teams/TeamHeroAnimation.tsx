import Image from "next/image";

import { formatRank } from "@/lib/teams-with-rankings";
import type { TeamWithRanking } from "@/types";

interface TeamHeroAnimationProps {
  team: TeamWithRanking;
}

export function TeamHeroAnimation({ team }: TeamHeroAnimationProps) {
  return (
    <div className="relative mx-auto aspect-3/2 w-full max-w-lg">
      <div className="absolute -inset-6 rounded-4xl bg-emerald-400/10 opacity-60" />
      <div className="relative h-full w-full overflow-hidden rounded-4xl ring-1 ring-white/15 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)]">
        <Image
          src={team.flag}
          alt={`${team.name} flag`}
          fill
          sizes="(max-width: 768px) 90vw, 512px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/90 drop-shadow">
            {team.fifaCode}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow">
            FIFA {formatRank(team)}
          </p>
        </div>
      </div>
    </div>
  );
}
