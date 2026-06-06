import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

export function DailyChallengeCard() {
  const now = new Date();
  const day = now.getDate();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthShort = now.toLocaleDateString("en-US", { month: "short" });
  const fullDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/daily-challenge"
        aria-label={`Start today's daily challenge — ${fullDate}`}
        className="group relative block rounded-2xl border border-white/10 bg-[#0a0e17] p-5 transition-colors hover:border-emerald-400/40 sm:rounded-4xl sm:p-10 lg:p-12"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/10 via-transparent to-violet-500/10 sm:rounded-4xl" />

        <div className="relative grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300 sm:gap-2 sm:px-3.5 sm:py-1.5 sm:text-xs sm:tracking-[0.18em]">
                  <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Daily challenge
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live · {fullDate}
                </span>
              </div>

              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-400/30 bg-linear-to-br from-emerald-500/25 via-emerald-500/10 to-violet-500/15 text-center sm:hidden">
                <span className="text-lg font-black leading-none tabular-nums text-emerald-100">
                  {day}
                </span>
                <span className="-mt-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">
                  {monthShort}
                </span>
              </div>
            </div>

            <h2 className="text-[1.65rem] font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-[1.05]">
              10 deterministic questions.
              <span className="mt-1 block text-gradient">
                Same set for every player today.
              </span>
            </h2>

            <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground sm:text-[15px]">
              Earn a streak multiplier for every correct answer in a row. Daily challenges reset at
              midnight local time.
            </p>

            <ul className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              <Stat icon={Flame} color="text-orange-300" label="Streak bonus" />
              <Stat icon={Zap} color="text-amber-300" label="Time bonus" />
              <Stat
                icon={Trophy}
                color="text-emerald-300"
                label="Daily board"
                longLabel="Climb the daily board"
              />
            </ul>

            <div className="pt-1 sm:pt-2">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 sm:w-auto sm:px-5 sm:text-base">
                <Sparkles className="h-4 w-4" />
                Begin Daily Quiz
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="relative hidden sm:flex sm:items-stretch sm:justify-end">
            <DateTile day={day} weekday={weekday} monthShort={monthShort} />
          </div>
        </div>
      </Link>
    </section>
  );
}

function Stat({
  icon: Icon,
  color,
  label,
  longLabel,
}: {
  icon: typeof Flame;
  color: string;
  label: string;
  longLabel?: string;
}) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/85 sm:px-2.5 sm:py-1.5 sm:text-xs sm:tracking-[0.14em]">
      <Icon className={`h-3 w-3 ${color} sm:h-3.5 sm:w-3.5`} />
      {longLabel ? (
        <>
          <span className="sm:hidden">{label}</span>
          <span className="hidden sm:inline">{longLabel}</span>
        </>
      ) : (
        label
      )}
    </li>
  );
}

function DateTile({
  day,
  weekday,
  monthShort,
}: {
  day: number;
  weekday: string;
  monthShort: string;
}) {
  return (
    <div className="relative grid h-32 w-32 grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-white/15 bg-white/5 text-foreground sm:h-40 sm:w-40 sm:rounded-[1.75rem]">
      <div className="flex items-center justify-between border-b border-white/10 bg-emerald-500/20 px-3 py-1.5 sm:px-4 sm:py-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-100 sm:text-[10px]">
          {monthShort}
        </span>
        <span className="flex gap-1">
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
        </span>
      </div>
      <div className="grid place-items-center px-2">
        <span className="text-5xl font-black tabular-nums leading-none tracking-tight sm:text-6xl">
          {day}
        </span>
      </div>
      <div className="border-t border-white/10 px-3 py-1.5 text-center sm:px-4 sm:py-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px]">
          {weekday}
        </p>
      </div>
    </div>
  );
}
