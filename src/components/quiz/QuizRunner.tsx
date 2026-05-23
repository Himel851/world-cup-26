"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AnswerFeedback } from "@/components/quiz/AnswerFeedback";
import { Confetti } from "@/components/Confetti";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { ScoreBoard } from "@/components/quiz/ScoreBoard";
import { useCountdown } from "@/hooks/useCountdown";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn, formatNumber } from "@/lib/utils";
import type { QuizQuestion, QuizResultRecord } from "@/types";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  /** Identifier used for high-score storage. */
  storageKey: string;
  /** Title shown above the run. */
  title?: string;
  /** Optional pre-game blurb. */
  subtitle?: string;
  mode?: "standard" | "daily";
  onReset?: () => void;
}

type FeedbackState = "correct" | "wrong" | "timeout" | null;

const STREAK_BONUS = 25;
const TIME_BONUS_FACTOR = 4; // points per remaining second on correct
const BASE_POINTS = 100;

export function QuizRunner({
  questions,
  storageKey,
  title = "Random Quiz",
  subtitle,
  mode = "standard",
  onReset,
}: QuizRunnerProps) {
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<FeedbackState>(null);
  const [isLocked, setIsLocked] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const [highScore, setHighScore] = useLocalStorage<number>(`${storageKey}:high`, 0);
  const [history, setHistory] = useLocalStorage<QuizResultRecord[]>(
    `${storageKey}:history`,
    [],
  );

  const total = questions.length;
  const current = questions[index];
  const isLast = index === total - 1;

  const handleAnswer = React.useCallback(
    (option: string | null) => {
      if (isLocked || done) return;
      setIsLocked(true);
      setSelected(option);

      const correct = option !== null && option === current.correctAnswer;
      if (correct) {
        const timeBonus = Math.max(0, timeLeft) * TIME_BONUS_FACTOR;
        const streakBonus = streak * STREAK_BONUS;
        const gained = BASE_POINTS + timeBonus + streakBonus;
        setScore((s) => s + gained);
        setStreak((s) => {
          const next = s + 1;
          if (next > 0 && next % 3 === 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1600);
          }
          return next;
        });
        setCorrectCount((c) => c + 1);
        setFeedback("correct");
      } else {
        setStreak(0);
        setFeedback(option === null ? "timeout" : "wrong");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, isLocked, streak, done],
  );

  const timeLeft = useCountdown(current?.timeLimit ?? 20, current?.id, !isLocked && !done, () =>
    handleAnswer(null),
  );

  const next = React.useCallback(() => {
    if (!isLocked) return;
    setSelected(null);
    setFeedback(null);
    setIsLocked(false);
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }, [isLocked, isLast]);

  // Persist high score & history once on completion
  React.useEffect(() => {
    if (!done) return;
    if (score > highScore) setHighScore(score);
    setHistory((prev) => [
      {
        date: new Date().toISOString(),
        score,
        total,
        streak,
        accuracy: Math.round((correctCount / Math.max(total, 1)) * 100),
        type: mode,
      },
      ...prev,
    ].slice(0, 25));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const reset = () => {
    setIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setSelected(null);
    setFeedback(null);
    setIsLocked(false);
    setDone(false);
    onReset?.();
  };

  useKeyboardShortcut(
    {
      "1": () => current && handleAnswer(current.options[0]),
      "2": () => current && handleAnswer(current.options[1]),
      "3": () => current && handleAnswer(current.options[2]),
      "4": () => current && handleAnswer(current.options[3]),
      enter: () => (isLocked ? next() : undefined),
      " ": () => (isLocked ? next() : undefined),
    },
    !done,
  );

  if (done) {
    const accuracy = Math.round((correctCount / Math.max(total, 1)) * 100);
    const isNewHigh = score >= highScore;
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl sm:p-12"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-violet-500/15" />
        <div className="relative text-center">
          <Trophy className="mx-auto h-12 w-12 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.55)]" />
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            {isNewHigh ? "New High Score!" : "Run complete"}
          </h2>
          <p className="mt-2 text-[var(--muted-foreground)]">
            You finished the {mode === "daily" ? "daily challenge" : "quiz"}. Nice work.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <ResultStat label="Score" value={formatNumber(score)} accent="text-emerald-300" />
            <ResultStat label="Accuracy" value={`${accuracy}%`} accent="text-sky-300" />
            <ResultStat label="Best Streak" value={String(streak)} accent="text-orange-300" />
            <ResultStat label="High Score" value={formatNumber(Math.max(score, highScore))} accent="text-violet-300" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button onClick={reset} variant="glow" size="lg">
              <RotateCcw className="h-4 w-4" />
              Play again
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/leaderboard">
                <Trophy className="h-4 w-4" />
                View leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!current) return null;

  return (
    <div className="relative space-y-3 sm:space-y-6">
      <Confetti active={showConfetti} />

      <header className="flex flex-wrap items-center justify-between gap-2 sm:items-end sm:gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:text-xs sm:tracking-[0.2em]">
            <Sparkles className="mr-1 inline h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {title}
          </p>
          {subtitle && (
            <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
              {subtitle}
            </p>
          )}
        </div>
        <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:h-9 sm:px-3">
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            Exit
          </Link>
        </Button>
      </header>

      <ScoreBoard
        score={score}
        streak={streak}
        questionIndex={index}
        totalQuestions={total}
        timeLeft={timeLeft}
        timeLimit={current.timeLimit}
        highScore={highScore}
      />

      <Progress
        value={index + (isLocked ? 1 : 0)}
        max={total}
        tone={streak >= 3 ? "primary" : "primary"}
      />

      <QuestionCard
        question={current}
        index={index}
        selected={selected}
        isLocked={isLocked}
        onSelect={handleAnswer}
      />

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AnswerFeedback state={feedback} correctAnswer={current.correctAnswer} />
        <Button
          onClick={next}
          disabled={!isLocked}
          variant="glow"
          size="lg"
          className={cn("sm:min-w-[200px]", !isLocked && "opacity-60")}
        >
          {isLast ? "See results" : "Next question"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        Tip · press <kbd className="rounded bg-white/10 px-1.5 py-0.5">1–4</kbd> to answer ·{" "}
        <kbd className="rounded bg-white/10 px-1.5 py-0.5">Enter</kbd> for next
      </p>

      {history.length > 0 && (
        <p className="text-center text-xs text-[var(--muted-foreground)]">
          Last result: {formatNumber(history[0].score)} pts · {history[0].accuracy}% accuracy
        </p>
      )}
    </div>
  );
}

function ResultStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className={cn("mt-1 text-2xl font-bold tabular-nums", accent)}>{value}</p>
    </div>
  );
}
