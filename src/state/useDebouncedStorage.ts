/**
 * @fileoverview useDebouncedStorage — Hydration-safe persistent storage for React 19.
 *
 * ─── ARCHITECTURE OVERVIEW ─────────────────────────────────────────────────────
 *
 * PROBLEMS WITH THE NAIVE useStorage PATTERN:
 *   1. HYDRATION MISMATCH — Reading localStorage in useState initializer runs on
 *      the server (returns undefined) and on the client (returns stored value),
 *      producing a mismatch that React throws a warning for.
 *   2. WRITE THRASHING — Every keystroke in a controlled input triggers a
 *      synchronous localStorage.setItem(), which blocks the main thread.
 *   3. STALE STATE — Two components watching the same key hold separate useState
 *      instances that diverge on write.
 *   4. NO CROSS-TAB SYNC — The storage event fires only for OTHER tabs; same-tab
 *      updates are invisible to sibling components.
 *
 * THIS IMPLEMENTATION'S SOLUTION:
 *   1. useSyncExternalStore — The React-sanctioned API for subscribing to external
 *      mutable stores (localStorage is an external store). Provides a
 *      getServerSnapshot for SSR and a getSnapshot for the client, eliminating
 *      hydration mismatches by design.
 *
 *   2. Module-level StoreSingleton — One registry entry per (storageArea + key).
 *      All hook instances watching the same key share one in-memory snapshot and
 *      one subscriber set. A write from any component immediately propagates to
 *      all siblings — no stale state possible.
 *
 *   3. Debounced flush — The in-memory snapshot updates synchronously (instant
 *      re-render), while the actual storage write is debounced. Under rapid
 *      input, we write to storage at most once per `debounceMs`, preventing
 *      write thrashing without sacrificing UI responsiveness.
 *
 *   4. BroadcastChannel cross-tab sync — When a tab writes to storage, a
 *      BroadcastChannel message is posted to all other same-origin tabs. Those
 *      tabs update their in-memory snapshots and re-render immediately — without
 *      waiting for the debounce flush or polling storage.
 *
 *   5. Hydration two-render sequence — On server render: getServerSnapshot
 *      returns initialValue. On first client render: getSnapshot also returns
 *      initialValue (snapshot is null → initialValue fallback). After the
 *      subscribe callback fires (post-render), we read actual storage and notify
 *      if different → second render with real value. This is the correct,
 *      React-endorsed hydration pattern.
 *
 * @module useDebouncedStorage
 */

"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { StorageSerializer, UseDebouncedStorageOptions, UseDebouncedStorageReturn, StorageArea } from "../core/types";

// ─── Public Types ─────────────────────────────────────────────────────────────
// ─── Module-Level Store Singleton Infrastructure ───────────────────────────────
//
// Mirrors the singleton pattern from useSmartIntersection, applied to storage.
// One StoreSingleton per (storageArea + key) string. All hook instances watching
// the same key share one snapshot, one subscriber set, and one BroadcastChannel.

/** Registry key format: "localStorage:user-theme" */
type RegistryKey = string;

/**
 * Internal sentinel used to signal a key removal through the debounce pipeline,
 * without conflating it with a valid serialized value.
 */
const REMOVE_SENTINEL = "$$USE_WEB_KIT_REMOVE$$" as const;

interface StoreSingleton {
  /**
   * Serialized raw string from storage. `null` = not yet hydrated from actual
   * storage. When null, getSnapshot returns initialValue — matching the server.
   */
  snapshot: string | null;
  /** All useSyncExternalStore listener callbacks for this store. */
  subscribers: Set<() => void>;
  /** Active hook instance count. Store is destroyed when this hits 0. */
  refCount: number;
  /** Pending debounce timer handle. */
  debounceTimer: ReturnType<typeof setTimeout> | null;
  /**
   * Serialized value (or REMOVE_SENTINEL) waiting for debounce flush.
   * null means no pending write.
   */
  pendingWrite: string | null;
  /** BroadcastChannel for cross-tab sync. null if disabled or unavailable. */
  broadcastChannel: BroadcastChannel | null;
  /** Fallback storage event listener (when BroadcastChannel is unavailable). */
  storageEventListener: ((e: StorageEvent) => void) | null;
  /** For internal use by store operations. */
  readonly key: string;
  readonly storageArea: StorageArea;
}

/** Application-wide registry of all active store singletons. */
const storeRegistry = new Map<RegistryKey, StoreSingleton>();

// ─── Storage Utilities ────────────────────────────────────────────────────────

/** Returns the storage object with graceful SSR and privacy-mode fallbacks. */
function getStorageObject(area: StorageArea): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    // In Safari private mode, accessing localStorage throws a SecurityError.
    // A direct property access attempt is sufficient to detect this — no
    // test-write needed. Test-writes fire synthetic StorageEvents which pollute
    // any listeners watching the storage event on the same page.
    return area === "localStorage" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}


function makeRegistryKey(area: StorageArea, key: string): RegistryKey {
  return `${area}:${key}`;
}

// ─── Subscriber Notification ──────────────────────────────────────────────────

/**
 * Notifies all useSyncExternalStore listeners. React will synchronously
 * re-read getSnapshot() in each subscribed component and schedule re-renders
 * for any that have stale values.
 */
function notifySubscribers(store: StoreSingleton): void {
  // Snapshot the set before iterating — notifying a subscriber may synchronously
  // cause another subscriber to be added or removed (e.g., during React batching).
  const subs = Array.from(store.subscribers);
  subs.forEach((notify) => notify());
}

// ─── Debounced Write Pipeline ─────────────────────────────────────────────────

/**
 * Writes the pending serialized value (or performs removal) to actual storage.
 * Called either by the debounce timer or synchronously by flush().
 *
 * MEMORY SAFETY: Clears pendingWrite and debounceTimer regardless of whether
 * the storage write succeeds, preventing a stale timer from re-firing.
 */
function flushPendingWrite(store: StoreSingleton): void {
  if (store.pendingWrite === null) return;

  const { pendingWrite, key, storageArea } = store;
  store.pendingWrite = null;
  store.debounceTimer = null;

  const storage = getStorageObject(storageArea);
  if (!storage) return;

  try {
    if (pendingWrite === REMOVE_SENTINEL) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, pendingWrite);
    }
  } catch {
    // Quota exceeded or SecurityError. The in-memory state is already updated
    // so the UI is consistent. Surface this via an error boundary in production.
  }
}

/**
 * Schedules a debounced storage write. Cancels any prior scheduled write,
 * ensuring only the latest value is persisted when writes are rapid.
 *
 * PERFORMANCE IMPACT:
 *   100 keystrokes/sec in a controlled input → 100 in-memory updates (instant UI)
 *   but only ~1 localStorage.setItem every `debounceMs` milliseconds.
 */
function scheduleWrite(
  store: StoreSingleton,
  serialized: string,
  debounceMs: number,
): void {
  if (store.debounceTimer !== null) {
    clearTimeout(store.debounceTimer);
  }
  store.pendingWrite = serialized;
  store.debounceTimer = setTimeout(() => flushPendingWrite(store), debounceMs);
}

// ─── BroadcastChannel Messaging ───────────────────────────────────────────────

type BroadcastMessage =
  | { type: "write"; key: string; value: string }
  | { type: "remove"; key: string };

function broadcastMessage(store: StoreSingleton, msg: BroadcastMessage): void {
  if (!store.broadcastChannel) return;
  try {
    store.broadcastChannel.postMessage(msg);
  } catch {
    // Channel closed between check and postMessage. Safe to ignore.
  }
}

// ─── Store Lifecycle ──────────────────────────────────────────────────────────

/**
 * Creates a new StoreSingleton and wires up its cross-tab sync mechanisms.
 *
 * SYNC STRATEGY:
 *   Primary: BroadcastChannel — available in all modern browsers, fires only
 *     in other same-origin browsing contexts (not the originating tab).
 *   Fallback: storage event — only fires for localStorage, only in other tabs.
 *     Used when BroadcastChannel is unavailable (older browsers).
 */
function createStore(
  key: string,
  storageArea: StorageArea,
  useBroadcast: boolean,
): StoreSingleton {
  const store: StoreSingleton = {
    snapshot: null,
    subscribers: new Set(),
    refCount: 0,
    debounceTimer: null,
    pendingWrite: null,
    broadcastChannel: null,
    storageEventListener: null,
    key,
    storageArea,
  };

  const canBroadcast =
    useBroadcast && typeof BroadcastChannel !== "undefined";

  if (canBroadcast) {
    const channelName = `use-web-kit:${storageArea}:${key}`;
    const bc = new BroadcastChannel(channelName);

    bc.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const msg = event.data;
      // Type-guard: reject malformed or miskeyed messages.
      if (!msg || msg.key !== key) return;

      store.snapshot = msg.type === "remove" ? null : msg.value;
      notifySubscribers(store);
    };

    store.broadcastChannel = bc;
  } else if (typeof window !== "undefined" && storageArea === "localStorage") {
    // BroadcastChannel fallback — the native storage event covers localStorage
    // changes from other tabs, but NOT sessionStorage (tab-scoped by spec).
    const handler = (e: StorageEvent): void => {
      if (e.storageArea !== window.localStorage || e.key !== key) return;
      store.snapshot = e.newValue; // null when the key was deleted
      notifySubscribers(store);
    };
    window.addEventListener("storage", handler);
    store.storageEventListener = handler;
  }

  return store;
}

/**
 * Tears down a store singleton completely. Flushes any pending write first
 * (so data is not silently lost on component unmount), then closes the
 * BroadcastChannel and removes all event listeners.
 *
 * MEMORY SAFETY GUARANTEE:
 *   Called when refCount reaches 0. After this point, no callbacks, timers,
 *   or BroadcastChannel instances associated with this key remain in memory.
 */
function destroyStore(store: StoreSingleton, registryKey: RegistryKey): void {
  // Flush pending write synchronously before destroying — data integrity on unmount.
  if (store.debounceTimer !== null) {
    clearTimeout(store.debounceTimer);
    flushPendingWrite(store);
  }

  if (store.broadcastChannel) {
    store.broadcastChannel.close();
    store.broadcastChannel = null;
  }

  if (store.storageEventListener) {
    window.removeEventListener("storage", store.storageEventListener);
    store.storageEventListener = null;
  }

  storeRegistry.delete(registryKey);
}

/** Returns the singleton for a key, creating it on first access. */
function getOrCreateStore(
  key: string,
  storageArea: StorageArea,
  useBroadcast: boolean,
): StoreSingleton {
  const rk = makeRegistryKey(storageArea, key);
  let store = storeRegistry.get(rk);
  if (!store) {
    store = createStore(key, storageArea, useBroadcast);
    storeRegistry.set(rk, store);
  }
  return store;
}

// ─── Default Serializer ───────────────────────────────────────────────────────

function createDefaultSerializer<T>(): StorageSerializer<T> {
  return {
    read: (raw: string): T => {
      try {
        return JSON.parse(raw) as T;
      } catch {
        // Non-JSON values (plain strings) — return as-is with a cast.
        return raw as unknown as T;
      }
    },
    write: (value: T): string => JSON.stringify(value),
  };
}

// ─── The Hook ─────────────────────────────────────────────────────────────────

/**
 * `useDebouncedStorage` — Hydration-safe, performance-optimized persistent
 * storage for React 19.
 *
 * @description
 * Wraps `localStorage` (or `sessionStorage`) using `useSyncExternalStore` —
 * the React-endorsed pattern for subscribing to external mutable stores.
 * This eliminates hydration mismatches, stale state between sibling components,
 * and write thrashing under rapid updates.
 *
 * **Read path**: Synchronous. Returns the in-memory snapshot from the shared
 * module-level store. Zero storage I/O on re-render.
 *
 * **Write path**: Two-phase. The in-memory snapshot updates immediately
 * (instant re-render), then the actual `setItem` is debounced by `debounceMs`.
 * Use `flush()` to force an immediate write when needed.
 *
 * **Cross-tab sync**: Handled by a `BroadcastChannel` per key. Other tabs
 * update their snapshots and re-render without polling or storage event delays.
 *
 * @param key - The localStorage / sessionStorage key to bind to.
 * @param initialValue - Value used during SSR and when the key is absent from storage.
 * @param options - Storage area, debounce timing, serializer, and sync settings.
 * @returns `{ value, setValue, removeValue, flush }`
 *
 * @see {@link https://react.dev/reference/react/useSyncExternalStore | React: useSyncExternalStore}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel | MDN: BroadcastChannel}
 *
 * @example Basic usage — persistent counter:
 * ```tsx
 * "use client";
 * import { useDebouncedStorage } from "use-web-kit";
 *
 * export function Counter() {
 *   const { value: count, setValue } = useDebouncedStorage("count", 0);
 *   return <button onClick={() => setValue(n => n + 1)}>Count: {count}</button>;
 * }
 * ```
 *
 * @example Debounced form field — writes on 500ms idle:
 * ```tsx
 * "use client";
 * import { useDebouncedStorage } from "use-web-kit";
 *
 * export function DraftInput() {
 *   const { value, setValue, flush } = useDebouncedStorage("draft", "", {
 *     debounceMs: 500,
 *   });
 *
 *   return (
 *     <textarea
 *       value={value}
 *       onChange={(e) => setValue(e.target.value)}
 *       onBlur={flush} // persist immediately when user leaves the field
 *     />
 *   );
 * }
 * ```
 *
 * @example Cross-tab theme sync:
 * ```tsx
 * "use client";
 * import { useDebouncedStorage } from "use-web-kit";
 *
 * export function ThemeToggle() {
 *   const { value: theme, setValue } = useDebouncedStorage(
 *     "theme",
 *     "light",
 *     { broadcastSync: true }, // other tabs update instantly
 *   );
 *
 *   return (
 *     <button onClick={() => setValue(t => t === "light" ? "dark" : "light")}>
 *       {theme === "light" ? "🌙" : "☀️"}
 *     </button>
 *   );
 * }
 * ```
 */
export function useDebouncedStorage<T>(
  key: string,
  initialValue: T,
  options: UseDebouncedStorageOptions<T> = {},
): UseDebouncedStorageReturn<T> {
  const {
    storage: storageArea = "localStorage",
    debounceMs = 300,
    serializer = createDefaultSerializer<T>(),
    // sessionStorage is tab-scoped by spec — cross-tab sync makes no sense.
    broadcastSync = storageArea === "localStorage",
  } = options;

  // Resolve the shared store singleton for this key.
  // getOrCreateStore is called on every render but is O(1) (Map lookup).
  const store = getOrCreateStore(key, storageArea, broadcastSync);
  const registryKey = makeRegistryKey(storageArea, key);

  // ── useSyncExternalStore wiring ─────────────────────────────────────────────

  /**
   * subscribe — called by React after each render where this hook is used.
   * Adds our listener to the store's subscriber set and returns the cleanup fn.
   *
   * HYDRATION: On the FIRST subscriber for a given key, we read the actual
   * stored value from storage. If it differs from the current snapshot (which
   * is null = "not yet hydrated"), we update the snapshot and notify. This
   * triggers a second render with the real stored value — after the initial
   * hydration render completed safely with initialValue.
   *
   * This two-render pattern is intentional and documented by the React team
   * as the correct way to handle external store hydration with useSyncExternalStore.
   */
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      store.subscribers.add(onStoreChange);
      store.refCount++;

      // Hydrate from actual storage on first subscriber only.
      if (store.snapshot === null) {
        const storage = getStorageObject(storageArea);
        if (storage !== null) {
          const raw = storage.getItem(key);
          // Store the raw value (even if null — null means "key absent").
          // We differentiate "not yet hydrated" (store.snapshot === null before
          // this point) from "key absent" (raw === null) by storing the initial
          // serialized value when the key is absent, so subsequent getSnapshot
          // calls return a stable reference and React doesn't loop.
          store.snapshot = raw !== null ? raw : serializer.write(initialValue);

          // Only notify if the real value differs from our sentinel null.
          // raw !== null means actual stored data exists → trigger re-render.
          if (raw !== null) {
            // Defer notification to avoid "setState during render" warnings.
            // queueMicrotask runs synchronously after the current task but
            // before the next paint, making it ideal for post-subscribe sync.
            queueMicrotask(() => notifySubscribers(store));
          }
        }
      }

      return () => {
        store.subscribers.delete(onStoreChange);
        store.refCount--;

        // MEMORY SAFETY + STRICTMODE SAFETY:
        // Defer store destruction by one microtask. React StrictMode (dev only)
        // double-invokes effects: subscribe → unsubscribe → subscribe. Without
        // the defer, the first unsubscribe (refCount → 0) would destroy the store
        // and close its BroadcastChannel before the second subscribe re-attaches.
        // queueMicrotask runs synchronously after the current JS task but before
        // the next paint, so there is zero perceptible delay in production — and
        // in StrictMode the second subscribe fires within the same microtask queue,
        // incrementing refCount back above 0 before the check below runs.
        if (store.refCount === 0) {
          queueMicrotask(() => {
            if (store.refCount === 0) {
              destroyStore(store, registryKey);
            }
          });
        }
      };

    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // key, storageArea, registryKey are stable for the lifetime of the hook
    // call (the component would be remounted if these change, not re-rendered).
    [store, registryKey, storageArea, key, serializer, initialValue],
  );

  /**
   * getSnapshot — called synchronously by React on every render to read the
   * current store value. Must return the same reference if the value hasn't
   * changed (React uses Object.is for comparison).
   *
   * SSR + HYDRATION SAFETY:
   *   Returns null when the store hasn't been hydrated yet (snapshot === null).
   *   The hook then falls back to initialValue in the return statement below.
   *   This ensures the initial client render matches the server render exactly.
   */
  const getSnapshot = useCallback((): string | null => {
    return store.snapshot;
  }, [store]);

  /**
   * getServerSnapshot — called only during SSR. Must return a stable value
   * that matches what getSnapshot returns on the first client render.
   * Always returns null here, which maps to initialValue in the hook return.
   */
  const getServerSnapshot = useCallback((): null => null, []);

  // The raw snapshot from useSyncExternalStore. null = "use initialValue".
  const rawSnapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /**
   * Deserialize the raw snapshot into T. Falls back to initialValue when:
   *   - rawSnapshot is null (SSR / pre-hydration / key absent from storage)
   *   - Deserialization throws (corrupted storage data)
   */
  const value: T = (() => {
    if (rawSnapshot === null) return initialValue;
    try {
      return serializer.read(rawSnapshot);
    } catch {
      return initialValue;
    }
  })();

  // ── Write Operations ────────────────────────────────────────────────────────

  /**
   * setValue — updates the in-memory snapshot immediately and schedules a
   * debounced flush to actual storage.
   *
   * WRITE FLOW:
   *   1. Serialize the new value.
   *   2. Update store.snapshot synchronously → notifySubscribers → React
   *      re-renders all components watching this key in the same batch.
   *   3. Schedule debounced storage write.
   *   4. Broadcast to other tabs via BroadcastChannel.
   */
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)): void => {
      // Resolve updater function pattern, mirroring React's setState API.
      const resolved =
        typeof newValue === "function"
          ? (newValue as (prev: T) => T)(value)
          : newValue;

      const serialized = serializer.write(resolved);

      // 1. Optimistic in-memory update.
      store.snapshot = serialized;
      // 2. Notify all subscribers → triggers re-renders across all components
      //    watching this key in the same tab.
      notifySubscribers(store);
      // 3. Debounced flush to actual storage.
      scheduleWrite(store, serialized, debounceMs);
      // 4. Broadcast to other tabs.
      broadcastMessage(store, { type: "write", key, value: serialized });
    },
    [store, serializer, value, debounceMs, key],
  );

  /**
   * removeValue — clears the key from storage and resets the in-memory value
   * to initialValue. Other tabs are notified via BroadcastChannel.
   */
  const removeValue = useCallback((): void => {
    // Setting snapshot to null means "key absent" → falls back to initialValue.
    store.snapshot = null;
    notifySubscribers(store);
    // Use REMOVE_SENTINEL so flushPendingWrite knows to call removeItem.
    scheduleWrite(store, REMOVE_SENTINEL, debounceMs);
    broadcastMessage(store, { type: "remove", key });
  }, [store, debounceMs, key]);

  /**
   * flush — forces an immediate storage write, bypassing the debounce timer.
   * The in-memory state is already up to date; this only affects persistence.
   */
  const flush = useCallback((): void => {
    if (store.debounceTimer !== null) {
      clearTimeout(store.debounceTimer);
      store.debounceTimer = null;
    }
    flushPendingWrite(store);
  }, [store]);

  return { value, setValue, removeValue, flush };
}

// ─── Usage Examples ────────────────────────────────────────────────────────────

/**
 * @example MIGRATION from useStorage
 *
 * ```tsx
 * // BEFORE (old hook — no hydration safety, no cross-tab sync, no debounce)
 * import { useStorage } from "use-web-kit";
 * const { value, setValue, removeValue } = useStorage("key", defaultValue);
 *
 * // AFTER — drop-in replacement (identical API surface)
 * import { useDebouncedStorage } from "use-web-kit";
 * const { value, setValue, removeValue } = useDebouncedStorage("key", defaultValue);
 *
 * // AFTER — with all options
 * const { value, setValue, removeValue, flush } = useDebouncedStorage("key", defaultValue, {
 *   storage: "sessionStorage",  // target sessionStorage instead
 *   debounceMs: 500,            // wait 500ms before writing
 *   broadcastSync: false,       // disable cross-tab sync
 *   serializer: {               // custom serializer for non-JSON types
 *     read: (raw) => new Date(raw),
 *     write: (date) => date.toISOString(),
 *   },
 * });
 * ```
 */
