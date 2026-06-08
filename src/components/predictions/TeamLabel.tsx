"use client";

import Image from "next/image";

import { TEAMS } from "@/data/teams";
import { cn } from "@/lib/utils";

interface TeamFlagProps {
  teamId: string;
  size?: "sm" | "md";
  className?: string;
}

export function getTeamById(teamId: string) {
  return TEAMS.find((t) => t.id === teamId);
}

export function TeamFlag({ teamId, size = "sm", className }: TeamFlagProps) {
  const team = getTeamById(teamId);
  if (!team) return null;

  const dim = size === "sm" ? "h-4 w-6" : "h-5 w-7";

  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10",
        dim,
        className,
      )}
    >
      <Image src={team.flag} alt="" fill sizes="28px" className="object-cover" />
    </span>
  );
}

interface TeamLabelProps {
  teamId: string;
  className?: string;
  placeholder?: string;
}

export function TeamLabel({ teamId, className, placeholder = "TBD" }: TeamLabelProps) {
  const team = getTeamById(teamId);
  if (!team) {
    return (
      <span className={cn("text-sm text-muted-foreground italic", className)}>
        {placeholder}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-medium", className)}>
      <TeamFlag teamId={teamId} />
      <span className="truncate">{team.name}</span>
    </span>
  );
}
