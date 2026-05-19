"use client";

import { motion } from "framer-motion";
import { Flag, Globe2, Trophy, Users } from "lucide-react";

const STATS = [
  { label: "Nations", value: "48", icon: Flag, accent: "text-emerald-300" },
  { label: "Groups", value: "12", icon: Globe2, accent: "text-sky-300" },
  { label: "Players Captained", value: "48", icon: Users, accent: "text-violet-300" },
  { label: "Trophies on the line", value: "1", icon: Trophy, accent: "text-amber-300" },
];

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-12">
        <div className="pointer-events-none absolute inset-0 pitch-grid opacity-30" />
        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-400/10 via-transparent to-violet-500/10" />

        <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="text-center"
              >
                <Icon className={`mx-auto h-7 w-7 ${s.accent}`} />
                <p className="mt-3 text-4xl font-black tabular-nums sm:text-5xl">{s.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {s.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
