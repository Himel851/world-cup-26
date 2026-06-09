"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarClock,
  Gamepad2,
  GitBranch,
  Goal,
  LayoutGrid,
  TrendingUp,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Goal },
  { href: "/fixtures", label: "Fixtures", icon: CalendarClock },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/predictions", label: "Prediction", icon: GitBranch },
  { href: "/best-11", label: "Best XI", icon: LayoutGrid },
  { href: "/rankings", label: "Rank", icon: TrendingUp },
  
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div
        aria-hidden
        className="h-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden"
      />

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-6 px-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-14 touch-manipulation flex-col items-center justify-center gap-0.5 px-0.5 text-[9px] font-medium tracking-tight transition-colors focus-visible:outline-none",
                    active ? "text-emerald-300" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-2 top-0 h-[2px] rounded-full bg-emerald-400"
                    />
                  )}
                  <Icon className="relative h-[17px] w-[17px]" />
                  <span className="relative leading-none">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
