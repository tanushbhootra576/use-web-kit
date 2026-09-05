import { useCallback, useSyncExternalStore } from "react";
import type { WindowSize } from "../core/types";

// Shared snapshot — updated by event listeners, read by all subscribers.
let currentSnapshot: WindowSize = {
  width: typeof window !== "undefined" ? window.innerWidth : 0,
  height: typeof window !== "undefined" ? window.innerHeight : 0,
};

const SERVER_SNAPSHOT: WindowSize = {
  width: 0,
  height: 0,
};

const listeners = new Set<() => void>();

let rafId: number | null = null;
let subscriberCount = 0;

function notify(): void {
  currentSnapshot = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  listeners.forEach((fn) => fn());
}

function handleResize(): void {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    notify();
  });
}

/**
 * Tracks window dimensions safely (SSR compatible).
 * Uses a module-level singleton and requestAnimationFrame for performance.
 */
export function useWindowSize(): WindowSize {
  const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
    if (subscriberCount === 0 && typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }
    subscriberCount++;
    listeners.add(onStoreChange);

    return () => {
      listeners.delete(onStoreChange);
      subscriberCount--;
      if (subscriberCount === 0 && typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, []);

  const getSnapshot = useCallback((): WindowSize => currentSnapshot, []);
  const getServerSnapshot = useCallback((): WindowSize => SERVER_SNAPSHOT, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
