"use client";

import { useEffect } from "react";

/**
 * Register a list of keyboard handlers. Each key entry can be a single key
 * (e.g. "1") or a combo with modifiers (e.g. "ctrl+k").
 */
export function useKeyboardShortcut(
  bindings: Record<string, (e: KeyboardEvent) => void>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (target?.isContentEditable) return;

      const key = e.key.toLowerCase();
      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push("ctrl");
      if (e.shiftKey) parts.push("shift");
      if (e.altKey) parts.push("alt");
      parts.push(key);
      const combo = parts.join("+");

      const cb = bindings[combo] ?? bindings[key];
      if (cb) {
        e.preventDefault();
        cb(e);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [bindings, enabled]);
}
