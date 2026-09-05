# use-web-kit

[![NPM Version](https://img.shields.io/npm/v/use-web-kit.svg)](https://www.npmjs.com/package/use-web-kit)
[![CI Status](https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/tanushbhootra576/use-web-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://www.typescriptlang.org/)

A zero-cost performance toolkit for React 19.

Provides a suite of production-ready hooks that bypass standard React render cascades by leveraging global singletons, RAF-batched state updates, and React 19 native ref cleanups. Built for engineering teams that require perfect 60fps performance and exact SSR hydration matching without the bloat of external dependencies.

---

## Installation

```bash
npm install use-web-kit
```

---

## Architecture

Traditional React hook libraries often introduce significant overhead by instantiating new browser APIs (like `IntersectionObserver` or `Worker`) for every component instance. `use-web-kit` solves this using a zero-cost abstraction model:

1. **Global Singletons**: Hooks like `useSmartIntersection` and `useSharedWorkerPool` share a single module-level instance. Observing 1,000 DOM nodes incurs the exact same memory footprint as observing 1.
2. **RAF-Batched Updates**: Rapidly firing events (scroll, resize, mutations) are coalesced and dispatched within a single `requestAnimationFrame` cycle, ensuring React reconciliation happens exactly once per frame.
3. **Strict SSR Hydration**: Browser API integrations utilize `useSyncExternalStore` internally to guarantee perfect matching between server-rendered HTML and the initial client pass.

---

## Core API (20 Hooks)

The toolkit is divided into five architectural domains:

### ⚡ DOM Engine
- **`useElementDimensions`** 🆕: O(1) DOM measurement via a module-level `ResizeObserver` singleton.
- **`useIntentObserver`** 🆕: Predictive hover/click pre-fetching using global mouse velocity vectors.
- **`useSmartIntersection`**: Zero-overhead intersection observation via global singletons.
- **`useIntersection`**: Traditional per-instance observer pool for custom root margins.
- **`useMediaControls`**: Abstracted `<audio>`/`<video>` element state without event listener bloat.

### 🧠 Concurrency Engine
- **`useChunkedTask`** 🆕: Process massive datasets without blocking the main thread using `scheduler.yield`.
- **`useSharedWorkerPool`** 🆕: Enterprise multi-tab sync and offloading via a single global `SharedWorker`.
- **`useWorkerPool`**: Thread-pool abstraction over Web Workers that dynamically scales.
- **`useIdleQueue`**: Defer non-critical analytics and cache writes to `requestIdleCallback`.
- **`useAdaptivePolling`**: Polling intervals that dynamically slow down on poor connections or hidden tabs.

### 💾 State Synchronization
- **`useHeavyStorage`** 🆕: Asynchronously store GBs of data using the modern Origin Private File System (OPFS).
- **`useDebouncedStorage`**: SSR-safe `localStorage` wrapper with integrated debounce and cross-tab sync.
- **`useStorage`**: Basic synchronous Web Storage persistence with cross-tab sync.
- **`useBroadcastState`**: O(1) cross-tab state synchronization that bypasses React Context.

### 🌐 Network & BOM
- **`useAdaptivePerformance`** 🆕: Dynamically categorizes devices (high/medium/low) based on CPU cores, RAM, and network conditions for graceful degradation.
- **`useNetworkStatus`**: Comprehensive network connection monitoring (RTT, downlink, effective type).
- **`usePageLifecycle`**: Hook into visibility state and page freeze events.
- **`usePermission`**: Query and watch Web Permissions API state with legacy fallbacks.

### 🔄 Action Pipelines
- **`useEventPipeline`**: Compose asynchronous event handlers with built-in retry and rollback logic.
- **`useActionPipeline`**: FormData processing for React 19 `<form action>` and Server Actions.

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

## Features

- **Zero runtime dependencies**
- **Tree-shakeable named exports** — import only what you use
- **Strict TypeScript typings** included
- **SSR-safe** — all hooks perfectly guard `window` / `navigator` access
- **Graceful fallbacks** for unsupported modern browser APIs (`scheduler.yield`, OPFS, etc.)

---

## Testing

All hooks are thoroughly tested with [Jest](https://jestjs.io/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/).

```bash
npm test            # run all tests once
npm test -- --watch # watch mode
```

---

## License

[MIT](LICENSE) - Engineered for modern web applications.
