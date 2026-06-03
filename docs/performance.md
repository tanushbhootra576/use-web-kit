# Performance Architecture

`use-web-kit` is engineered strictly around a **zero-cost abstraction** philosophy.

## The Global Singleton Pattern

In traditional React components, using an `IntersectionObserver` looks like this:

\`\`\`tsx
useEffect(() => {
  const observer = new IntersectionObserver(cb);
  observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
\`\`\`

If you render 1,000 items in a list, you instantiate 1,000 separate observers. This destroys memory overhead.

`useSmartIntersection` registers all 1,000 elements to a **single** module-level observer. Memory complexity is O(1). When the final component unmounts, the global observer gracefully destroys itself.

## RAF Batching

Scroll events, resize events, and observer triggers can fire 60 to 120 times per second. `use-web-kit` queues all state updates triggered by these events and flushes them inside a single `requestAnimationFrame` (RAF).

This prevents React from attempting to reconcile the virtual DOM multiple times within a single visual frame, ensuring perfectly smooth scrolling and animations.

## Web Worker Pooling

`useWorkerPool` does not spawn a new worker per request. Instead, it queries `navigator.hardwareConcurrency` and instantiates a fixed-size pool of workers (usually CPU threads - 1).

Incoming tasks are distributed using a round-robin algorithm. Once all tasks complete, the workers are kept alive for a short debounce period to handle subsequent tasks quickly, then terminated to clear memory.
