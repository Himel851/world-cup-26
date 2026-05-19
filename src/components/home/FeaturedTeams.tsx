"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { TEAMS } from "@/data/teams";
import { TeamCard } from "@/components/teams/TeamCard";

export function FeaturedTeams() {
  const featured = [...TEAMS]
    .sort((a, b) => a.fifaRanking - b.fifaRanking)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Top of the Table
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Teams
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            The eight highest-ranked sides heading into the 2026 World Cup.
          </p>
        </motion.div>

        <Link
          href="/teams"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
        >
          Browse all 48
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((team, i) => (
          <TeamCard key={team.id} team={team} index={i} />
        ))}
      </div>
    </section>
  );
}
