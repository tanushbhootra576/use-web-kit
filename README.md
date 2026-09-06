# use-web-kit

[![NPM Version](https://img.shields.io/npm/v/use-web-kit.svg)](https://www.npmjs.com/package/use-web-kit)
[![CI Status](https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/tanushbhootra576/use-web-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)

A zero-dependency performance toolkit for React 19 and Next.js 15.

Provides a suite of 26+ production-ready hooks that bypass standard React render cascades by leveraging **global singletons**, **RAF-batched state updates**, and **React 19 native ref cleanups**. Built for engineering teams that require perfect 60fps performance and exact SSR hydration matching without the bloat of external dependencies.

---

## Installation

```bash
npm install use-web-kit
```

---

## Why use-web-kit?

Traditional React hook libraries often introduce significant overhead by instantiating new browser APIs (like `IntersectionObserver` or `Worker`) for every component instance. `use-web-kit` solves this using a zero-cost abstraction model:

1. **Global Singletons**: Hooks like `useSmartIntersection` and `useSharedWorkerPool` share a single module-level instance. Observing 1,000 DOM nodes incurs the exact same memory footprint as observing 1.
2. **RAF-Batched Updates**: Rapidly firing events (scroll, resize, mutations) are coalesced and dispatched within a single `requestAnimationFrame` cycle, ensuring React reconciliation happens exactly once per frame.
3. **Strict SSR Hydration**: Browser API integrations utilize `useSyncExternalStore` internally to guarantee perfect matching between server-rendered HTML and the initial client pass.

---

## 5 Engines, 26+ Hooks

The toolkit is divided into five architectural domains:

### ⚡ DOM Engine
- **`useElementDimensions`** — O(1) DOM measurement via a module-level `ResizeObserver` singleton.
- **`useSmartIntersection`** — Zero-overhead intersection observation via global singletons.
- **`useIntersection`** — Traditional per-instance observer pool for custom root margins.
- **`useIntentObserver`** — Predictive hover/click pre-fetching using global mouse velocity vectors.
- **`useScrollProgress`** — React 19 ref callback pattern, RAF synced scroll tracking.
- **`useInfiniteScroll`** — Built on the existing O(1) IntersectionObserver singleton.
- **`useMediaControls`** — Abstracted `<audio>`/`<video>` element state without event listener bloat.
- **`useViewTransition`** — Native View Transitions API wrapper with graceful fallback.
- **`useLockBodyScroll`** — Ref-counted scroll lock for modals.
- **`useWindowSize`** — Singleton window size listener, SSR safe.

### 🧠 Concurrency Engine
- **`useChunkedTask`** — Process massive datasets without blocking the main thread using `scheduler.yield`.
- **`useWorkerPool`** — Thread-pool abstraction over Web Workers that dynamically scales.
- **`useSharedWorkerPool`** — Enterprise multi-tab sync and offloading via a single global `SharedWorker`.
- **`useIdleQueue`** — Defer non-critical analytics and cache writes to `requestIdleCallback`.
- **`useAdaptivePolling`** — Polling intervals that dynamically slow down on poor connections or hidden tabs.
- **`useAIStream`** — ReadableStream LLM consumer with SSE, abort, useReducer state.

### 💾 State Synchronization
- **`useHeavyStorage`** — Asynchronously store GBs of data using the modern Origin Private File System (OPFS).
- **`useDebouncedStorage`** — SSR-safe `localStorage` wrapper with integrated debounce and cross-tab sync.
- **`useStorage`** — Synchronous Web Storage persistence with cross-tab sync.
- **`useBroadcastState`** — O(1) cross-tab state synchronization that bypasses React Context.
- **`useOptimisticQueue`** — Optimistic mutations with auto-rollback on server error.

### 🌐 Network & BOM
- **`useNetworkStatus`** — Comprehensive network connection monitoring (RTT, downlink, effective type).
- **`usePageLifecycle`** — Hook into visibility state and page freeze events.
- **`usePermission`** — Query and watch Web Permissions API state with legacy fallbacks.
- **`useAdaptivePerformance`** — Dynamically categorizes devices (high/medium/low) based on CPU cores, RAM, and network conditions for graceful degradation.
- **`useClipboard`** — SSR safe clipboard reader/writer with timeout reset.
- **`useKeyboardShortcut`** — ONE shared keydown listener, parses cmd+k, ctrl+shift+p.

### 🔄 Pipelines & Utilities
- **`useEventPipeline`** — Compose asynchronous event handlers with built-in retry and rollback logic.
- **`useActionPipeline`** — FormData processing for React 19 `<form action>` and Server Actions.
- **`useDebounce`** — SSR-safe debounced state and callback generation.
- **`useThrottle`** — SSR-safe throttled state and callback generation.

---

## Quick Example

```tsx
import { useAdaptivePerformance, useChunkedTask, useSharedWorkerPool } from "use-web-kit";

function App() {
  const { tier } = useAdaptivePerformance();
  const { run, state } = useChunkedTask();
  const { broadcast } = useSharedWorkerPool({ workerUrl: '/sync.js' });

  const processData = () => {
    run(massiveArray, (item) => computeHeavyMetrics(item));
    broadcast({ type: 'SYNC_STARTED' });
  };

  if (tier === 'low') {
    return <div>Your device is in power-saving mode. Showing basic view.</div>;
  }

  return (
    <div>
      <button onClick={processData}>Run Analysis</button>
      {state.isRunning && <p>Processing... {Math.round(state.progress * 100)}%</p>}
    </div>
  );
}
```

---

## License

[MIT](LICENSE) - Engineered for modern web applications.