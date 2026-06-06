import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Flag,
  MapPin,
  Shield,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuizCard {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  badge: string;
}

const QUIZZES: QuizCard[] = [
  {
    title: "Flag Master",
    description: "48 nations. One flag. Two-second window before time runs out.",
    href: "/quiz?type=flag",
    icon: Flag,
    accent: "from-emerald-400/30 via-teal-500/20 to-transparent",
    badge: "Trending",
  },
  {
    title: "Captain Call",
    description: "Match every captain to their national side.",
    href: "/quiz?type=captain",
    icon: Shield,
    accent: "from-sky-400/30 via-cyan-500/20 to-transparent",
    badge: "Hot",
  },
  {
    title: "FIFA Ranking",
    description: "Pick the better-ranked side from a head-to-head.",
    href: "/quiz?type=ranking",
    icon: TrendingUp,
    accent: "from-violet-400/30 via-fuchsia-500/20 to-transparent",
    badge: "New",
  },
  {
    title: "Continental",
    description: "Identify the continent a national team plays for.",
    href: "/quiz?type=continent",
    icon: Compass,
    accent: "from-amber-400/30 via-orange-500/20 to-transparent",
    badge: "Easy",
  },
  {
    title: "Group Draw",
    description: "Which team landed in Group A, F, or L? Find out.",
    href: "/quiz?type=group",
    icon: MapPin,
    accent: "from-pink-400/30 via-rose-500/20 to-transparent",
    badge: "Pro",
  },
];

export function TrendingQuizzes() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
          Test Your Knowledge
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Football Quizzes
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Quiz is one part of the site — challenge yourself with flags, captains, rankings, and more.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUIZZES.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.title}
              href={q.href}
              className="group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 transition-colors hover:border-emerald-400/40"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-linear-to-br ${q.accent} opacity-50`}
              />
              <div className="relative flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/6">
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  {q.badge}
                </span>
              </div>
              <h3 className="relative mt-5 text-xl font-bold tracking-tight">{q.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{q.description}</p>
              <div className="relative mt-6 flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                Play now
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
