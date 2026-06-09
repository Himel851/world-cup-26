"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";

import { FixtureDaySection } from "@/components/fixtures/FixtureDaySection";
import { formatKickoffDate } from "@/lib/utils";
import {
  SquadUnavailable,
  TeamSquadSection,
} from "@/components/teams/TeamSquadSection";
import { cn } from "@/lib/utils";
import type { TeamSquadData } from "@/types/api-football";
import type { Fixture } from "@/types";

type TabKey = "squad" | "fixtures";

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] =
  [
    { key: "squad", label: "Squad list", icon: Users },
    { key: "fixtures", label: "Fixtures", icon: Calendar },
  ];

interface TeamDetailsTabsProps {
  teamId: string;
  squad: TeamSquadData | null;
  fixtures: Fixture[];
}

export function TeamDetailsTabs({ teamId, squad, fixtures }: TeamDetailsTabsProps) {
  const [activeTab, setActiveTab] = React.useState<TabKey>("squad");

  return (
    <section className="mx-auto max-w-7xl px-4 mt-4 pb-12 sm:px-6 lg:px-8">
      <nav
        aria-label="Team details"
        className="flex gap-1  p-1"
      >
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            aria-selected={activeTab === key}
            role="tab"
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5 cursor-pointer",
              activeTab === key
                ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/30"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6" role="tabpanel">
        {activeTab === "squad" &&
          (squad ? (
            <TeamSquadSection squad={squad} localTeamId={teamId} embedded />
          ) : (
            <SquadUnavailable reason="No squad data is available for this team yet." embedded />
          ))}

        {activeTab === "fixtures" && (
          <div>
            <div className="mb-6 flex items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  Official schedule
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Group stage fixtures
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {fixtures.length} matches
                </p>
              </div>
              <Link
                href={`/fixtures?team=${teamId}`}
                className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                All fixtures
              </Link>
            </div>

            {fixtures.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-muted-foreground">
                <Calendar className="mx-auto h-8 w-8 opacity-50" />
                <p className="mt-3 font-medium">No fixtures scheduled for this team yet.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {[
                  ...[...fixtures]
                    .sort(
                      (a, b) =>
                        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
                    )
                    .reduce<Map<string, Fixture[]>>((map, fixture) => {
                      const key = formatKickoffDate(fixture.kickoffUtc);
                      const list = map.get(key) ?? [];
                      list.push(fixture);
                      map.set(key, list);
                      return map;
                    }, new Map()),
                ].map(([dateKey, dayFixtures]) => (
                  <FixtureDaySection
                    key={dateKey}
                    dateKey={dateKey}
                    fixtures={dayFixtures}
                    highlightTeamId={teamId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
