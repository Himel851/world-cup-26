"use client";

import Image from "next/image";
import { Shirt } from "lucide-react";

import type { BestElevenPlayer } from "@/components/best-eleven/types";
import { shortPlayerName, type FormationSlot } from "@/lib/best-eleven";
import { cn } from "@/lib/utils";

interface PitchFormationProps {
  slots: FormationSlot[];
  formationName: string;
  lineup: Record<string, number>;
  playersById: Map<number, BestElevenPlayer>;
  activeSlotId: string | null;
  onSlotClick: (slotId: string) => void;
  className?: string;
}

export function PitchFormation({
  slots,
  formationName,
  lineup,
  playersById,
  activeSlotId,
  onSlotClick,
  className,
}: PitchFormationProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a1a12] shadow-2xl shadow-black/50 ring-1 ring-white/10",
        className,
      )}
    >
      {/* Stadium surround — capped height so full XI including GK fits in viewport */}
      <div className="relative p-1 sm:p-1.5">
        <div
          className="relative mx-auto aspect-[68/88] w-full max-h-[min(calc(100vh-8rem),520px)] overflow-hidden rounded-xl ring-1 ring-black/40"
          style={{
            backgroundColor: "#1e6b3e",
            backgroundImage: [
              "repeating-linear-gradient(180deg, #1f6d40 0px, #1f6d40 14px, #2a8f52 14px, #2a8f52 28px)",
              "repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)",
              "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,255,255,0.14), transparent 50%)",
              "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(0,0,0,0.22), transparent 55%)",
            ].join(", "),
          }}
        >
          {/* Grass sheen / mow reflection */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              background:
                "repeating-linear-gradient(180deg, transparent 0px, transparent 28px, rgba(255,255,255,0.06) 28px, rgba(255,255,255,0.06) 56px)",
            }}
            aria-hidden
          />

          <PitchMarkings />

          {/* Floodlight vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 40%, rgba(0,20,10,0.35) 100%)",
            }}
            aria-hidden
          />

          {slots.map((slot) => {
            const playerId = lineup[slot.id];
            const player = playerId != null ? playersById.get(playerId) : undefined;
            const isActive = activeSlotId === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSlotClick(slot.id)}
                className={cn(
                  "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80",
                  isActive && "scale-110",
                )}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                aria-label={
                  player
                    ? `${player.name}, ${slot.label}`
                    : `Select player for ${slot.label}`
                }
                aria-pressed={isActive}
              >
                <span className="relative">
                  <span
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-md bg-white shadow-lg shadow-black/30 ring-2 sm:h-10 sm:w-10",
                      isActive ? "ring-amber-300" : "ring-white/95",
                      player ? "text-emerald-800" : "text-emerald-700/60",
                    )}
                  >
                    <Shirt className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
                  </span>
                  {player?.teamFlag && (
                    <span className="absolute -right-1.5 -top-1.5 overflow-hidden rounded-sm ring-1 ring-white shadow-sm">
                      <Image
                        src={player.teamFlag}
                        alt=""
                        width={18}
                        height={13}
                        className="h-3.5 w-5 object-cover"
                      />
                    </span>
                  )}
                </span>
                <span
                  className="max-w-22 text-center sm:max-w-26"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)" }}
                >
                  <span className="block truncate text-[10px] font-bold uppercase tracking-tight text-white sm:text-xs">
                    {player ? shortPlayerName(player.name) : slot.label}
                  </span>
                  {player?.teamFifaCode && (
                    <span className="mt-0.5 block text-[8px] font-bold uppercase tracking-widest text-white/90 sm:text-[9px]">
                      {player.teamFifaCode}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-linear-to-r from-[#0c1f14] via-[#0f2819] to-[#0c1f14] px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/90">
          {formationName}
        </p>
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
          FIFA WC 2026
        </p>
      </div>
    </div>
  );
}

/** FIFA pitch proportions: 68m × 105m */
function PitchMarkings() {
  const w = 68;
  const h = 105;
  const pad = 1.2;
  const line = "rgba(255,255,255,0.92)";
  const lineSoft = "rgba(255,255,255,0.75)";
  const sw = 0.28;

  const pw = w - pad * 2;
  const ph = h - pad * 2;
  const cx = w / 2;
  const cy = h / 2;

  const penDepth = (16.5 / 105) * ph;
  const goalDepth = (5.5 / 105) * ph;
  const penWidth = (40.32 / 68) * pw;
  const goalWidth = (18.32 / 68) * pw;
  const circleR = (9.15 / 68) * pw;
  const penSpotOffset = (11 / 105) * ph;
  const topPenSpotY = pad + penSpotOffset;
  const bottomPenSpotY = h - pad - penSpotOffset;
  const cornerR = (1 / 68) * pw;

  const penX = cx - penWidth / 2;
  const goalX = cx - goalWidth / 2;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id="pitch-line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="0.15" floodColor="rgba(255,255,255,0.35)" />
        </filter>
      </defs>

      {/* Touchlines */}
      <rect
        x={pad}
        y={pad}
        width={pw}
        height={ph}
        fill="none"
        stroke={line}
        strokeWidth={sw}
        filter="url(#pitch-line-glow)"
      />

      {/* Halfway line */}
      <line
        x1={pad}
        y1={cy}
        x2={w - pad}
        y2={cy}
        stroke={line}
        strokeWidth={sw}
        filter="url(#pitch-line-glow)"
      />

      {/* Center circle + spot */}
      <circle
        cx={cx}
        cy={cy}
        r={circleR}
        fill="none"
        stroke={line}
        strokeWidth={sw}
        filter="url(#pitch-line-glow)"
      />
      <circle cx={cx} cy={cy} r={0.45} fill={line} />

      {/* Top penalty area */}
      <rect
        x={penX}
        y={pad}
        width={penWidth}
        height={penDepth}
        fill="none"
        stroke={lineSoft}
        strokeWidth={sw * 0.95}
      />
      <rect
        x={goalX}
        y={pad}
        width={goalWidth}
        height={goalDepth}
        fill="none"
        stroke={lineSoft}
        strokeWidth={sw * 0.95}
      />
      <circle cx={cx} cy={topPenSpotY} r={0.4} fill={line} />

      {/* Top penalty arc */}
      <path
        d={penaltyArcPath(cx, topPenSpotY, circleR, pad + penDepth, true)}
        fill="none"
        stroke={lineSoft}
        strokeWidth={sw * 0.95}
      />

      {/* Bottom penalty area */}
      <rect
        x={penX}
        y={h - pad - penDepth}
        width={penWidth}
        height={penDepth}
        fill="none"
        stroke={lineSoft}
        strokeWidth={sw * 0.95}
      />
      <rect
        x={goalX}
        y={h - pad - goalDepth}
        width={goalWidth}
        height={goalDepth}
        fill="none"
        stroke={lineSoft}
        strokeWidth={sw * 0.95}
      />
      <circle cx={cx} cy={bottomPenSpotY} r={0.4} fill={line} />

      {/* Bottom penalty arc */}
      <path
        d={penaltyArcPath(cx, bottomPenSpotY, circleR, h - pad - penDepth, false)}
        fill="none"
        stroke={lineSoft}
        strokeWidth={sw * 0.95}
      />

      {/* Corner arcs */}
      <path d={cornerArc(pad, pad, cornerR, "tl")} fill="none" stroke={lineSoft} strokeWidth={sw * 0.9} />
      <path d={cornerArc(w - pad, pad, cornerR, "tr")} fill="none" stroke={lineSoft} strokeWidth={sw * 0.9} />
      <path d={cornerArc(pad, h - pad, cornerR, "bl")} fill="none" stroke={lineSoft} strokeWidth={sw * 0.9} />
      <path d={cornerArc(w - pad, h - pad, cornerR, "br")} fill="none" stroke={lineSoft} strokeWidth={sw * 0.9} />

      {/* Goal frames (decorative) */}
      <rect x={cx - goalWidth * 0.22} y={pad - 0.15} width={goalWidth * 0.44} height={0.5} fill="rgba(255,255,255,0.5)" rx={0.1} />
      <rect
        x={cx - goalWidth * 0.22}
        y={h - pad - 0.35}
        width={goalWidth * 0.44}
        height={0.5}
        fill="rgba(255,255,255,0.5)"
        rx={0.1}
      />
    </svg>
  );
}

function penaltyArcPath(
  cx: number,
  spotY: number,
  radius: number,
  boxEdge: number,
  top: boolean,
): string {
  const dy = boxEdge - spotY;
  const dx = Math.sqrt(Math.max(0, radius * radius - dy * dy));
  const x1 = cx - dx;
  const x2 = cx + dx;
  const sweep = top ? 0 : 1;
  return `M ${x1} ${boxEdge} A ${radius} ${radius} 0 0 ${sweep} ${x2} ${boxEdge}`;
}

function cornerArc(x: number, y: number, r: number, corner: "tl" | "tr" | "bl" | "br"): string {
  switch (corner) {
    case "tl":
      return `M ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y}`;
    case "tr":
      return `M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x} ${y + r}`;
    case "bl":
      return `M ${x + r} ${y} A ${r} ${r} 0 0 1 ${x} ${y - r}`;
    case "br":
      return `M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x - r} ${y}`;
  }
}
