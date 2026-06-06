"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarClock,
  Gamepad2,
  Goal,
  Moon,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home", icon: Goal },
  { href: "/fixtures", label: "Fixtures", icon: CalendarClock },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/rankings", label: "Ranking", icon: TrendingUp },
  { href: "/quiz", label: "Quiz", icon: Gamepad2 },
  { href: "/daily-challenge", label: "Daily", icon: Calendar },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="FIFA World Cup 2026 home"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500">
            <Goal className="h-5 w-5 text-emerald-950" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              FIFA &apos;26
            </span>
            <span className="text-base font-bold tracking-tight text-gradient">
              World Cup 2026
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/6 text-foreground ring-1 ring-white/10"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-xl"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button asChild variant="glow" size="sm" className="hidden md:inline-flex">
            <Link href="/quiz">Start Quiz</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
