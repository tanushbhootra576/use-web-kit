import { useCallback, useEffect, useReducer, useRef } from 'react';

// ── Module-level BroadcastChannel Singleton Registry ─────────────────────────
//
// Each unique channelName gets one shared BroadcastChannel and one subscriber
// set. Multiple hook instances on the same channelName share the singleton.
// The channel is destroyed when the last subscriber unmounts (ref-counted).

interface ChannelSingleton<T> {
  channel: BroadcastChannel | null;
  snapshot: T;
  subscribers: Set<() => void>;
  refCount: number;
}

const channelRegistry = new Map<string, ChannelSingleton<unknown>>();

function getOrCreateChannel<T>(
  channelName: string,
  initialValue: T,
): ChannelSingleton<T> {
  const existing = channelRegistry.get(channelName);
  if (existing) return existing as ChannelSingleton<T>;

  const singleton: ChannelSingleton<T> = {
    channel: null,
    snapshot: initialValue,
    subscribers: new Set(),
    refCount: 0,
  };

  if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel(channelName);

    bc.onmessage = (event: MessageEvent) => {
      try {
        const incoming: T =
          typeof event.data === 'string'
            ? (JSON.parse(event.data) as T)
            : (event.data as T);

        singleton.snapshot = incoming;
        singleton.subscribers.forEach((fn) => fn());
      } catch {
        // Malformed message -- ignore.
      }
    };

    singleton.channel = bc;
  }

  channelRegistry.set(channelName, singleton as ChannelSingleton<unknown>);
  return singleton;
}

function destroyChannel(channelName: string): void {
  const singleton = channelRegistry.get(channelName);
  if (!singleton) return;

  if (singleton.channel) {
    singleton.channel.close();
    singleton.channel = null;
  }
  channelRegistry.delete(channelName);
}

// ── The Hook ─────────────────────────────────────────────────────────────────

/**
 * Cross-tab state synchronization via BroadcastChannel.
 *
 * Uses a ref-counted module-level singleton per channelName. Multiple hook
 * instances using the same channelName share one BroadcastChannel. The
 * channel is destroyed when the last subscriber unmounts.
 *
 * State updates from other tabs are received via the singleton's onmessage
 * handler and fanned out to all local subscribers via a shared Set.
 */
export function useBroadcastState<T>(
  channelName: string,
  initialValue: T,
): [T, (value: T | ((prevState: T) => T)) => void] {
  const singletonRef = useRef<ChannelSingleton<T> | null>(null);

  // Resolve the singleton (O(1) Map lookup, safe to call in render).
  if (!singletonRef.current) {
    singletonRef.current = getOrCreateChannel(channelName, initialValue);
  }
  const singleton = singletonRef.current;

  // useReducer with a simple replace reducer -- single dispatch, single render.
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  // Subscribe to the singleton on mount, unsubscribe on unmount.
  useEffect(() => {
    const s = getOrCreateChannel<T>(channelName, initialValue);
    singletonRef.current = s;
    s.refCount++;

    const listener = () => forceRender();
    s.subscribers.add(listener);

    return () => {
      s.subscribers.delete(listener);
      s.refCount--;

      if (s.refCount === 0) {
        // Defer destruction for StrictMode double-invoke safety.
        queueMicrotask(() => {
          if (s.refCount === 0) {
            destroyChannel(channelName);
          }
        });
      }
    };
  }, [channelName, initialValue]);

  const setState = useCallback(
    (value: T | ((prevState: T) => T)) => {
      const s = singletonRef.current;
      if (!s) return;

      const nextValue: T =
        typeof value === 'function'
          ? (value as (prevState: T) => T)(s.snapshot)
          : value;

      s.snapshot = nextValue;

      // Notify all local subscribers (triggers re-render in all instances).
      s.subscribers.forEach((fn) => fn());

      // Broadcast to other tabs.
      if (s.channel) {
        try {
          s.channel.postMessage(JSON.stringify(nextValue));
        } catch {
          // Channel closed between check and post -- safe to ignore.
        }
      }
    },
    [],
  );

  return [singleton.snapshot, setState];
}
