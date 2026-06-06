"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  CalendarClock,
  Gamepad2,
  Goal,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Goal },
  { href: "/fixtures", label: "Fixtures", icon: CalendarClock },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/quiz", label: "Quiz", icon: Gamepad2 },
  { href: "/daily-challenge", label: "Daily", icon: Calendar },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Spacer so page content can scroll above the bar (height + safe-area) */}
      <div
        aria-hidden
        className="h-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden"
      />

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-(--background)/85 backdrop-blur-2xl pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.7)] lg:hidden"
      >
        {/* Top sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/30 to-transparent"
        />

        <ul className="mx-auto grid max-w-lg grid-cols-5 px-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex h-14 touch-manipulation flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium tracking-tight transition-colors focus-visible:outline-none",
                    active
                      ? "text-emerald-300"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Active indicator pill at top */}
                  {active && (
                    <motion.span
                      layoutId="mobile-tab-active"
                      className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Soft active glow behind icon */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute top-2 h-9 w-9 rounded-full bg-emerald-400/15 blur-md"
                    />
                  )}

                  <Icon
                    className={cn(
                      "relative z-1 h-[18px] w-[18px] transition-transform duration-200",
                      active ? "scale-110" : "group-hover:scale-105 group-active:scale-95",
                    )}
                  />
                  <span className="relative z-1 leading-none">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
