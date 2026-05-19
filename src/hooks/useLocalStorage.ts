"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * SSR-safe localStorage hook. Returns the persisted value (or initial),
 * a setter that writes through to storage, and a `ready` flag that flips
 * to true once the client has hydrated from storage (avoids hydration mismatches).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) setValue(JSON.parse(item) as T);
    } catch {
      // ignore
    } finally {
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore quota / privacy errors
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, ready];
}
