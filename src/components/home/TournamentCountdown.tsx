"use client";

import Link from "next/link";
import { Calendar, Shirt, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTeamById } from "@/data/teams";
import { OPENING_MATCH, TOURNAMENT_KICKOFF } from "@/data/tournament";
import { useTournamentCountdown } from "@/hooks/useTournamentCountdown";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function TournamentCountdown() {
  const parts = useTournamentCountdown(TOURNAMENT_KICKOFF);
  const home = getTeamById(OPENING_MATCH.homeTeamId);
  const away = getTeamById(OPENING_MATCH.awayTeamId);
  const venue = OPENING_MATCH.venue;

  const values = {
    days: parts.days,
    hours: parts.hours,
    minutes: parts.minutes,
    seconds: parts.seconds,
  };

  return (
    <section className="relative isolate overflow-hidden pt-10 sm:pt-14 lg:pt-20">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-lg sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_0%,rgba(34,211,164,0.08),transparent_70%)]" />

          <div className="relative text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              <Zap className="h-3.5 w-3.5" />
              Tournament Countdown
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              টুর্নামেন্ট শুরু হতে আর
            </h1>

            <div
              className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 sm:gap-3"
              role="timer"
              aria-live="polite"
              aria-label={`${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds until kickoff`}
            >
              {UNITS.map((unit, i) => (
                <div key={unit.key} className="flex items-center gap-2 sm:gap-3">
                  {i > 0 && (
                    <span className="mb-5 text-xl font-bold text-emerald-400/80 sm:text-2xl">
                      :
                    </span>
                  )}
                  <div className="flex flex-col items-center">
                    <div className="grid min-w-14 place-items-center rounded-xl border border-white/10 bg-black/30 px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:min-w-18 sm:px-3 sm:py-4">
                      <span className="text-2xl font-black tabular-nums sm:text-4xl">
                        {pad(values[unit.key])}
                      </span>
                    </div>
                    <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)] sm:text-[10px]">
                      {unit.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-[var(--muted-foreground)] sm:text-sm">
              সময়{" "}
              <span className="text-foreground/90">Bangladesh Standard Time (UTC+6)</span>{" "}
              অনুযায়ী
            </p>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Opening match:{" "}
              <span className="font-semibold text-emerald-300">12 June 2026</span>
              {home && away && (
                <>
                  {" "}
                  — {home.name} vs {away.name}
                </>
              )}
              {venue && (
                <>
                  {" "}
                  · {venue.name}, {venue.city}
                </>
              )}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="default">
                <Link href="/teams">
                  <Shirt className="h-4 w-4" />
                  View Squads
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/fixtures">
                  <Calendar className="h-4 w-4" />
                  Full Schedule
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
