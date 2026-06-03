import { useCallback, useSyncExternalStore } from "react";
import type { PageLifecycle } from "../core/types";

// ── Module-level singleton ──────────────────────────────────────────────────

function readState(): PageLifecycle {
  if (typeof document === "undefined") {
    return { visible: true, focused: true, frozen: false };
  }
  return {
    visible: document.visibilityState === "visible",
    focused: document.hasFocus(),
    frozen: false,
  };
}

let currentSnapshot: PageLifecycle = readState();

const SERVER_SNAPSHOT: PageLifecycle = {
  visible: true,
  focused: true,
  frozen: false,
};

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((fn) => fn());
}

function update(): void {
  currentSnapshot = readState();
  notify();
}

function onFreeze(): void {
  currentSnapshot = { ...currentSnapshot, frozen: true };
  notify();
}

function onPageHide(): void {
  currentSnapshot = { visible: false, focused: currentSnapshot.focused, frozen: true };
  notify();
}

let initialized = false;

function ensureListeners(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  document.addEventListener("visibilitychange", update);
  window.addEventListener("focus", update);
  window.addEventListener("blur", update);
  window.addEventListener("pagehide", onPageHide);

  try {
    document.addEventListener("freeze", onFreeze);
  } catch {
    // freeze event not supported in all browsers
  }
}

// ── The Hook ────────────────────────────────────────────────────────────────

/**
 * Tracks page visibility, focus, and frozen states.
 *
 * Uses `useSyncExternalStore` with a module-level singleton to guarantee
 * hydration safety and eliminate per-component listener overhead. One set of
 * listeners serves all subscribers.
 */
export function usePageLifecycle(): PageLifecycle {
  const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
    ensureListeners();
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback((): PageLifecycle => currentSnapshot, []);
  const getServerSnapshot = useCallback((): PageLifecycle => SERVER_SNAPSHOT, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default usePageLifecycle;
