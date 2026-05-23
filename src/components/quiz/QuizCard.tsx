"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type QuizCardTone = "emerald" | "cyan" | "violet" | "amber" | "rose" | "spectrum";

const TONE_STYLES: Record<
  QuizCardTone,
  {
    gradient: string;
    sheen: string;
    iconColor: string;
    iconGlow: string;
    iconBackdrop: string;
    borderIdle: string;
    borderHover: string;
    focusRing: string;
    ambient: string;
    cta: string;
  }
> = {
  emerald: {
    gradient: "from-emerald-500/[0.12] via-teal-500/[0.06] to-transparent",
    sheen:
      "from-white/[0.06] via-transparent to-transparent group-hover:from-white/[0.09]",
    iconColor: "text-emerald-300",
    iconGlow: "drop-shadow-[0_0_0_rgba(0,0,0,0)] group-hover:drop-shadow-[0_0_18px_rgba(52,211,153,0.55)]",
    iconBackdrop: "bg-emerald-400/25",
    borderIdle: "border-white/[0.08]",
    borderHover:
      "group-hover:border-emerald-400/45 group-hover:shadow-[0_0_0_1px_rgba(52,211,153,0.12),0_24px_50px_-28px_rgba(0,0,0,0.85)]",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:border-emerald-400/60",
    ambient:
      "bg-[radial-gradient(600px_circle_at_-10%_-20%,rgba(52,211,153,0.14),transparent_55%)] opacity-70 group-hover:opacity-100",
    cta: "group-hover:border-emerald-400/40 group-hover:bg-emerald-500/[0.12] group-hover:text-emerald-50 group-hover:shadow-[0_0_28px_-8px_rgba(52,211,153,0.35)]",
  },
  cyan: {
    gradient: "from-cyan-500/[0.12] via-sky-500/[0.05] to-transparent",
    sheen:
      "from-white/[0.06] via-transparent to-transparent group-hover:from-white/[0.09]",
    iconColor: "text-cyan-300",
    iconGlow:
      "group-hover:drop-shadow-[0_0_18px_rgba(103,232,249,0.55)]",
    iconBackdrop: "bg-cyan-400/25",
    borderIdle: "border-white/[0.08]",
    borderHover:
      "group-hover:border-cyan-400/45 group-hover:shadow-[0_0_0_1px_rgba(103,232,249,0.12),0_24px_50px_-28px_rgba(0,0,0,0.85)]",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:border-cyan-400/60",
    ambient:
      "bg-[radial-gradient(580px_circle_at_-12%_-18%,rgba(103,232,249,0.14),transparent_55%)] opacity-70 group-hover:opacity-100",
    cta: "group-hover:border-cyan-400/40 group-hover:bg-cyan-500/[0.12] group-hover:text-cyan-50 group-hover:shadow-[0_0_28px_-8px_rgba(103,232,249,0.35)]",
  },
  violet: {
    gradient: "from-violet-500/[0.14] via-fuchsia-500/[0.06] to-transparent",
    sheen:
      "from-white/[0.06] via-transparent to-transparent group-hover:from-white/[0.09]",
    iconColor: "text-violet-300",
    iconGlow:
      "group-hover:drop-shadow-[0_0_18px_rgba(167,139,250,0.55)]",
    iconBackdrop: "bg-violet-400/25",
    borderIdle: "border-white/[0.08]",
    borderHover:
      "group-hover:border-violet-400/45 group-hover:shadow-[0_0_0_1px_rgba(167,139,250,0.12),0_24px_50px_-28px_rgba(0,0,0,0.85)]",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:border-violet-400/60",
    ambient:
      "bg-[radial-gradient(580px_circle_at_-10%_-20%,rgba(167,139,250,0.16),transparent_55%)] opacity-70 group-hover:opacity-100",
    cta: "group-hover:border-violet-400/40 group-hover:bg-violet-500/[0.12] group-hover:text-violet-50 group-hover:shadow-[0_0_28px_-8px_rgba(167,139,250,0.35)]",
  },
  amber: {
    gradient: "from-amber-500/[0.12] via-orange-500/[0.05] to-transparent",
    sheen:
      "from-white/[0.06] via-transparent to-transparent group-hover:from-white/[0.09]",
    iconColor: "text-amber-300",
    iconGlow:
      "group-hover:drop-shadow-[0_0_18px_rgba(251,191,36,0.5)]",
    iconBackdrop: "bg-amber-400/22",
    borderIdle: "border-white/[0.08]",
    borderHover:
      "group-hover:border-amber-400/45 group-hover:shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_24px_50px_-28px_rgba(0,0,0,0.85)]",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:border-amber-400/60",
    ambient:
      "bg-[radial-gradient(580px_circle_at_-10%_-20%,rgba(251,191,36,0.14),transparent_55%)] opacity-70 group-hover:opacity-100",
    cta: "group-hover:border-amber-400/40 group-hover:bg-amber-500/[0.12] group-hover:text-amber-50 group-hover:shadow-[0_0_28px_-8px_rgba(251,191,36,0.3)]",
  },
  rose: {
    gradient: "from-rose-500/[0.12] via-pink-500/[0.06] to-transparent",
    sheen:
      "from-white/[0.06] via-transparent to-transparent group-hover:from-white/[0.09]",
    iconColor: "text-rose-300",
    iconGlow:
      "group-hover:drop-shadow-[0_0_18px_rgba(251,113,133,0.5)]",
    iconBackdrop: "bg-rose-400/25",
    borderIdle: "border-white/[0.08]",
    borderHover:
      "group-hover:border-rose-400/45 group-hover:shadow-[0_0_0_1px_rgba(251,113,133,0.12),0_24px_50px_-28px_rgba(0,0,0,0.85)]",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:border-rose-400/60",
    ambient:
      "bg-[radial-gradient(580px_circle_at_-10%_-20%,rgba(251,113,133,0.14),transparent_55%)] opacity-70 group-hover:opacity-100",
    cta: "group-hover:border-rose-400/40 group-hover:bg-rose-500/[0.12] group-hover:text-rose-50 group-hover:shadow-[0_0_28px_-8px_rgba(251,113,133,0.3)]",
  },
  spectrum: {
    gradient:
      "from-emerald-500/[0.1] via-violet-500/[0.1] to-cyan-500/[0.08]",
    sheen:
      "from-white/[0.07] via-transparent to-transparent group-hover:from-white/[0.1]",
    iconColor: "text-emerald-200",
    iconGlow:
      "group-hover:drop-shadow-[0_0_20px_rgba(52,211,153,0.45),0_0_28px_rgba(167,139,250,0.35)]",
    iconBackdrop: "bg-linear-to-br from-emerald-400/30 to-violet-500/25",
    borderIdle: "border-white/[0.08]",
    borderHover:
      "group-hover:border-emerald-400/35 group-hover:shadow-[0_0_0_1px_rgba(52,211,153,0.15),0_0_40px_-12px_rgba(167,139,250,0.25),0_24px_50px_-28px_rgba(0,0,0,0.85)]",
    focusRing:
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:border-violet-400/50",
    ambient:
      "bg-[radial-gradient(700px_circle_at_30%_-30%,rgba(52,211,153,0.12),transparent_50%),radial-gradient(500px_circle_at_100%_80%,rgba(167,139,250,0.14),transparent_55%)] opacity-75 group-hover:opacity-100",
    cta: "group-hover:border-emerald-400/35 group-hover:bg-linear-to-r group-hover:from-emerald-500/15 group-hover:to-violet-500/15 group-hover:text-white group-hover:shadow-[0_0_32px_-8px_rgba(52,211,153,0.25)]",
  },
};

interface QuizCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  accent?: string;
  index?: number;
  pickerMode?: boolean;
  choiceHint?: string;
  tone?: QuizCardTone;
  metadata?: string;
}

export function QuizCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
  accent = "from-emerald-400/30 via-teal-500/20 to-transparent",
  index = 0,
  pickerMode = false,
  choiceHint,
  tone = "emerald",
  metadata,
}: QuizCardProps) {
  const ariaLabel = [
    `Start ${title}`,
    choiceHint ?? badge,
    description,
    metadata,
    pickerMode ? "Opens this quiz instantly." : "Play now.",
  ]
    .filter(Boolean)
    .join(". ");

  const t = TONE_STYLES[tone];

  if (!pickerMode) {
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
          aria-label={ariaLabel}
          className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40"
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-100",
              accent,
            )}
          />
          <div className="relative flex items-start justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/6">
              <Icon className="h-5 w-5 text-emerald-300" />
            </div>
            {badge && (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                {badge}
              </span>
            )}
          </div>
          <h3 className="relative mt-5 text-xl font-bold tracking-tight">{title}</h3>
          <p className="relative mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
            Play now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(
          "group relative flex h-full min-h-[11.5rem] touch-manipulation flex-col overflow-hidden rounded-lg border bg-white/2.5 p-3.5 shadow-[0_2px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-2xl transition-[background-color,box-shadow,border-color,transform] duration-500 ease-out motion-reduce:transition-none sm:min-h-[280px] sm:rounded-[1.35rem] sm:p-6",
          "active:scale-[0.985] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
          t.borderIdle,
          t.borderHover,
          t.focusRing,
        )}
      >
        {/* Ambient corner glow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-500",
            t.ambient,
          )}
        />

        {/* Base glass + gradient fill */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-50 transition-[opacity,transform] duration-500 group-hover:opacity-[0.72]",
            t.gradient,
          )}
        />
        {/* Legacy accent layer (optional extra from parent) */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-45",
            accent,
          )}
        />

        {/* Top sheen — brightens on hover */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-b to-50% opacity-40 transition-opacity duration-500 group-hover:opacity-70",
            t.sheen,
          )}
        />

        <div className="relative flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <motion.div
              className={cn(
                "relative grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-black/25 transition-[transform,box-shadow,border-color] duration-500 group-hover:border-white/20 group-hover:bg-white/7 sm:size-13 sm:rounded-2xl",
              )}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-[-4px] rounded-lg opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 sm:inset-[-6px] sm:rounded-2xl sm:blur-lg",
                  t.iconBackdrop,
                )}
              />
              <Icon
                className={cn(
                  "relative z-1 size-4 transition-transform duration-500 group-hover:scale-110 sm:size-[1.35rem]",
                  t.iconColor,
                  t.iconGlow,
                )}
              />
            </motion.div>

            {badge && (
              <span
                className={cn(
                  "shrink-0 rounded-lg border border-white/10 bg-black/30 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors duration-500 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.14em]",
                  "group-hover:border-white/18 group-hover:text-foreground/90",
                )}
                title={badge}
              >
                <span className="sm:hidden">
                  {badge.replace(" QUESTIONS", "Q")}
                </span>
                <span className="hidden sm:inline">{badge}</span>
              </span>
            )}
          </div>

          <h3 className="relative mt-3 text-sm font-bold leading-snug tracking-tight text-foreground sm:mt-6 sm:text-[1.35rem] sm:leading-tight sm:tracking-[-0.02em] lg:text-2xl">
            {title}
          </h3>
          <p className="relative mt-1.5 line-clamp-2 flex-1 text-[11px] leading-relaxed text-muted-foreground sm:mt-2.5 sm:line-clamp-none sm:text-sm">
            {description}
          </p>

          {metadata && (
            <p className="relative mt-2 hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground/80 sm:mt-4 sm:block">
              {metadata}
            </p>
          )}

          <div
            className={cn(
              "relative mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-black/25 py-2 text-[11px] font-semibold tracking-tight text-foreground/95 transition-all duration-500 sm:mt-6 sm:gap-2 sm:rounded-xl sm:py-3.5 sm:text-sm",
              t.cta,
            )}
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Start Quiz</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
