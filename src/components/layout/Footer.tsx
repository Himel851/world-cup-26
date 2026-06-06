import Link from "next/link";
import { Code, Goal, MessageCircle, PlayCircle } from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Tournament",
    links: [
      { href: "/fixtures", label: "Full Schedule" },
      { href: "/teams", label: "All Teams" },
      { href: "/rankings", label: "FIFA Rankings" },
      { href: "/teams?continent=Europe", label: "Europe" },
      { href: "/teams?continent=South+America", label: "South America" },
    ],
  },
  {
    title: "Quiz",
    links: [
      { href: "/quiz", label: "Random Quiz" },
      { href: "/daily-challenge", label: "Daily Challenge" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "#", label: "How it works" },
      { href: "#", label: "Privacy" },
      { href: "#", label: "Contact" },
    ],
  },
];

const SOCIALS = [
  { href: "#", label: "Source", icon: Code },
  { href: "#", label: "Community", icon: MessageCircle },
  { href: "#", label: "Highlights", icon: PlayCircle },
];

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-background md:mt-24">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-b from-transparent to-[var(--background)]/60" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_24px_rgba(34,211,164,0.55)]">
              <Goal className="h-5 w-5 text-emerald-950" />
            </span>
            <span className="text-lg font-bold text-gradient">World Cup 2026</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-[var(--muted-foreground)]">
            Groups, fixtures, squads and quizzes for the FIFA World Cup 2026 — 48 nations across
            USA, Canada and Mexico.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[var(--muted-foreground)] transition-all hover:-translate-y-0.5 hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--foreground)]/80 transition-colors hover:text-emerald-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-[var(--muted-foreground)] sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} World Cup 2026. Not affiliated with FIFA.</p>
          <p>Built with Next.js · Tailwind · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
