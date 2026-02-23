import { useCallback, useEffect, useRef, useState } from "react";

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

function getRootId(root: Element | null | undefined) {
  if (!root) return "null";
  let id = rootIds.get(root);
  if (!id) {
    id = rootIdCounter++;
    rootIds.set(root, id);
  }
  return String(id);
}

function keyFromOptions(options: Options) {
  const t = (options && (options.threshold as any)) ?? undefined;
  const thr = Array.isArray(t) ? t.join(",") : String(t ?? "");
  return `${getRootId(options?.root)}|${options?.rootMargin ?? ""}|${thr}`;
}

function createObserver(options: Options) {
  const init: IntersectionObserverInit = {
    root: options.root ?? null,
    rootMargin: options.rootMargin,
    threshold: options.threshold as any,
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

export function useIntersection(options: Options = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const nodeRef = useRef<Element | null>(null);
  const cbRef = useRef<
    ((entry: IntersectionObserverEntry) => void) | undefined
  >(undefined);
  const keyRef = useRef<string | null>(null);

  const attach = useCallback(
    (node: Element | null) => {
      // detach previous
      const prev = nodeRef.current;
      if (prev) {
        const prevKey = keyRef.current!;
        const rec = observerPool.get(prevKey);
        const cb = cbRef.current;
        const set = elementCallbacks.get(prev);
        if (set && cb) set.delete(cb);
        if (rec) {
          try {
            rec.observer.unobserve(prev);
          } catch (e) {}
          rec.elements.delete(prev);
          if (rec.elements.size === 0) {
            rec.observer.disconnect();
            observerPool.delete(prevKey);
          }
        }
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
        setEntry(e);
        setIsIntersecting(e.isIntersecting);
      };
      cbRef.current = cb;
      set.add(cb);
      rec.elements.add(node);
      rec.observer.observe(node);
    },
    [
      options.root,
      options.rootMargin,
      JSON.stringify(
        Array.isArray(options.threshold) ? options.threshold : options.threshold
      ),
    ]
  );

  useEffect(() => {
    return () => {
      const node = nodeRef.current;
      if (!node) return;
      const key = keyRef.current!;
      const rec = observerPool.get(key);
      const cb = cbRef.current;
      const set = elementCallbacks.get(node);
      if (set && cb) set.delete(cb);
      if (rec) {
        try {
          rec.observer.unobserve(node);
        } catch (e) {}
        rec.elements.delete(node);
        if (rec.elements.size === 0) {
          rec.observer.disconnect();
          observerPool.delete(key);
        }
      }
    };
  }, []);

  return {
    ref: attach as (node: Element | null) => void,
    isIntersecting,
    entry,
  };
}

export default useIntersection;
