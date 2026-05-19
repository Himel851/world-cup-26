"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
  index?: number;
  className?: string;
}

export function TeamCard({ team, index = 0, className }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -6 }}
      className={cn("group", className)}
    >
      <Link
        href={`/teams/${team.id}`}
        className="block h-full"
        aria-label={`View details for ${team.name}`}
      >
        <div
          className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 group-hover:border-emerald-400/40 group-hover:shadow-[0_20px_50px_-12px_rgba(34,211,164,0.35)]"
        >
          {/* gradient glow */}
          <div
            className="pointer-events-none absolute -inset-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(400px 200px at 50% 0%, ${team.colors.primary}33, transparent 70%)`,
            }}
          />

          {/* flag */}
          <div className="relative mx-auto aspect-[3/2] w-full max-w-[180px] overflow-hidden rounded-xl ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.04]">
            <Image
              src={team.flag}
              alt={`${team.name} flag`}
              fill
              sizes="(max-width: 768px) 50vw, 180px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="mt-4 flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-tight tracking-tight">
              {team.name}
            </h3>
            <Badge variant="primary" className="shrink-0">
              #{team.fifaRanking}
            </Badge>
          </div>

          <div className="mt-2 space-y-1 text-xs text-[var(--muted-foreground)]">
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
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 translate-x-[-6px]">
              View <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
