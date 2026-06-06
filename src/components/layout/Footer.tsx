import Link from "next/link";
import { Goal } from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import type { IconType } from "react-icons";

const AUTHOR = {
  name: "Nazmul Hasan Himel",
  socials: [
    { href: "https://github.com/Himel851", label: "GitHub profile", icon: FaGithub },
    { href: "https://www.linkedin.com/in/nazmulhimel96/", label: "LinkedIn profile", icon: FaLinkedin },
    { href: "https://www.facebook.com/nazmulhasan.himel", label: "Facebook profile", icon: FaFacebook },
  ] satisfies Array<{ href: string; label: string; icon: IconType }>,
} as const;

const NAV_GROUPS = [
  {
    title: "Tournament",
    links: [
      { href: "/groups", label: "Groups A–L" },
      { href: "/winners", label: "World Cup Winners" },
      { href: "/venues", label: "Host Venues" },
      { href: "/fixtures", label: "Full Schedule" },
      { href: "/teams", label: "All Teams" },
      { href: "/rankings", label: "FIFA Rankings" },
      { href: "/tournament", label: "Tournament Facts" },

    ],
  },
  {
    title: "Quiz",
    links: [
      { href: "/quiz", label: "Quiz Hub" },
      { href: "/quiz?type=flag", label: "Flag Quiz" },
      { href: "/quiz?type=ranking", label: "Ranking Quiz" },
      { href: "/quiz?type=mixed", label: "Mixed Quiz" },
      { href: "/daily-challenge", label: "Daily Challenge" },
      { href: "/leaderboard", label: "Leaderboard" },
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

function AuthorSocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      {AUTHOR.socials.map((s) => {
        const Icon = s.icon;
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/4 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-emerald-400/40 hover:text-emerald-300"
          >
            <Icon className="h-4 w-4" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-background md:mt-24">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-linear-to-b from-transparent to-background/60" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_24px_rgba(34,211,164,0.55)]">
              <Goal className="h-5 w-5 text-emerald-950" />
            </span>
            <span className="text-lg font-bold text-gradient">World Cup 2026</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Live FIFA rankings, squad lists, groups, fixtures, host venues, and World Cup history
            quizzes — 48 nations across USA, Canada and Mexico.
          </p>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-emerald-300"
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} World Cup 2026. Not affiliated with FIFA.</p>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p>
              Built by <span className="font-medium text-foreground/90">{AUTHOR.name}</span>
              {/* <span className="mx-2 text-white/20">·</span>
              Next.js · Tailwind */}
            </p>
            <AuthorSocialLinks className="flex items-center gap-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
