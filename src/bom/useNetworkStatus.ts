import { useCallback, useSyncExternalStore } from "react";
import type { NetworkStatus } from "../core/types";

// ── Module-level singleton for Network Information API ──────────────────────

interface NetworkConnection extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

function getConnection(): NetworkConnection | null {
  if (typeof navigator === "undefined") return null;
  return (navigator as unknown as { connection?: NetworkConnection }).connection ?? null;
}

// Shared snapshot — updated by event listeners, read by all subscribers.
let currentSnapshot: NetworkStatus = {
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
  effectiveType: getConnection()?.effectiveType,
  downlink: getConnection()?.downlink,
  rtt: getConnection()?.rtt,
};

const SERVER_SNAPSHOT: NetworkStatus = {
  online: true,
  effectiveType: undefined,
  downlink: undefined,
  rtt: undefined,
};

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((fn) => fn());
}

function updateSnapshot(): void {
  const conn = getConnection();
  currentSnapshot = {
    online: navigator.onLine,
    effectiveType: conn?.effectiveType,
    downlink: conn?.downlink,
    rtt: conn?.rtt,
  };
  notify();
}

// Wire up global listeners once (module-level, not per-component).
let initialized = false;

function ensureListeners(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener("online", updateSnapshot);
  window.addEventListener("offline", updateSnapshot);

  const conn = getConnection();
  if (conn && typeof conn.addEventListener === "function") {
    conn.addEventListener("change", updateSnapshot);
  }
}

// ── The Hook ────────────────────────────────────────────────────────────────

/**
 * Tracks browser online/offline state and Network Information API telemetry.
 *
 * Uses `useSyncExternalStore` to guarantee hydration safety: the server snapshot
 * returns `{ online: true }`, matching the first client render. Actual network
 * state is read post-mount via the subscribe callback.
 */
export function useNetworkStatus(): NetworkStatus {
  const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
    ensureListeners();
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  }, []);

  const getSnapshot = useCallback((): NetworkStatus => currentSnapshot, []);
  const getServerSnapshot = useCallback((): NetworkStatus => SERVER_SNAPSHOT, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useNetworkStatus;
