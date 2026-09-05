import { useCallback, useEffect, useRef, useState } from "react";

export type ElementDimensions = {
  width: number;
  height: number;
  x: number;
  y: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// Singleton ResizeObserver
let resizeObserver: ResizeObserver | null = null;
const elementCallbacks = new WeakMap<Element, Set<(rect: ElementDimensions) => void>>();
let observedCount = 0;

function getResizeObserver() {
  if (typeof window === "undefined") return null;
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callbacks = elementCallbacks.get(entry.target);
        if (callbacks) {
          const rect = entry.contentRect;
          const dimensions: ElementDimensions = {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          };
          callbacks.forEach((cb) => cb(dimensions));
        }
      }
    });
  }
  return resizeObserver;
}

export function useElementDimensions() {
  const [dimensions, setDimensions] = useState<ElementDimensions | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const cbRef = useRef<((rect: ElementDimensions) => void) | null>(null);

  const detach = useCallback((node: Element, cb: (rect: ElementDimensions) => void) => {
    const callbacks = elementCallbacks.get(node);
    if (callbacks) {
      callbacks.delete(cb);
      if (callbacks.size === 0) {
        elementCallbacks.delete(node);
        const observer = getResizeObserver();
        if (observer) {
          try {
            observer.unobserve(node);
            observedCount--;
            if (observedCount === 0) {
              observer.disconnect();
              resizeObserver = null;
            }
          } catch {
            // Node might already be unobserved or detached
          }
        }
      }
    }
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      const prevNode = nodeRef.current;
      const prevCb = cbRef.current;

      if (prevNode && prevCb) {
        detach(prevNode, prevCb);
      }

      nodeRef.current = node;

      if (!node) return;
      if (typeof window === "undefined" || typeof ResizeObserver === "undefined") return;

      const observer = getResizeObserver();
      if (!observer) return;

      let callbacks = elementCallbacks.get(node);
      if (!callbacks) {
        callbacks = new Set();
        elementCallbacks.set(node, callbacks);
        observer.observe(node);
        observedCount++;
      }

      const cb = (rect: ElementDimensions) => {
        setDimensions((prev) => {
          if (
            prev &&
            prev.width === rect.width &&
            prev.height === rect.height &&
            prev.x === rect.x &&
            prev.y === rect.y
          ) {
            return prev;
          }
          return rect;
        });
      };

      cbRef.current = cb;
      callbacks.add(cb);

      // React 19 Cleanup
      return () => {
        detach(node, cb);
      };
    },
    [detach]
  );

  // Fallback for unmount if React 18 style
  useEffect(() => {
    return () => {
      const node = nodeRef.current;
      const cb = cbRef.current;
      if (node && cb) detach(node, cb);
    };
  }, [detach]);

  return { ref, dimensions };
}
