"use client";

import * as React from "react";
import Image from "next/image";
import { RotateCcw, Search, Sparkles, X } from "lucide-react";

import { PitchFormation } from "@/components/best-eleven/PitchFormation";
import {
  ALL_NATIONS_ID,
  SearchableTeamSelect,
} from "@/components/best-eleven/SearchableTeamSelect";
import type { BestElevenPlayer, CompactPlayer } from "@/components/best-eleven/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  DEFAULT_FORMATION_ID,
  FORMATIONS,
  autoFillLineup,
  filterPlayersByRole,
  getFormation,
  playersForSlot,
  slotToPositionFilter,
  type FormationSlot,
  type PositionFilter,
} from "@/lib/best-eleven";
import { cn } from "@/lib/utils";
import type { Team } from "@/types";

interface BestElevenBuilderProps {
  teams: Team[];
  squadsByTeamId: Record<string, CompactPlayer[]>;
  initialTeamId?: string;
}

const POSITION_FILTERS: { value: PositionFilter; label: string }[] = [
  { value: "ALL", label: "All positions" },
  { value: "GK", label: "Goalkeepers" },
  { value: "DEF", label: "Defenders" },
  { value: "MID", label: "Midfielders" },
  { value: "FWD", label: "Forwards" },
];

export function BestElevenBuilder({
  teams,
  squadsByTeamId,
  initialTeamId,
}: BestElevenBuilderProps) {
  const defaultTeamId =
    initialTeamId === ALL_NATIONS_ID
      ? ALL_NATIONS_ID
      : initialTeamId && squadsByTeamId[initialTeamId]?.length
        ? initialTeamId
        : ALL_NATIONS_ID;

  const [teamId, setTeamId] = React.useState(defaultTeamId);
  const [formationId, setFormationId] = React.useState(DEFAULT_FORMATION_ID);
  const [positionFilter, setPositionFilter] = React.useState<PositionFilter>("ALL");
  const [playerQuery, setPlayerQuery] = React.useState("");
  const [lineup, setLineup] = React.useState<Record<string, number>>({});
  const [activeSlotId, setActiveSlotId] = React.useState<string | null>(null);

  const formation = getFormation(formationId);
  const slots = formation.slots;

  const team = teamId === ALL_NATIONS_ID ? undefined : teams.find((t) => t.id === teamId);

  const allPlayersPool = React.useMemo<BestElevenPlayer[]>(
    () =>
      teams.flatMap((t) =>
        (squadsByTeamId[t.id] ?? []).map((p) => ({
          ...p,
          photo: null,
          number: null,
          age: null,
          nationality: t.name,
          height: null,
          weight: null,
          club: null,
          clubLogo: null,
          teamId: t.id,
          teamName: t.name,
          teamFlag: t.flag,
          teamFifaCode: t.fifaCode,
        })),
      ),
    [teams, squadsByTeamId],
  );

  const poolPlayers = React.useMemo(
    () =>
      teamId === ALL_NATIONS_ID
        ? allPlayersPool
        : allPlayersPool.filter((p) => p.teamId === teamId),
    [allPlayersPool, teamId],
  );

  const playersById = React.useMemo(
    () => new Map(allPlayersPool.map((p) => [p.id, p])),
    [allPlayersPool],
  );

  const activeSlot = slots.find((s) => s.id === activeSlotId) ?? null;

  const filteredPlayers = React.useMemo(() => {
    const q = playerQuery.trim().toLowerCase();
    const slot = activeSlotId ? slots.find((s) => s.id === activeSlotId) : null;

    let list = slot
      ? playersForSlot(poolPlayers, slot, lineup)
      : filterPlayersByRole(poolPlayers, positionFilter).filter(
          (p) => !Object.values(lineup).includes(p.id),
        );

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.teamName.toLowerCase().includes(q) ||
          p.teamFifaCode.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q),
      );
    }

    return list;
  }, [poolPlayers, positionFilter, activeSlotId, slots, lineup, playerQuery]);

  const filledCount = Object.keys(lineup).length;

  function handleTeamChange(nextTeamId: string) {
    setTeamId(nextTeamId);
    setActiveSlotId(null);
    setPlayerQuery("");
  }

  function selectSlot(slotId: string) {
    if (activeSlotId === slotId) {
      setActiveSlotId(null);
      setPositionFilter("ALL");
      return;
    }
    const slot = slots.find((s) => s.id === slotId);
    setActiveSlotId(slotId);
    if (slot) setPositionFilter(slotToPositionFilter(slot));
  }

  function assignPlayer(playerId: number) {
    if (!activeSlotId) return;
    setLineup((prev) => {
      const next = { ...prev };
      for (const [slotId, id] of Object.entries(next)) {
        if (id === playerId) delete next[slotId];
      }
      next[activeSlotId] = playerId;
      return next;
    });
  }

  function clearSlot(slotId: string) {
    setLineup((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
    if (activeSlotId === slotId) {
      setActiveSlotId(null);
      setPositionFilter("ALL");
    }
  }

  function handleFormationChange(nextId: string) {
    setFormationId(nextId);
    setLineup({});
    setActiveSlotId(null);
  }

  function handleAutoFill() {
    setLineup(autoFillLineup(allPlayersPool, slots));
    setActiveSlotId(null);
  }

  function handleReset() {
    setLineup({});
    setActiveSlotId(null);
  }

  function closeMobilePicker() {
    setActiveSlotId(null);
    setPositionFilter("ALL");
    setPlayerQuery("");
  }

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-8">
      {/* Pitch — first on mobile, sticky so it stays visible while picking */}
      <div className="order-1 lg:col-start-1 lg:row-span-2 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:self-start">
        <div className="sticky top-14 z-20 -mx-1 rounded-2xl bg-background/95 px-1 pb-3 backdrop-blur-md lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <PitchFormation
            key={formationId}
            slots={slots}
            formationName={formation.name}
            lineup={lineup}
            playersById={playersById}
            activeSlotId={activeSlotId}
            onSlotClick={selectSlot}
            className="w-full max-w-sm mx-auto sm:max-w-md lg:max-w-full"
          />

          <MobileSlotPicker
            slots={slots}
            lineup={lineup}
            activeSlotId={activeSlotId}
            onSelect={selectSlot}
          />
        </div>
      </div>

      {/* Team + formation */}
      <div className="order-2 lg:col-start-2 lg:row-start-1">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 sm:p-5">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Select team
          </label>
          <div className="mt-2 flex items-center gap-3">
            {team ? (
              <span className="relative h-8 w-11 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15">
                <Image src={team.flag} alt="" fill sizes="44px" className="object-cover" />
              </span>
            ) : (
              <span className="grid h-8 w-11 shrink-0 place-items-center rounded-md bg-emerald-400/15 text-xs font-bold text-emerald-300 ring-1 ring-white/15">
                48
              </span>
            )}
            <SearchableTeamSelect teams={teams} value={teamId} onChange={handleTeamChange} />
          </div>

          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
            Formation
          </label>
          <Select
            value={formationId}
            onChange={(e) => handleFormationChange(e.target.value)}
            className="mt-2"
            aria-label="Select formation"
          >
            {FORMATIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="cursor-pointer"
              onClick={handleAutoFill}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Auto XI
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <span className="ml-auto self-center text-xs text-muted-foreground">
              {filledCount}/11 selected
            </span>
          </div>
        </div>

        <p className="mt-4 rounded-xl border border-dashed border-white/15 py-5 text-center text-sm text-muted-foreground lg:hidden">
          Tap a slot on the pitch to open the player list
        </p>
      </div>

      {/* Desktop squad panel */}
      <div className="order-3 hidden space-y-4 lg:col-start-2 lg:row-start-2 lg:block">
        {activeSlot && (
          <div className="flex items-center justify-between rounded-xl border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-sm">
            <p>
              Pick a player for{" "}
              <span className="font-semibold text-amber-200">{activeSlot.label}</span>
            </p>
            {lineup[activeSlot.id] != null && (
              <button
                type="button"
                onClick={() => clearSlot(activeSlot.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        )}

        <SquadPoolPanel
          teamId={teamId}
          team={team}
          activeSlot={activeSlot}
          positionFilter={positionFilter}
          onPositionFilterChange={setPositionFilter}
          playerQuery={playerQuery}
          onPlayerQueryChange={setPlayerQuery}
          filteredPlayers={filteredPlayers}
          activeSlotId={activeSlotId}
          onAssignPlayer={assignPlayer}
          poolSize={poolPlayers.length}
          listClassName="lg:max-h-[calc(100vh-22rem)]"
        />
      </div>

      {/* Mobile bottom sheet — pitch stays visible above */}
      {activeSlot && (
        <MobilePlayerSheet
          activeSlot={activeSlot}
          lineup={lineup}
          onClose={closeMobilePicker}
          onClear={() => clearSlot(activeSlot.id)}
          teamId={teamId}
          team={team}
          playerQuery={playerQuery}
          onPlayerQueryChange={setPlayerQuery}
          filteredPlayers={filteredPlayers}
          onAssignPlayer={assignPlayer}
        />
      )}
    </div>
  );
}

function MobileSlotPicker({
  slots,
  lineup,
  activeSlotId,
  onSelect,
}: {
  slots: FormationSlot[];
  lineup: Record<string, number>;
  activeSlotId: string | null;
  onSelect: (slotId: string) => void;
}) {
  return (
    <div className="mt-3 lg:hidden">
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Or pick position
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {slots.map((slot) => {
          const filled = lineup[slot.id] != null;
          const isActive = activeSlotId === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelect(slot.id)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors",
                isActive
                  ? "bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/40"
                  : filled
                    ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/25"
                    : "bg-white/5 text-muted-foreground ring-1 ring-white/10",
              )}
            >
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SquadPlayerList({
  players,
  activeSlotId,
  onAssignPlayer,
  teamId,
  listClassName,
}: {
  players: BestElevenPlayer[];
  activeSlotId: string | null;
  onAssignPlayer: (playerId: number) => void;
  teamId: string;
  listClassName?: string;
}) {
  return (
    <ul
      className={cn(
        "mt-3 max-h-[min(32rem,60vh)] space-y-1.5 overflow-y-auto pr-1",
        listClassName,
      )}
    >
      {players.length === 0 ? (
        <li className="rounded-xl border border-dashed border-white/15 py-10 text-center text-sm text-muted-foreground">
          No players match this filter.
        </li>
      ) : (
        players.map((player) => {
          const disabled = !activeSlotId;
          return (
            <li key={player.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onAssignPlayer(player.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/2 p-3 text-left transition-colors",
                  disabled
                    ? "cursor-default opacity-70"
                    : "cursor-pointer hover:border-emerald-400/40 hover:bg-white/5",
                )}
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15">
                  <Image
                    src={player.teamFlag}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{player.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {player.position} · {player.teamFifaCode}
                    {teamId === ALL_NATIONS_ID ? ` · ${player.teamName}` : ""}
                  </p>
                </div>
              </button>
            </li>
          );
        })
      )}
    </ul>
  );
}

function SquadPoolPanel({
  teamId,
  team,
  activeSlot,
  positionFilter,
  onPositionFilterChange,
  playerQuery,
  onPlayerQueryChange,
  filteredPlayers,
  activeSlotId,
  onAssignPlayer,
  poolSize,
  listClassName,
}: {
  teamId: string;
  team: Team | undefined;
  activeSlot: FormationSlot | null;
  positionFilter: PositionFilter;
  onPositionFilterChange: (v: PositionFilter) => void;
  playerQuery: string;
  onPlayerQueryChange: (v: string) => void;
  filteredPlayers: BestElevenPlayer[];
  activeSlotId: string | null;
  onAssignPlayer: (playerId: number) => void;
  poolSize: number;
  listClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
            Squad pool
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">
            {teamId === ALL_NATIONS_ID ? "All nations" : (team?.name ?? "Players")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeSlot
              ? `Showing ${POSITION_FILTERS.find((f) => f.value === slotToPositionFilter(activeSlot))?.label?.toLowerCase() ?? "players"} for ${activeSlot.label}`
              : teamId === ALL_NATIONS_ID
                ? `${poolSize} players from 48 teams`
                : "Pick a position on the pitch, then select a player"}
          </p>
        </div>

        <Select
          value={activeSlot ? slotToPositionFilter(activeSlot) : positionFilter}
          onChange={(e) => onPositionFilterChange(e.target.value as PositionFilter)}
          disabled={activeSlot != null}
          className="sm:max-w-44"
          aria-label="Filter by position"
        >
          {POSITION_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={playerQuery}
          onChange={(e) => onPlayerQueryChange(e.target.value)}
          placeholder="Search player, nation, or position…"
          className="h-10 pl-9"
          aria-label="Search players"
        />
      </div>

      <SquadPlayerList
        players={filteredPlayers}
        activeSlotId={activeSlotId}
        onAssignPlayer={onAssignPlayer}
        teamId={teamId}
        listClassName={listClassName}
      />
    </div>
  );
}

function MobilePlayerSheet({
  activeSlot,
  lineup,
  onClose,
  onClear,
  teamId,
  team,
  playerQuery,
  onPlayerQueryChange,
  filteredPlayers,
  onAssignPlayer,
}: {
  activeSlot: FormationSlot;
  lineup: Record<string, number>;
  onClose: () => void;
  onClear: () => void;
  teamId: string;
  team: Team | undefined;
  playerQuery: string;
  onPlayerQueryChange: (v: string) => void;
  filteredPlayers: BestElevenPlayer[];
  onAssignPlayer: (playerId: number) => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Close player list"
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 z-50 flex max-h-[min(58vh,32rem)] flex-col rounded-t-2xl border border-white/10 bg-background shadow-2xl lg:hidden"
        style={{ bottom: "calc(3.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
              Pick player
            </p>
            <p className="text-sm font-bold">{activeSlot.label}</p>
          </div>
          <div className="flex items-center gap-2">
            {lineup[activeSlot.id] != null && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="sticky top-0 z-10 space-y-3 bg-background pb-3 pt-3">
            <p className="text-xs text-muted-foreground">
              {teamId === ALL_NATIONS_ID ? "All nations" : team?.name} ·{" "}
              {POSITION_FILTERS.find((f) => f.value === slotToPositionFilter(activeSlot))?.label}
            </p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={playerQuery}
                onChange={(e) => onPlayerQueryChange(e.target.value)}
                placeholder="Search player…"
                className="h-10 pl-9"
                aria-label="Search players"
              />
            </div>
          </div>

          <SquadPlayerList
            players={filteredPlayers}
            activeSlotId={activeSlot.id}
            onAssignPlayer={onAssignPlayer}
            teamId={teamId}
            listClassName="max-h-none"
          />
        </div>
      </div>
    </>
  );
}
