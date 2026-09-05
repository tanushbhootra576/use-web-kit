import { useCallback, useRef } from "react";

type IntentCallback = () => void;

interface ElementData {
  callback: IntentCallback;
  rect: DOMRectReadOnly | null;
  triggered: boolean;
}

const elementsData = new WeakMap<Element, ElementData>();
const visibleElements = new Set<Element>();

// Singleton IntersectionObserver to cache bounding rects for visible elements ONLY
let intersectionObserver: IntersectionObserver | null = null;
let intentObserverCount = 0;

function getIntersectionObserver() {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return null;
  if (!intersectionObserver) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const data = elementsData.get(entry.target);
          if (!data) continue;
          
          if (entry.isIntersecting) {
            data.rect = entry.boundingClientRect;
            visibleElements.add(entry.target);
          } else {
            data.rect = null;
            visibleElements.delete(entry.target);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0 } // Just entering the screen
    );
  }
  return intersectionObserver;
}

let isMouseListening = false;
let mouseX = 0;
let mouseY = 0;
let mouseVX = 0;
let mouseVY = 0;
let lastTime = 0;

// Config
const VELOCITY_THRESHOLD = 0.5; // pixels per ms
const DISTANCE_THRESHOLD = 200; // start predicting if within 200px
const PREDICTION_MS = 150; // predict where mouse will be in 150ms

function handleMouseMove(e: MouseEvent) {
  const now = performance.now();
  const dt = now - lastTime;
  
  if (dt > 0) {
    mouseVX = (e.clientX - mouseX) / dt;
    mouseVY = (e.clientY - mouseY) / dt;
  }
  
  mouseX = e.clientX;
  mouseY = e.clientY;
  lastTime = now;

  // Only check if moving fast enough
  const speed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
  if (speed < VELOCITY_THRESHOLD) return;

  // Predict future position
  const futureX = mouseX + mouseVX * PREDICTION_MS;
  const futureY = mouseY + mouseVY * PREDICTION_MS;

  // Check visible elements against predicted ray
  for (const el of visibleElements) {
    const data = elementsData.get(el);
    if (!data || data.triggered || !data.rect) continue;

    const r = data.rect;
    
    // Quick bounding box check: is future point near the element?
    // Expand rect by DISTANCE_THRESHOLD
    if (
      futureX >= r.left - DISTANCE_THRESHOLD &&
      futureX <= r.right + DISTANCE_THRESHOLD &&
      futureY >= r.top - DISTANCE_THRESHOLD &&
      futureY <= r.bottom + DISTANCE_THRESHOLD
    ) {
      // Intent detected!
      data.triggered = true;
      data.callback();
      
      // Optionally stop tracking this element if it's a one-off prefetch
      // But we let the component decide if it wants to unmount/unregister.
    }
  }
}

function attachGlobalMouse() {
  if (typeof window === "undefined") return;
  if (!isMouseListening) {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    isMouseListening = true;
  }
}

function detachGlobalMouse() {
  if (isMouseListening && visibleElements.size === 0) {
    window.removeEventListener("mousemove", handleMouseMove);
    isMouseListening = false;
  }
}

export interface UseIntentObserverOptions {
  onIntent: IntentCallback;
  /**
   * If true, the callback will only fire once until the element is remounted.
   * @default true
   */
  once?: boolean;
}

/**
 * Tracks mouse trajectory and velocity to predict when a user is about to hover
 * or click on a target element, firing an intent callback ~150ms early.
 * Uses a singleton IntersectionObserver to cache bounding rects, avoiding O(N) DOM reads.
 */
export function useIntentObserver({ onIntent, once = true }: UseIntentObserverOptions) {
  const onIntentRef = useRef(onIntent);
  onIntentRef.current = onIntent;

  const detach = useCallback((node: Element) => {
    const data = elementsData.get(node);
    if (data) {
      visibleElements.delete(node);
      elementsData.delete(node);
      const observer = getIntersectionObserver();
      if (observer) {
        try { observer.unobserve(node); } catch { /* ignore */ }
        intentObserverCount--;
        if (intentObserverCount === 0) {
          observer.disconnect();
          intersectionObserver = null;
        }
      }
      detachGlobalMouse();
    }
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      if (!node) return;
      if (typeof window === "undefined") return;

      const observer = getIntersectionObserver();
      if (!observer) return;

      elementsData.set(node, {
        callback: () => {
          onIntentRef.current();
          if (once) {
            const d = elementsData.get(node);
            if (d) d.triggered = true;
          }
        },
        rect: null,
        triggered: false,
      });

      observer.observe(node);
      intentObserverCount++;
      attachGlobalMouse();

      return () => {
        detach(node);
      };
    },
    [detach, once]
  );

  return { ref };
}
