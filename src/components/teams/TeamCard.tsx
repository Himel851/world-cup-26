import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
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
        <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-4 transition-colors hover:border-emerald-400/40">
          <div className="relative mx-auto aspect-3/2 w-full max-w-[180px] overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image
              src={team.flag}
              alt={`${team.name} flag`}
              fill
              sizes="(max-width: 768px) 50vw, 180px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
          </div>

          <div className="mt-4 flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-tight tracking-tight">{team.name}</h3>
            <Badge variant="primary" className="shrink-0">
              #{team.fifaRanking}
            </Badge>
          </div>

          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              <span className="truncate">{team.captain}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{team.continent}</span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
              Group {team.group}
            </Badge>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-300">
              View <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
