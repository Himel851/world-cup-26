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
  const ratio = timeLimit > 0 ? timeLeft / timeLimit : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        value={(highScore ?? 0).toString()}
        accent="from-violet-400/20 to-fuchsia-500/10"
        textAccent="text-violet-300"
      />
      <motion.div
        animate={timeWarning ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.7, repeat: timeWarning ? Infinity : 0 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-4 backdrop-blur-xl",
          timeWarning
            ? "from-rose-500/20 to-rose-700/10 border-rose-400/30"
            : "from-sky-400/20 to-indigo-500/10",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Time
            </p>
            <p className={cn("mt-1 text-2xl font-bold tabular-nums", timeWarning ? "text-rose-300" : "text-sky-300")}>
              {timeLeft}s
            </p>
          </div>
          <Timer className={cn("h-5 w-5", timeWarning ? "text-rose-300" : "text-sky-300")} />
        </div>
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-1 origin-left transition-all",
            timeWarning ? "bg-rose-400" : "bg-sky-400",
          )}
          style={{ transform: `scaleX(${ratio})` }}
        />
      </motion.div>

      <div className="col-span-2 sm:col-span-4 text-center text-xs font-medium text-[var(--muted-foreground)]">
        Question{" "}
        <span className="font-bold text-[var(--foreground)]">
          {Math.min(questionIndex + 1, totalQuestions)}
        </span>{" "}
        of <span className="font-bold text-[var(--foreground)]">{totalQuestions}</span>
      </div>
    </div>
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
        "rounded-2xl border border-white/10 bg-gradient-to-br p-4 backdrop-blur-xl",
        accent,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
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
