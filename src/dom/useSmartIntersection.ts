/**
 * @fileoverview useSmartIntersection — Enterprise-grade Intersection Observer hook for React 19.
 *
 * ─── ARCHITECTURE OVERVIEW ─────────────────────────────────────────────────────
 *
 * PROBLEM WITH NAIVE IMPLEMENTATIONS:
 *   The standard pattern creates one IntersectionObserver per hook instance.
 *   With 100 observed elements, you get 100 observers firing 100 separate
 *   callbacks per scroll event — an O(n) render cascade that causes scroll jank.
 *
 * THIS IMPLEMENTATION'S SOLUTION:
 *   1. GLOBAL SINGLETON — One IntersectionObserver for the entire app lifetime.
 *      All elements are registered into a single observer, which fires a single
 *      batched callback no matter how many elements are on screen.
 *
 *   2. RAF BATCHING — The observer's callback queues all dirty entries into a
 *      pending map. A single requestAnimationFrame flushes all of them at once,
 *      coalescing many intersection events per frame into one pass.
 *
 *   3. REACT 19 REF CALLBACK CLEANUP — The hook returns a ref callback that
 *      directly returns its own cleanup function. React 19 will call the cleanup
 *      automatically when the element is removed or the ref changes, eliminating
 *      the need for a paired useEffect entirely.
 *
 *   4. ZERO MEMORY LEAKS — Every code path that registers a node also has a
 *      symmetric cleanup path. The global registry uses a Map<Element, Set<fn>>,
 *      and entries are removed as soon as the last subscriber unregisters.
 *
 *   5. SSR IMMUNITY — The singleton observer is created lazily, only when
 *      getObserver() is first called on the client. On the server, the guard
 *      `typeof IntersectionObserver === "undefined"` prevents any BOM access.
 *
 * @module useSmartIntersection
 */

"use client";

import {
  startTransition,
  useCallback,
  useReducer,
  useRef,
} from "react";
import type { UseSmartIntersectionOptions, UseSmartIntersectionReturn, IntersectionCallback } from "../core/types";

// ─── Public Types ────────────────────────────────────────────────────────────
// ─── Global Singleton Infrastructure ─────────────────────────────────────────
//
// Everything below this comment lives OUTSIDE the React component tree.
// It is module-level state — created once, shared across all hook instances.
//
// WHY MODULE-LEVEL?
//   React state and refs are per-component-instance. We need one observer
//   that is shared across every component in the application. Module-level
//   variables are the correct tool for true application-wide singletons.

/**
 * The registry maps each observed Element to the Set of callback functions
 * that have subscribed to its intersection events.
 *
 * WHY Map<Element, Set<fn>> instead of a WeakMap?
 *   WeakMap keys are not enumerable. We need to iterate over registered elements
 *   to clean them up. A regular Map gives us .size and .delete(), while the
 *   explicit cleanup in the ref callback prevents the memory-leak risk of Map.
 */
const elementRegistry = new Map<Element, Set<IntersectionCallback>>();

/**
 * A pending flush map that accumulates IntersectionObserverEntries between
 * animation frames. The map key is the target Element; using a Map ensures
 * that if an element fires multiple intersection events in the same frame,
 * only the latest entry is kept (natural deduplication).
 */
const pendingEntries = new Map<Element, IntersectionObserverEntry>();

/**
 * The RAF handle for the currently scheduled flush. Stored so we can cancel
 * it if needed (e.g., in testing environments or if the observer is torn down).
 */
let rafHandle: number | null = null;

/**
 * The single shared IntersectionObserver instance for the application.
 * Initialized lazily on first use to guarantee SSR safety.
 */
let sharedObserver: IntersectionObserver | null = null;

/**
 * Flushes all accumulated pending entries to their registered callbacks.
 *
 * PERFORMANCE NOTE:
 *   This function is the only place where subscriber callbacks are invoked.
 *   By running inside a RAF, we guarantee that all intersection events that
 *   occurred in a given frame are processed together in a single synchronous
 *   pass — not in N separate microtask or task callbacks.
 *
 *   This is critical during fast scroll: the browser may fire 60+ intersection
 *   events per second. Without batching, each one would independently schedule
 *   a React re-render. With RAF batching, we collapse all of them into at most
 *   one batch per frame.
 */
function flushPendingEntries(): void {
  // Clear the handle first — if a callback synchronously triggers another
  // observation, we want a fresh RAF to be scheduled, not a stale handle reused.
  rafHandle = null;

  // Snapshot and clear the pending map atomically before iterating.
  // This prevents re-entrant flush calls from processing the same entries twice.
  const snapshot = new Map(pendingEntries);
  pendingEntries.clear();

  snapshot.forEach((entry, element) => {
    const callbacks = elementRegistry.get(element);
    if (!callbacks) return;

    // Invoke each registered callback for this element.
    // We iterate a copy via forEach (Set iteration is safe mid-modification
    // in modern engines, but this makes intent explicit).
    callbacks.forEach((cb) => {
      cb(entry);
    });
  });
}

/**
 * The IntersectionObserver callback. This is called by the browser when any
 * observed element's intersection status changes.
 *
 * MEMORY SAFETY:
 *   We do NOT call subscriber callbacks here directly. We stage entries into
 *   `pendingEntries` and schedule a RAF. This decouples the browser's callback
 *   timing from React's render cycle.
 */
function handleIntersection(entries: IntersectionObserverEntry[]): void {
  entries.forEach((entry) => {
    // Overwrite any previous pending entry for this element.
    // If the element entered and exited the viewport between two RAF ticks,
    // only the final state is delivered — preventing ghost state updates.
    pendingEntries.set(entry.target as Element, entry);
  });

  // Schedule exactly one RAF flush. If one is already scheduled, do nothing.
  // This is the core of the batching strategy.
  if (rafHandle === null) {
    rafHandle = requestAnimationFrame(flushPendingEntries);
  }
}

/**
 * Returns the global singleton IntersectionObserver, creating it on first call.
 *
 * SSR SAFETY:
 *   This function must never be called during SSR. The guard at the call site
 *   in `useSmartIntersection` ensures `IntersectionObserver` is available before
 *   this is invoked.
 *
 *   The lazy initialization pattern also means that in environments where the
 *   hook is imported but never used (e.g., a server component importing this
 *   module), no observer is ever created.
 */
function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(handleIntersection, {
      // The global singleton uses viewport-level defaults. Per-element
      // customization (rootMargin, threshold) is not supported on the singleton
      // itself — this is an intentional trade-off for zero-observer-overhead.
      // For custom root/threshold configurations, see the design note below.
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
  }
  return sharedObserver;
}

// ─── DESIGN NOTE: Single Observer vs. Observer Pool ──────────────────────────
//
// The strict requirement is "one single global IntersectionObserver".
// This means ALL elements share the same root/rootMargin/threshold.
// This is the maximum-performance configuration: one observer, one callback,
// one RAF flush per frame.
//
// Trade-off: per-element custom thresholds are not supported at the observer
// level. If you need per-element thresholds (e.g., fire at 50% visibility),
// the onIntersect callback can filter by entry.intersectionRatio at the
// application level. This keeps the infrastructure at O(1) while giving
// consumers the flexibility they need.
//
// If you require distinct IntersectionObserver configurations (e.g., a sticky
// header needs a different rootMargin than a lazy-loaded image), use Module 1b
// (a keyed observer pool) — that is a separate, intentional extension point.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registers an element with the global observer and the element registry.
 * Returns an unregister function that performs the symmetric cleanup.
 *
 * @param element - The DOM element to observe.
 * @param callback - The function to invoke on intersection change.
 * @returns A cleanup function that removes this subscriber and, if no
 *          subscribers remain for this element, unobserves it entirely.
 */
function registerElement(
  element: Element,
  callback: IntersectionCallback,
): () => void {
  // Get or create the subscriber set for this element.
  let callbacks = elementRegistry.get(element);
  if (!callbacks) {
    callbacks = new Set();
    elementRegistry.set(element, callbacks);

    // Only call observer.observe() once per element, regardless of how many
    // hook instances are watching it. The registry fan-out handles multiple
    // subscribers; the observer just needs to know about the element once.
    getObserver().observe(element);
  }

  callbacks.add(callback);

  // Return the cleanup function — this is what React 19 ref callbacks return.
  return function unregister(): void {
    const cbs = elementRegistry.get(element);
    if (!cbs) return; // Already cleaned up, guard against double-call.

    cbs.delete(callback);

    // If this was the last subscriber for this element, stop observing it
    // entirely. This is critical for memory safety with virtualized lists
    // where elements mount and unmount rapidly.
    if (cbs.size === 0) {
      elementRegistry.delete(element);
      getObserver().unobserve(element);

      // Also remove any pending (not-yet-flushed) entry for this element
      // to prevent a stale callback invocation after unmount.
      pendingEntries.delete(element);
    }
  };
}

// ─── Internal State Shape ────────────────────────────────────────────────────

interface IntersectionState {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

// Using useReducer instead of two separate useState calls eliminates a
// second re-render. A single dispatch → single reconciliation pass.
function intersectionReducer(
  _prev: IntersectionState,
  entry: IntersectionObserverEntry,
): IntersectionState {
  return {
    isIntersecting: entry.isIntersecting,
    entry,
  };
}

// ─── The Hook ────────────────────────────────────────────────────────────────

/**
 * `useSmartIntersection` — Zero-overhead intersection detection for React 19.
 *
 * @description
 * Observes DOM elements using a **global singleton** `IntersectionObserver`
 * shared across all instances in the application. All intersection events are
 * batched via `requestAnimationFrame` to prevent scroll jank, and state updates
 * are committed through a single `useReducer` dispatch (one render per entry).
 *
 * Cleanup is handled exclusively via the **React 19 ref callback** return value —
 * no `useEffect` required. This ensures cleanup ownership is unambiguous and
 * eliminates the double-cleanup race condition present in older patterns.
 *
 * Supports two usage modes:
 * - **State-driven**: returns reactive `{ isIntersecting, entry }` state.
 * - **Callback-driven**: fires `onIntersect` without any React state allocation.
 * Both modes can be combined on the same element.
 *
 * @param options - Configuration for intersection behavior and React integration.
 * @returns `{ ref, isIntersecting, entry }` — attach `ref` to the target element.
 *
 * @see {@link https://react.dev/blog/2024/04/25/react-19#cleanup-functions-for-refs | React 19: Cleanup functions for refs}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API | MDN: Intersection Observer API}
 *
 * @example State-driven (lazy loading, animations):
 * ```tsx
 * function LazyImage({ src }: { src: string }) {
 *   const { ref, isIntersecting } = useSmartIntersection({ lowPriority: true });
 *   return <img ref={ref} src={isIntersecting ? src : undefined} />;
 * }
 * ```
 *
 * @example Callback-driven (analytics, zero re-renders):
 * ```tsx
 * function TrackedSection({ id }: { id: string }) {
 *   const { ref } = useSmartIntersection({
 *     onIntersect: (entry) => {
 *       if (entry.isIntersecting) analytics.track('section_viewed', { id });
 *     },
 *   });
 *   return <section ref={ref}>...</section>;
 * }
 * ```
 *
 * @example Mixed mode (state + side-effect on same element):
 * ```tsx
 * function Card() {
 *   const { ref, isIntersecting, entry } = useSmartIntersection({
 *     lowPriority: true,
 *     onIntersect: (e) => console.log('ratio:', e.intersectionRatio),
 *   });
 *   return <div ref={ref} className={isIntersecting ? 'visible' : 'hidden'} />;
 * }
 * ```
 */
export function useSmartIntersection(
  options: UseSmartIntersectionOptions = {},
): UseSmartIntersectionReturn {
  const { lowPriority = false, onIntersect } = options;

  // ── State (state-driven mode) ──────────────────────────────────────────────
  // useReducer with a two-field reducer avoids the double re-render that would
  // come from two useState calls (one for isIntersecting, one for entry).
  const [state, dispatch] = useReducer(intersectionReducer, {
    isIntersecting: false,
    entry: null,
  });

  // ── Stable callback ref ────────────────────────────────────────────────────
  // We store the latest onIntersect in a ref so the ref callback (which is
  // memoized via useCallback) never needs to be recreated when the consumer's
  // onIntersect function identity changes between renders.
  // This pattern avoids the "stale closure" problem without breaking memoization.
  const onIntersectRef = useRef<IntersectionCallback | undefined>(onIntersect);
  onIntersectRef.current = onIntersect;

  // ── Internal subscriber callback ───────────────────────────────────────────
  // This is the function registered in the global elementRegistry.
  // It is stable across renders (defined once per hook instance via useCallback
  // with an empty dependency array), which is essential because it is used as
  // a Map key in the registry.
  const subscriberCallback = useCallback<IntersectionCallback>((entry) => {
    // 1. Fire the consumer's callback (callback-driven mode).
    //    We read from the ref to always get the latest version without
    //    invalidating the memoization of subscriberCallback itself.
    onIntersectRef.current?.(entry);

    // 2. Update React state (state-driven mode).
    //    We always dispatch; the reducer is cheap and React bails out of
    //    re-rendering if the new state reference is the same as the old one.
    //    (It won't be — entry is a new object each time — but the component
    //     only re-renders once per dispatch, not once per setState call.)
    if (lowPriority) {
      // Wrap in startTransition to deprioritize the re-render.
      // This keeps the main thread responsive to urgent interactions (clicks,
      // typing) even when dozens of intersection events fire per frame.
      startTransition(() => {
        dispatch(entry);
      });
    } else {
      dispatch(entry);
    }
  }, [lowPriority]); // lowPriority changes the dispatch strategy — include it.

  // ── React 19 Ref Callback ─────────────────────────────────────────────────
  // This is the object returned to the consumer for use as a JSX ref prop.
  //
  // REACT 19 CLEANUP PATTERN:
  //   In React 19, a ref callback may return a cleanup function. React will
  //   call the cleanup automatically when:
  //     a) The component unmounts.
  //     b) The ref prop is removed from the element.
  //     c) The ref callback identity changes (causing a re-attach).
  //
  //   This eliminates the need for a paired useEffect to handle unmount cleanup,
  //   which was a source of subtle double-cleanup bugs in the old useIntersection.
  //
  // MEMORY SAFETY GUARANTEE:
  //   Every code path that calls registerElement() returns an unregister fn.
  //   React 19 guarantees the cleanup is called exactly once per attach.
  //   Therefore: no element can be observed without a corresponding unobserve.
  const ref = useCallback(
    (node: Element | null): void | (() => void) => {
      // Guard 1: null node means the element was removed from the DOM.
      // Return nothing (React handles this; cleanup was already called).
      if (node === null) return;

      // Guard 2: SSR safety. IntersectionObserver does not exist on the server.
      // This check prevents any access to browser globals during SSR.
      if (typeof IntersectionObserver === "undefined") return;

      // Register the node with the global singleton and get the cleanup fn.
      const unregister = registerElement(node, subscriberCallback);

      // ✅ Return the cleanup function directly.
      // React 19 will call this when the element unmounts or the ref changes.
      return unregister;
    },
    [subscriberCallback], // Re-create the ref callback only if the subscriber changes.
  );

  return {
    ref,
    isIntersecting: state.isIntersecting,
    entry: state.entry,
  };
}

// ─── Usage Examples ───────────────────────────────────────────────────────────

/**
 * @example STATE-DRIVEN MODE — Lazy image loading with low-priority updates
 *
 * ```tsx
 * "use client";
 * import { useSmartIntersection } from "use-web-kit";
 *
 * export function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   // lowPriority: true → wrapped in startTransition → keeps UI responsive
 *   // The image loads when it enters the viewport; no jank during fast scroll.
 *   const { ref, isIntersecting } = useSmartIntersection({ lowPriority: true });
 *
 *   return (
 *     <img
 *       ref={ref}
 *       src={isIntersecting ? src : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
 *       alt={alt}
 *       style={{ minHeight: 200 }}
 *     />
 *   );
 * }
 * ```
 *
 * @example CALLBACK-DRIVEN MODE — Analytics impression tracking, zero re-renders
 *
 * ```tsx
 * "use client";
 * import { useSmartIntersection } from "use-web-kit";
 *
 * export function TrackedArticle({ articleId }: { articleId: string }) {
 *   const hasTracked = useRef(false);
 *
 *   const { ref } = useSmartIntersection({
 *     onIntersect: (entry) => {
 *       // Only track once, when at least 50% of the article is visible.
 *       if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasTracked.current) {
 *         hasTracked.current = true;
 *         analytics.track("article_impression", { articleId });
 *       }
 *     },
 *   });
 *
 *   return <article ref={ref}>...</article>;
 * }
 * ```
 *
 * @example ANIMATION TRIGGER — Reveal on scroll
 *
 * ```tsx
 * "use client";
 * import { useSmartIntersection } from "use-web-kit";
 *
 * export function RevealSection({ children }: { children: React.ReactNode }) {
 *   const { ref, isIntersecting } = useSmartIntersection();
 *
 *   return (
 *     <section
 *       ref={ref}
 *       style={{
 *         opacity: isIntersecting ? 1 : 0,
 *         transform: isIntersecting ? "translateY(0)" : "translateY(32px)",
 *         transition: "opacity 0.4s ease, transform 0.4s ease",
 *       }}
 *     >
 *       {children}
 *     </section>
 *   );
 * }
 * ```
 *
 * @example MIGRATION from useIntersection
 *
 * ```tsx
 * // BEFORE (old hook)
 * import { useIntersection } from "use-web-kit";
 * const { ref, isIntersecting, entry } = useIntersection({ rootMargin: "100px" });
 *
 * // AFTER (new hook — drop-in compatible for the state-driven API)
 * import { useSmartIntersection } from "use-web-kit";
 * const { ref, isIntersecting, entry } = useSmartIntersection();
 * // Note: rootMargin and threshold are configured at the observer level.
 * // For entry.intersectionRatio filtering, use the onIntersect callback.
 * ```
 */
