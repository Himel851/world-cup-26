"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuizCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  accent?: string;
  index?: number;
}

export function QuizCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  accent = "from-emerald-400/30 via-teal-500/20 to-transparent",
  index = 0,
}: QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={href}
        className={cn(
          "group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100",
            accent,
          )}
        />
        <div className="relative flex items-start justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
            <Icon className="h-5 w-5 text-emerald-300" />
          </div>
          {badge && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              {badge}
            </span>
          )}
        </div>
        <h3 className="relative mt-5 text-xl font-bold tracking-tight">{title}</h3>
        <p className="relative mt-2 text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
        <div className="relative mt-6 flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
          Play now
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        </div>
      </Link>
    </motion.div>
  );
}
