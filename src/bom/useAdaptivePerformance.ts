import { useSyncExternalStore } from "react";

export type PerformanceTier = "high" | "medium" | "low";

export interface AdaptivePerformanceMetrics {
  tier: PerformanceTier;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  saveData?: boolean;
  effectiveType?: string;
}

// Ensure the snapshot is stable by caching it
let currentSnapshot: AdaptivePerformanceMetrics = { tier: "high" };
let isInitialized = false;

function getMetrics(): AdaptivePerformanceMetrics {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { tier: "high" }; // Safe default for SSR
  }

  const nav = navigator as any;
  const hardwareConcurrency = nav.hardwareConcurrency || 4;
  const deviceMemory = nav.deviceMemory || 4;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  const effectiveType = connection?.effectiveType || "4g";
  const saveData = connection?.saveData || false;

  let score = 0;

  if (hardwareConcurrency >= 8) score += 2;
  else if (hardwareConcurrency >= 4) score += 1;

  if (deviceMemory >= 8) score += 2;
  else if (deviceMemory >= 4) score += 1;

  if (effectiveType === "4g") score += 2;
  else if (effectiveType === "3g") score += 1;

  let tier: PerformanceTier = "medium";
  if (saveData || score <= 2) {
    tier = "low";
  } else if (score >= 5) {
    tier = "high";
  }

  return {
    tier,
    hardwareConcurrency,
    deviceMemory,
    saveData,
    effectiveType,
  };
}

function updateSnapshot() {
  const newMetrics = getMetrics();
  // Only update if something changed
  if (
    currentSnapshot.tier !== newMetrics.tier ||
    currentSnapshot.hardwareConcurrency !== newMetrics.hardwareConcurrency ||
    currentSnapshot.deviceMemory !== newMetrics.deviceMemory ||
    currentSnapshot.saveData !== newMetrics.saveData ||
    currentSnapshot.effectiveType !== newMetrics.effectiveType
  ) {
    currentSnapshot = newMetrics;
  }
}

// Module-level listener management
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  
  // Setup global event listener for network changes if this is the first subscriber
  const connection = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
  
  const handleNetworkChange = () => {
    updateSnapshot();
    listeners.forEach((listener) => listener());
  };

  if (listeners.size === 1 && connection) {
    connection.addEventListener("change", handleNetworkChange);
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && connection) {
      connection.removeEventListener("change", handleNetworkChange);
    }
  };
}

function getSnapshot() {
  if (!isInitialized && typeof window !== 'undefined') {
    currentSnapshot = getMetrics();
    isInitialized = true;
  }
  return currentSnapshot;
}

function getServerSnapshot() {
  return { tier: "high" as PerformanceTier };
}

export function useAdaptivePerformance(): AdaptivePerformanceMetrics {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
