"use client";

import { motion } from "framer-motion";
import { Flame, Target, Timer, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreBoardProps {
  score: number;
  streak: number;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  timeLimit: number;
  highScore?: number;
}

export function ScoreBoard({
  score,
  streak,
  questionIndex,
  totalQuestions,
  timeLeft,
  timeLimit,
  highScore,
}: ScoreBoardProps) {
  const timeWarning = timeLeft <= 5;
  const ratio = timeLimit > 0 ? Math.max(0, Math.min(1, timeLeft / timeLimit)) : 0;
  const high = highScore ?? 0;

  return (
    <div>
      {/* Mobile compact strip */}
      <div className="sm:hidden">
        <motion.div
          animate={timeWarning ? { scale: [1, 1.01, 1] } : { scale: 1 }}
          transition={{ duration: 0.7, repeat: timeWarning ? Infinity : 0 }}
          className={cn(
            "relative overflow-hidden rounded-xl border bg-white/4 px-2.5 py-2 backdrop-blur-xl transition-colors",
            timeWarning ? "border-rose-400/40" : "border-white/10",
          )}
        >
          <div className="flex items-center justify-between gap-1.5">
            <MiniStat
              icon={Target}
              label="Score"
              value={score}
              accent="text-emerald-300"
            />
            <MiniDivider />
            <MiniStat
              icon={Flame}
              label="Streak"
              value={streak}
              accent="text-orange-300"
              pulse={streak >= 3}
            />
            <MiniDivider />
            <MiniStat
              icon={Trophy}
              label="High"
              value={high}
              accent="text-violet-300"
            />
            <MiniDivider />
            <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
              <Timer
                className={cn(
                  "h-3 w-3 shrink-0",
                  timeWarning ? "text-rose-300" : "text-sky-300",
                )}
                aria-hidden
              />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Time
              </span>
              <span
                className={cn(
                  "text-sm font-bold tabular-nums leading-none",
                  timeWarning ? "text-rose-300" : "text-sky-300",
                )}
              >
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Time bar */}
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={cn(
                "h-full origin-left transition-[width,background-color] duration-300",
                timeWarning ? "bg-rose-400" : "bg-sky-400",
              )}
              style={{ width: `${ratio * 100}%` }}
            />
          </div>
        </motion.div>

        <p className="mt-1.5 text-center text-[10px] font-medium text-muted-foreground">
          Question{" "}
          <span className="font-bold text-foreground">
            {Math.min(questionIndex + 1, totalQuestions)}
          </span>{" "}
          / <span className="font-bold text-foreground">{totalQuestions}</span>
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden grid-cols-4 gap-3 sm:grid">
        <Stat
          icon={Target}
          label="Score"
          value={score.toString()}
          accent="from-emerald-400/20 to-teal-500/10"
          textAccent="text-emerald-300"
        />
        <Stat
          icon={Flame}
          label="Streak"
          value={streak.toString()}
          accent="from-orange-400/20 to-rose-500/10"
          textAccent="text-orange-300"
          pulse={streak >= 3}
        />
        <Stat
          icon={Trophy}
          label="High"
          value={high.toString()}
          accent="from-violet-400/20 to-fuchsia-500/10"
          textAccent="text-violet-300"
        />
        <motion.div
          animate={timeWarning ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={{ duration: 0.7, repeat: timeWarning ? Infinity : 0 }}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br p-4 backdrop-blur-xl",
            timeWarning
              ? "border-rose-400/30 from-rose-500/20 to-rose-700/10"
              : "from-sky-400/20 to-indigo-500/10",
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Time
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-bold tabular-nums",
                  timeWarning ? "text-rose-300" : "text-sky-300",
                )}
              >
                {timeLeft}s
              </p>
            </div>
            <Timer
              className={cn(
                "h-5 w-5",
                timeWarning ? "text-rose-300" : "text-sky-300",
              )}
            />
          </div>
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 h-1 origin-left transition-all",
              timeWarning ? "bg-rose-400" : "bg-sky-400",
            )}
            style={{ transform: `scaleX(${ratio})` }}
          />
        </motion.div>

        <div className="col-span-4 text-center text-xs font-medium text-muted-foreground">
          Question{" "}
          <span className="font-bold text-foreground">
            {Math.min(questionIndex + 1, totalQuestions)}
          </span>{" "}
          of <span className="font-bold text-foreground">{totalQuestions}</span>
        </div>
      </div>
    </div>
  );
}

function MiniDivider() {
  return <span aria-hidden className="h-4 w-px shrink-0 bg-white/10" />;
}

function MiniStat({
  icon: Icon,
  label,
  value,
  accent,
  pulse,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: string;
  pulse?: boolean;
}) {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 1, repeat: pulse ? Infinity : 0 }}
      className="flex min-w-0 flex-1 items-center justify-center gap-1"
      title={label}
    >
      <Icon className={cn("h-3 w-3 shrink-0", accent)} aria-hidden />
      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={cn("text-sm font-bold tabular-nums leading-none", accent)}>
        {value}
      </span>
    </motion.div>
  );
}

interface StatProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
  textAccent: string;
  pulse?: boolean;
}

function Stat({ icon: Icon, label, value, accent, textAccent, pulse }: StatProps) {
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 1, repeat: pulse ? Infinity : 0 }}
      className={cn(
        "rounded-2xl border border-white/10 bg-linear-to-br p-4 backdrop-blur-xl",
        accent,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className={cn("mt-1 text-2xl font-bold tabular-nums", textAccent)}>
            {value}
          </p>
        </div>
        <Icon className={cn("h-5 w-5", textAccent)} />
      </div>
    </motion.div>
  );
}
