"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarClock,
  Gamepad2,
  Goal,
  Moon,
  Sun,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home", icon: Goal },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/fixtures", label: "Fixtures", icon: CalendarClock },
  { href: "/quiz", label: "Quiz", icon: Gamepad2 },
  // { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/daily-challenge", label: "Daily", icon: Calendar },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[var(--background)]/70 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="World Cup Challenge home"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-[0_0_24px_rgba(34,211,164,0.55)] transition-transform group-hover:scale-110">
            <Goal className="h-5 w-5 text-emerald-950" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              FIFA &apos;26
            </span>
            <span className="text-base font-bold tracking-tight text-gradient">
              World Cup Challenge
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-white/[0.06] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ y: -8, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 8, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="grid place-items-center cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>

          <Button asChild variant="glow" size="sm" className="hidden md:inline-flex">
            <Link href="/quiz">Start Quiz</Link>
          </Button>

          {/* Hamburger removed on mobile — MobileTabBar handles primary nav. Kept for theme menu/etc if needed later. */}
        </div>
      </nav>

    </header>
  );
}
