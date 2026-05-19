"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfettiProps {
  active: boolean;
  count?: number;
}

const COLORS = ["#22d3a4", "#38bdf8", "#a78bfa", "#fbbf24", "#f472b6", "#f87171"];

/**
 * Lightweight confetti burst. Renders only while `active` is true.
 */
export function Confetti({ active, count = 60 }: ConfettiProps) {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() * 60 - 30),
        delay: Math.random() * 0.15,
        rotate: Math.random() * 360,
        rotateEnd: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
        duration: 1.2 + Math.random() * 0.8,
        sway: (Math.random() - 0.5) * 200,
      })),
    [count],
  );

  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              initial={{
                top: "30%",
                left: `${p.x}%`,
                opacity: 1,
                rotate: p.rotate,
                scale: 0.6,
              }}
              animate={{
                top: "110%",
                left: `calc(${p.x}% + ${p.sway}px)`,
                rotate: p.rotate + p.rotateEnd,
                scale: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size * 0.45,
                background: p.color,
                borderRadius: 2,
                boxShadow: `0 0 8px ${p.color}55`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
