import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic-ish PRNG (mulberry32) for daily challenge reproducibility. */
export function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function next() {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seed an integer from a date string like `2026-06-11`. */
export function seedFromDate(date: Date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

/** Fisher-Yates shuffle returning a new array. */
export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pickRandom<T>(arr: T[], rand: () => number = Math.random): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function pickN<T>(arr: T[], n: number, rand: () => number = Math.random): T[] {
  return shuffle(arr, rand).slice(0, n);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** All fixtures are authored and displayed in Bangladesh Standard Time (UTC+6, no DST). */
export const FIXTURE_KICKOFF_TIMEZONE = "Asia/Dhaka" as const;

export function formatKickoffUtc(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleString(undefined, {
    timeZone: FIXTURE_KICKOFF_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    // timeZoneName: "short",
    ...opts,
  });
}

export function formatKickoffDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    timeZone: FIXTURE_KICKOFF_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatKickoffTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    timeZone: FIXTURE_KICKOFF_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
