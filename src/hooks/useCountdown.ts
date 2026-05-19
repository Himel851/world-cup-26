"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A self-running countdown timer in seconds. Pauses when `running` is false.
 * Resets when `resetKey` changes.
 */
export function useCountdown(
  initialSeconds: number,
  resetKey: unknown,
  running: boolean,
  onExpire?: () => void,
) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSeconds(initialSeconds);
    expiredRef.current = false;
  }, [initialSeconds, resetKey]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            queueMicrotask(() => onExpireRef.current?.());
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, resetKey]);

  return seconds;
}
