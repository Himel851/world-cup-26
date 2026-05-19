"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingFlags } from "@/components/FloatingFlags";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-10 sm:pt-16 lg:pt-24">
      <FloatingFlags count={20} />
      <div className="pointer-events-none absolute inset-0 pitch-grid opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          FIFA World Cup 2026 · 48 Nations
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-[88px]"
        >
          <span className="block">World Cup</span>
          <span className="block text-gradient">Challenge</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted-foreground)] sm:text-xl"
        >
          Test your football IQ across 48 nations. Live timer. Streak combos. Daily challenges.
          One global leaderboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mx-auto mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="xl" variant="default" className="group">
            <Link href="/quiz">
              <Play className="h-5 w-5" />
              Start Quiz
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="secondary">
            <Link href="/daily-challenge">
              <Calendar className="h-5 w-5" />
              Today&apos;s Challenge
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
        >
          <span>5 Quiz Modes</span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--muted-foreground)] sm:inline-flex" />
          <span>Live Streak System</span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--muted-foreground)] sm:inline-flex" />
          <span>Daily Leaderboard</span>
        </motion.div>
      </div>
    </section>
  );
}
