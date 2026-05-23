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
          "relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:rounded-3xl sm:p-8",
        )}
        aria-labelledby={`question-${index}`}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-80",
            TYPE_ACCENT[question.type],
          )}
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300 sm:gap-2 sm:text-[11px] sm:tracking-[0.2em]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/15 text-[10px] text-emerald-300 sm:h-7 sm:w-7 sm:text-xs">
              {index + 1}
            </span>
            {TYPE_LABEL[question.type]}
            <span className="hidden sm:inline">&nbsp;question</span>
          </div>

          <h2
            id={`question-${index}`}
            className="mt-2 text-base font-bold leading-snug tracking-tight sm:mt-3 sm:text-3xl sm:leading-tight"
          >
            {question.prompt}
          </h2>

          {question.imageUrl && (
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 220, damping: 22 }}
              className="mx-auto mt-3 aspect-3/2 w-full max-w-[160px] overflow-hidden rounded-lg ring-1 ring-white/15 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] sm:mt-6 sm:max-w-xs sm:rounded-2xl sm:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
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

          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-8 sm:gap-3">
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.1 }}
                  whileHover={!isLocked ? { y: -2, scale: 1.01 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  className={cn(
                    "group relative flex min-h-11 items-center justify-between gap-2 overflow-hidden rounded-lg border px-2.5 py-2 text-left text-[12px] font-semibold backdrop-blur-md transition-all duration-200 sm:min-h-0 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm",
                    isLocked
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:border-emerald-400/50 hover:bg-emerald-400/5",
                    showAsCorrect
                      ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-100 shadow-[0_0_24px_rgba(34,211,164,0.35)]"
                      : showAsWrong
                        ? "border-rose-400/60 bg-rose-500/15 text-rose-100 shadow-[0_0_24px_rgba(239,68,68,0.35)]"
                        : "border-white/10 bg-white/3 text-foreground",
                  )}
                  aria-pressed={isPicked}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
                    <kbd
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded border border-white/15 bg-black/30 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors sm:h-7 sm:w-7 sm:rounded-md sm:text-xs",
                        showAsCorrect && "border-emerald-300/40 bg-emerald-400/20 text-emerald-200",
                        showAsWrong && "border-rose-300/40 bg-rose-500/20 text-rose-200",
                      )}
                      aria-hidden
                    >
                      {i + 1}
                    </kbd>
                    <span className="line-clamp-2 wrap-anywhere leading-tight">
                      {option}
                    </span>
                  </span>
                  {showAsCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-300 sm:h-5 sm:w-5" />}
                  {showAsWrong && <X className="h-4 w-4 shrink-0 text-rose-300 sm:h-5 sm:w-5" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
