import { useEffect, useCallback, useRef } from "react";
import type { UseKeyboardShortcutOptions } from "../core/types";

// ── Global Singleton for Keyboard Shortcuts ───────────────────────────────

type ShortcutCallback = (event: KeyboardEvent) => void;

interface ShortcutRegistration {
  id: number;
  keyCombo: string;
  callback: ShortcutCallback;
  options: UseKeyboardShortcutOptions;
}

const windowRegistrations = new Map<number, ShortcutRegistration>();
const documentRegistrations = new Map<number, ShortcutRegistration>();
let nextId = 1;
let windowListenerAttached = false;
let documentListenerAttached = false;

function parseKeyCombo(combo: string) {
  const parts = combo.toLowerCase().split("+").map(p => p.trim());
  const hasCmd = parts.includes("cmd") || parts.includes("meta");
  const hasCtrl = parts.includes("ctrl");
  const hasShift = parts.includes("shift");
  const hasAlt = parts.includes("alt");
  const key = parts.find(p => !["cmd", "meta", "ctrl", "shift", "alt"].includes(p)) || "";
  
  return { hasCmd, hasCtrl, hasShift, hasAlt, key };
}

function handleKeydown(event: KeyboardEvent, registrations: Map<number, ShortcutRegistration>) {
  const eventKey = event.key.toLowerCase();
  for (const reg of registrations.values()) {
    if (reg.options.enabled === false) continue;

    const parsed = parseKeyCombo(reg.keyCombo);
    
    // Check modifiers
    if (parsed.hasCmd !== (event.metaKey)) continue;
    if (parsed.hasCtrl !== event.ctrlKey) continue;
    if (parsed.hasShift !== event.shiftKey) continue;
    if (parsed.hasAlt !== event.altKey) continue;
    
    // Check key
    if (parsed.key !== eventKey && parsed.key !== event.code.toLowerCase()) continue;

    if (reg.options.preventDefault !== false) {
      event.preventDefault();
    }
    
    reg.callback(event);
  }
}

function onWindowKeydown(event: KeyboardEvent) {
  handleKeydown(event, windowRegistrations);
}

function onDocumentKeydown(event: KeyboardEvent) {
  handleKeydown(event, documentRegistrations);
}

function subscribe(
  keyCombo: string,
  callback: ShortcutCallback,
  options: UseKeyboardShortcutOptions
): () => void {
  const target = options.target || "window";
  const id = nextId++;
  const registrations = target === "document" ? documentRegistrations : windowRegistrations;
  
  registrations.set(id, { id, keyCombo, callback, options });
  
  if (typeof window !== "undefined") {
    if (target === "window" && !windowListenerAttached) {
      window.addEventListener("keydown", onWindowKeydown);
      windowListenerAttached = true;
    }
    if (target === "document" && !documentListenerAttached && typeof document !== "undefined") {
      document.addEventListener("keydown", onDocumentKeydown);
      documentListenerAttached = true;
    }
  }

  return () => {
    registrations.delete(id);
    // Note: We don't remove the global listener when map is empty to save cycles, 
    // it's a singleton pattern. But we could if needed for strict zero memory leak? 
    // The instructions say "every addEventListener has removeEventListener". 
    // So we should remove when size is 0.
    if (target === "window" && registrations.size === 0 && windowListenerAttached) {
      window.removeEventListener("keydown", onWindowKeydown);
      windowListenerAttached = false;
    }
    if (target === "document" && registrations.size === 0 && documentListenerAttached && typeof document !== "undefined") {
      document.removeEventListener("keydown", onDocumentKeydown);
      documentListenerAttached = false;
    }
  };
}

export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options?: UseKeyboardShortcutOptions
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback; // Keep latest callback without re-binding

  const stableCallback = useCallback((event: KeyboardEvent) => {
    callbackRef.current(event);
  }, []);

  const stringifiedOptions = JSON.stringify(options);

  useEffect(() => {
    const opts = stringifiedOptions ? JSON.parse(stringifiedOptions) : {};
    return subscribe(key, stableCallback, opts);
  }, [key, stableCallback, stringifiedOptions]);
}
