import { useCallback, useEffect, useReducer, useRef } from "react";

type Options = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

type ObserverRecord = {
  observer: IntersectionObserver;
  elements: Set<Element>;
  options: IntersectionObserverInit;
};

const observerPool = new Map<string, ObserverRecord>();
const elementCallbacks = new Map<
  Element,
  Set<(entry: IntersectionObserverEntry) => void>
>();
let rootIdCounter = 1;
const rootIds = new WeakMap<Element, number>();

function getRootId(root: Element | null | undefined): string {
  if (!root) return "null";
  let id = rootIds.get(root);
  if (!id) {
    id = rootIdCounter++;
    rootIds.set(root, id);
  }
  return String(id);
}

function keyFromOptions(options: Options): string {
  const t = options?.threshold ?? undefined;
  const thr = Array.isArray(t) ? t.join(",") : String(t ?? "");
  return `${getRootId(options?.root)}|${options?.rootMargin ?? ""}|${thr}`;
}

function createObserver(options: Options) {
  const init: IntersectionObserverInit = {
    root: options.root ?? null,
    rootMargin: options.rootMargin,
    threshold: options.threshold,
  };

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const cbs = elementCallbacks.get(entry.target as Element);
        if (cbs) {
          cbs.forEach((cb) => cb(entry));
        }
      });
    },
    init
  );

  return { observer, init } as const;
}

// FIX: useReducer replaces two separate useState calls (entry + isIntersecting).
// One dispatch = one re-render instead of two.
interface IntersectionState {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | undefined;
}

function intersectionReducer(
  _prev: IntersectionState,
  entry: IntersectionObserverEntry,
): IntersectionState {
  return {
    isIntersecting: entry.isIntersecting,
    entry,
  };
}

/**
 * Legacy intersection observer hook with per-instance configuration support.
 *
 * Maintains a pooled observer keyed by (root, rootMargin, threshold). Multiple
 * components with the same options share one observer. The observer is
 * disconnected when the last element unregisters.
 *
 * FIX: Collapsed two useState into useReducer (single dispatch, single render).
 * FIX: Ref callback returns cleanup function (React 19 pattern) so the
 *      useEffect fallback cleanup is only needed for non-ref-callback usage.
 */
export function useIntersection(options: Options = {}) {
  const [state, dispatch] = useReducer(intersectionReducer, {
    isIntersecting: false,
    entry: undefined,
  });

  const nodeRef = useRef<Element | null>(null);
  const cbRef = useRef<
    ((entry: IntersectionObserverEntry) => void) | undefined
  >(undefined);
  const keyRef = useRef<string | null>(null);

  // Detach helper -- removes the element from the pool and cleans up.
  const detach = useCallback((node: Element, key: string, cb: ((entry: IntersectionObserverEntry) => void) | undefined) => {
    const rec = observerPool.get(key);
    const set = elementCallbacks.get(node);
    if (set && cb) set.delete(cb);
    if (set && set.size === 0) elementCallbacks.delete(node);
    if (rec) {
      try { rec.observer.unobserve(node); } catch { /* already unobserved */ }
      rec.elements.delete(node);
      if (rec.elements.size === 0) {
        rec.observer.disconnect();
        observerPool.delete(key);
      }
    }
  }, []);

  const attach = useCallback(
    (node: Element | null): void | (() => void) => {
      // Detach previous node.
      const prev = nodeRef.current;
      if (prev && keyRef.current) {
        detach(prev, keyRef.current, cbRef.current);
      }

      nodeRef.current = node;

      if (!node) return;

      if (
        typeof window === "undefined" ||
        typeof IntersectionObserver === "undefined"
      )
        return;

      const key = keyFromOptions(options);
      keyRef.current = key;

      let rec = observerPool.get(key);
      if (!rec) {
        const created = createObserver(options);
        rec = {
          observer: created.observer,
          elements: new Set(),
          options: created.init,
        };
        observerPool.set(key, rec);
      }

      let set = elementCallbacks.get(node);
      if (!set) {
        set = new Set();
        elementCallbacks.set(node, set);
      }

      const cb = (e: IntersectionObserverEntry) => {
        dispatch(e);
      };
      cbRef.current = cb;
      set.add(cb);
      rec.elements.add(node);
      rec.observer.observe(node);

      // React 19: return cleanup function from ref callback.
      return () => {
        detach(node, key, cb);
      };
    },
    [
      detach,
      options.root,
      options.rootMargin,
      // Serialize threshold for stable dependency comparison.
      JSON.stringify(options.threshold),
    ]
  );

  // Fallback cleanup: handles unmount when React has not called attach(null).
  useEffect(() => {
    return () => {
      const node = nodeRef.current;
      if (!node || !keyRef.current) return;
      detach(node, keyRef.current, cbRef.current);
    };
  }, [detach]);

  return {
    ref: attach,
    isIntersecting: state.isIntersecting,
    entry: state.entry,
  };
}

export default useIntersection;
