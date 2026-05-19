"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface AnswerFeedbackProps {
  state: "correct" | "wrong" | "timeout" | null;
  correctAnswer: string;
}

export function AnswerFeedback({ state, correctAnswer }: AnswerFeedbackProps) {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md",
            state === "correct"
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
              : "border-rose-400/40 bg-rose-500/10 text-rose-200",
          )}
        >
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-xl",
              state === "correct" ? "bg-emerald-400/20" : "bg-rose-500/20",
            )}
          >
            {state === "correct" ? (
              <Check className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold">
              {state === "correct"
                ? "Correct!"
                : state === "timeout"
                  ? "Time's up!"
                  : "Not quite."}
            </p>
            <p className="truncate text-xs opacity-80">
              {state === "correct"
                ? "Streak extended. On to the next one."
                : `The right answer was ${correctAnswer}.`}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
