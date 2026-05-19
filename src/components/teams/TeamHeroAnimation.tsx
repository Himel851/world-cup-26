"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import type { Team } from "@/types";

interface TeamHeroAnimationProps {
  team: Team;
}

export function TeamHeroAnimation({ team }: TeamHeroAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto aspect-[3/2] w-full max-w-lg"
    >
      <motion.div
        className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${team.colors.primary}, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)]"
      >
        <Image
          src={team.flag}
          alt={`${team.name} flag`}
          fill
          sizes="(max-width: 768px) 90vw, 512px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/90 drop-shadow">
            {team.code.toUpperCase().replace("-", " · ")}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow">
            FIFA #{team.fifaRanking}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
