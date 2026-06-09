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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  BEST_ELEVEN_STORAGE_KEY,
  DEFAULT_FORMATION_ID,
  FORMATIONS,
  autoFillLineup,
  getFormation,
  playersForSlot,
  sanitizeBestElevenState,
  slotToPositionFilter,
  type FormationSlot,
  type SavedBestElevenState,
} from "@/lib/best-eleven";
import { cn } from "@/lib/utils";
import type { Team } from "@/types";

const INITIAL_SAVED_STATE: SavedBestElevenState = {
  formationId: DEFAULT_FORMATION_ID,
  lineup: {},
};

interface BestElevenBuilderProps {
  teams: Team[];
  squadsByTeamId: Record<string, CompactPlayer[]>;
  initialTeamId?: string;
}

const POSITION_LABELS: Record<string, string> = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
};

export function BestElevenBuilder({
  teams,
  squadsByTeamId,
}: BestElevenBuilderProps) {
  const [saved, setSaved, storageReady] = useLocalStorage<SavedBestElevenState>(
    BEST_ELEVEN_STORAGE_KEY,
    INITIAL_SAVED_STATE,
  );
  const { formationId, lineup } = saved;
  const [activeSlotId, setActiveSlotId] = React.useState<string | null>(null);
  const [popupTeamId, setPopupTeamId] = React.useState(ALL_NATIONS_ID);
  const [playerQuery, setPlayerQuery] = React.useState("");

  const formation = getFormation(formationId);
  const slots = formation.slots;
  const activeSlot = slots.find((s) => s.id === activeSlotId) ?? null;

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

  const playersById = React.useMemo(
    () => new Map(allPlayersPool.map((p) => [p.id, p])),
    [allPlayersPool],
  );

  const validPlayerIds = React.useMemo(
    () => new Set(allPlayersPool.map((p) => p.id)),
    [allPlayersPool],
  );

  const sanitizedRef = React.useRef(false);
  React.useEffect(() => {
    if (!storageReady || sanitizedRef.current) return;
    sanitizedRef.current = true;
    setSaved((prev) => sanitizeBestElevenState(prev, validPlayerIds));
  }, [storageReady, validPlayerIds, setSaved]);

  const setLineup = React.useCallback(
    (updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => {
      setSaved((prev) => ({
        ...prev,
        lineup: typeof updater === "function" ? updater(prev.lineup) : updater,
      }));
    },
    [setSaved],
  );

  const popupPlayers = React.useMemo(() => {
    if (!activeSlot) return [];

    const pool =
      popupTeamId === ALL_NATIONS_ID
        ? allPlayersPool
        : allPlayersPool.filter((p) => p.teamId === popupTeamId);

    let list = playersForSlot(pool, activeSlot, lineup);
    const q = playerQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.teamName.toLowerCase().includes(q) ||
          p.teamFifaCode.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeSlot, allPlayersPool, popupTeamId, lineup, playerQuery]);

  const filledCount = Object.keys(lineup).length;
  const popupTeam = popupTeamId === ALL_NATIONS_ID ? undefined : teams.find((t) => t.id === popupTeamId);

  function openSlot(slotId: string) {
    setActiveSlotId(slotId);
    setPopupTeamId(ALL_NATIONS_ID);
    setPlayerQuery("");
  }

  function closePopup() {
    setActiveSlotId(null);
    setPlayerQuery("");
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
    closePopup();
  }

  function clearSlot() {
    if (!activeSlotId) return;
    setLineup((prev) => {
      const next = { ...prev };
      delete next[activeSlotId];
      return next;
    });
  }

  function handleFormationChange(nextId: string) {
    setSaved({ formationId: nextId, lineup: {} });
    closePopup();
  }

  function handleAutoFill() {
    setSaved((prev) => ({
      ...prev,
      lineup: autoFillLineup(allPlayersPool, getFormation(prev.formationId).slots),
    }));
    closePopup();
  }

  function handleReset() {
    setSaved((prev) => ({ ...prev, lineup: {} }));
    closePopup();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:items-start lg:gap-8">
        <div className="order-1 rounded-2xl border border-white/10 bg-white/3 p-3 sm:p-5 lg:order-2 lg:sticky lg:top-24">
          <label className="mb-2 hidden text-xs font-bold uppercase tracking-[0.18em] text-sky-300 lg:block">
            Formation
          </label>

          <div className="flex items-center gap-2 lg:flex-col lg:items-stretch lg:gap-2">
            <Select
              value={formationId}
              onChange={(e) => handleFormationChange(e.target.value)}
              className="h-9 min-w-0 flex-1 text-xs sm:h-10 sm:text-sm lg:h-11 lg:w-full"
              aria-label="Select formation"
            >
              {FORMATIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Select>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-9 shrink-0 cursor-pointer px-2.5 text-xs sm:px-3 lg:w-full"
              onClick={handleAutoFill}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Auto XI
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-9 shrink-0 cursor-pointer px-2.5 text-xs sm:px-3 lg:w-full"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>

          <p className="mt-2 text-center text-[11px] text-muted-foreground lg:mt-4 lg:text-xs">
            {filledCount}/11 selected
          </p>
        </div>

        <div className="order-2 min-w-0 lg:order-1">
          <PitchFormation
            key={formationId}
            slots={slots}
            formationName={formation.name}
            lineup={lineup}
            playersById={playersById}
            activeSlotId={activeSlotId}
            onSlotClick={openSlot}
            className="w-full"
          />
          <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm lg:mt-4">
            <span className="lg:hidden">Tap a position on the pitch to pick a player</span>
            <span className="hidden lg:inline">Click a position on the pitch to pick a player</span>
          </p>
        </div>
      </div>

      {activeSlot && (
        <PlayerPickerPopup
          activeSlot={activeSlot}
          lineup={lineup}
          teams={teams}
          popupTeamId={popupTeamId}
          popupTeam={popupTeam}
          onTeamChange={setPopupTeamId}
          playerQuery={playerQuery}
          onPlayerQueryChange={setPlayerQuery}
          players={popupPlayers}
          onAssignPlayer={assignPlayer}
          onClear={clearSlot}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

function PlayerPickerPopup({
  activeSlot,
  lineup,
  teams,
  popupTeamId,
  popupTeam,
  onTeamChange,
  playerQuery,
  onPlayerQueryChange,
  players,
  onAssignPlayer,
  onClear,
  onClose,
}: {
  activeSlot: FormationSlot;
  lineup: Record<string, number>;
  teams: Team[];
  popupTeamId: string;
  popupTeam: Team | undefined;
  onTeamChange: (teamId: string) => void;
  playerQuery: string;
  onPlayerQueryChange: (v: string) => void;
  players: BestElevenPlayer[];
  onAssignPlayer: (playerId: number) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const roleFilter = slotToPositionFilter(activeSlot);
  const roleLabel = POSITION_LABELS[roleFilter] ?? "Players";

  return (
    <>
      <button
        type="button"
        aria-label="Close player picker"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-picker-title"
        className={cn(
          "fixed z-50 flex flex-col border border-white/10 bg-background shadow-2xl",
          "inset-x-4 top-[50%] max-h-[min(85vh,36rem)] -translate-y-1/2 rounded-2xl",
          "sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
              {roleLabel}
            </p>
            <h2 id="player-picker-title" className="text-lg font-bold">
              Pick {activeSlot.label}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {lineup[activeSlot.id] != null && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-white/10 hover:bg-white/5 hover:text-foreground cursor-pointer" 
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-muted-foreground hover:text-foreground cursor-pointer" 
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 border-b border-white/10 px-4 py-3 sm:px-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
              Country
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              {popupTeam ? (
                <span className="relative h-7 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-white/15">
                  <Image src={popupTeam.flag} alt="" fill sizes="40px" className="object-cover" />
                </span>
              ) : (
                <span className="grid h-7 w-10 shrink-0 place-items-center rounded-md bg-emerald-400/15 text-[10px] font-bold text-emerald-300 ring-1 ring-white/15">
                  48
                </span>
              )}
              <SearchableTeamSelect teams={teams} value={popupTeamId} onChange={onTeamChange} />
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={playerQuery}
              onChange={(e) => onPlayerQueryChange(e.target.value)}
              placeholder="Search player or nation…"
              className="h-10 pl-9"
              aria-label="Search players"
            />
          </div>
        </div>

        <ul className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3 sm:px-5">
          {players.length === 0 ? (
            <li className="rounded-xl border border-dashed border-white/15 py-10 text-center text-sm text-muted-foreground">
              No players found for this position.
            </li>
          ) : (
            players.map((player) => (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => onAssignPlayer(player.id)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/2 p-3 text-left transition-colors hover:border-emerald-400/40 hover:bg-white/5"
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
                      {player.position} · {player.teamFifaCode} · {player.teamName}
                    </p>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
