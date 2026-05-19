"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { QuizQuestion, QuizType } from "@/types";

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  selected: string | null;
  isLocked: boolean;
  onSelect: (option: string) => void;
}

const TYPE_LABEL: Record<QuizType, string> = {
  flag: "Flag",
  captain: "Captain",
  ranking: "Ranking",
  continent: "Continent",
  group: "Group Stage",
};

const TYPE_ACCENT: Record<QuizType, string> = {
  flag: "from-emerald-400/20 via-teal-400/10 to-transparent",
  captain: "from-sky-400/20 via-cyan-400/10 to-transparent",
  ranking: "from-violet-400/20 via-fuchsia-400/10 to-transparent",
  continent: "from-amber-400/20 via-orange-400/10 to-transparent",
  group: "from-pink-400/20 via-rose-400/10 to-transparent",
};

export function QuestionCard({
  question,
  index,
  selected,
  isLocked,
  onSelect,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={question.id}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:p-8",
        )}
        aria-labelledby={`question-${index}`}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
            TYPE_ACCENT[question.type],
          )}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
              {index + 1}
            </span>
            {TYPE_LABEL[question.type]} question
          </div>

          <h2
            id={`question-${index}`}
            className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
          >
            {question.prompt}
          </h2>

          {question.imageUrl && (
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 220, damping: 22 }}
              className="mx-auto mt-6 aspect-[3/2] w-full max-w-xs overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
            >
              <Image
                src={question.imageUrl}
                alt="Question visual"
                width={480}
                height={320}
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => {
              const isCorrect = option === question.correctAnswer;
              const isPicked = option === selected;
              const showAsCorrect = isLocked && isCorrect;
              const showAsWrong = isLocked && isPicked && !isCorrect;

              return (
                <motion.button
                  key={option}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelect(option)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.1 }}
                  whileHover={!isLocked ? { y: -2, scale: 1.01 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  className={cn(
                    "group relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border px-5 py-4 text-left text-sm font-semibold backdrop-blur-md transition-all duration-200",
                    isLocked
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:border-emerald-400/50 hover:bg-emerald-400/5",
                    showAsCorrect
                      ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100 shadow-[0_0_24px_rgba(34,211,164,0.35)]"
                      : showAsWrong
                        ? "border-rose-400/60 bg-rose-500/15 text-rose-100 shadow-[0_0_24px_rgba(239,68,68,0.35)]"
                        : "border-white/10 bg-white/[0.03] text-[var(--foreground)]",
                  )}
                  aria-pressed={isPicked}
                >
                  <span className="flex items-center gap-3">
                    <kbd
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-md border border-white/15 bg-black/30 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] transition-colors",
                        showAsCorrect && "border-emerald-300/40 text-emerald-200 bg-emerald-400/20",
                        showAsWrong && "border-rose-300/40 text-rose-200 bg-rose-500/20",
                      )}
                      aria-hidden
                    >
                      {i + 1}
                    </kbd>
                    <span className="line-clamp-2">{option}</span>
                  </span>
                  {showAsCorrect && <Check className="h-5 w-5 text-emerald-300" />}
                  {showAsWrong && <X className="h-5 w-5 text-rose-300" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
