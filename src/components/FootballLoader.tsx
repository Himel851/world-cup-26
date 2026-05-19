"use client";

import { motion } from "framer-motion";

interface FootballLoaderProps {
  size?: number;
  label?: string;
}

/**
 * A small football icon bouncing on a shadow — used for loading states.
 */
export function FootballLoader({ size = 56, label = "Loading" }: FootballLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className="relative" style={{ width: size, height: size * 1.4 }}>
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ width: size, height: size }}
          animate={{ y: [0, -size * 0.6, 0], rotate: [0, 360] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
            <defs>
              <radialGradient id="ballGrad" cx="35%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="80%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#ballGrad)" stroke="#0f172a" strokeWidth="2" />
            <polygon
              points="32,18 42,25 38,37 26,37 22,25"
              fill="#0f172a"
            />
            <line x1="32" y1="6" x2="32" y2="18" stroke="#0f172a" strokeWidth="2" />
            <line x1="50" y1="20" x2="42" y2="25" stroke="#0f172a" strokeWidth="2" />
            <line x1="58" y1="40" x2="46" y2="40" stroke="#0f172a" strokeWidth="2" />
            <line x1="42" y1="55" x2="38" y2="44" stroke="#0f172a" strokeWidth="2" />
            <line x1="22" y1="55" x2="26" y2="44" stroke="#0f172a" strokeWidth="2" />
            <line x1="6" y1="40" x2="18" y2="40" stroke="#0f172a" strokeWidth="2" />
            <line x1="14" y1="20" x2="22" y2="25" stroke="#0f172a" strokeWidth="2" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%] bg-black/40 blur-md"
          style={{ width: size * 0.7, height: size * 0.14 }}
          animate={{ scaleX: [1, 0.55, 1], opacity: [0.5, 0.25, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-sm text-[var(--muted-foreground)]">{label}…</span>
    </div>
  );
}
