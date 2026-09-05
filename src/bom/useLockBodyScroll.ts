import { useCallback } from "react";

let lockCount = 0;
let originalStyle: string | null = null;

function lock(): void {
  if (typeof window === "undefined") return;
  if (lockCount === 0) {
    originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount++;
}

function unlock(): void {
  if (typeof window === "undefined") return;
  if (lockCount > 0) {
    lockCount--;
    if (lockCount === 0) {
      document.body.style.overflow = originalStyle ?? "";
      originalStyle = null;
    }
  }
}

export function useLockBodyScrollImperative(): { lock: () => void; unlock: () => void } {
  return { lock, unlock };
}

export function useLockBodyScroll(): (node: Element | null) => (() => void) | void {
  return useCallback((node: Element | null) => {
    if (!node) return;
    lock();
    return () => {
      unlock();
    };
  }, []);
}
