# use-web-kit

[![NPM Version](https://img.shields.io/npm/v/use-web-kit.svg)](https://www.npmjs.com/package/use-web-kit)
[![CI Status](https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/tanushbhootra576/use-web-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A zero-cost performance toolkit for React 19.

Provides a suite of production-ready hooks that bypass standard React render cascades by leveraging global singletons, RAF-batched state updates, and React 19 native ref cleanups. Built for engineering teams that require perfect 60fps performance and exact SSR hydration matching without the bloat of external dependencies.

## Installation

\`\`\`bash
npm install use-web-kit
\`\`\`

## Architecture

Traditional React hook libraries often introduce significant overhead by instantiating new browser APIs (like `IntersectionObserver` or `Worker`) for every component instance. `use-web-kit` solves this using a zero-cost abstraction model:

1. **Global Singletons**: Hooks like `useSmartIntersection` and `useWorkerPool` share a single module-level instance. Observing 1,000 DOM nodes incurs the exact same memory footprint as observing 1.
2. **RAF-Batched Updates**: Rapidly firing events (scroll, resize, mutations) are coalesced and dispatched within a single `requestAnimationFrame` cycle, ensuring React reconciliation happens exactly once per frame.
3. **Strict SSR Hydration**: Browser API integrations utilize `useSyncExternalStore` internally to guarantee perfect matching between server-rendered HTML and the initial client pass.

## Core API

The toolkit is divided into five architectural domains:

### DOM Engine
- **`useSmartIntersection`**: Zero-overhead intersection observation via global singletons.
- **`usePageLifecycle`**: Hook into visibility state and page freeze events.

### Concurrency Engine
- **`useWorkerPool`**: Thread-pool abstraction over Web Workers that dynamically scales to `navigator.hardwareConcurrency`.
- **`useIdleQueue`**: Defer non-critical analytics and cache writes to `requestIdleCallback`.

### State Synchronization
- **`useBroadcastState`**: O(1) cross-tab state synchronization that bypasses React Context.
- **`useDebouncedStorage`**: SSR-safe `localStorage` wrapper with integrated debounce and cross-tab sync.

### Network & BOM
- **`useNetworkStatus`**: Comprehensive network connection monitoring (RTT, downlink, effective type).
- **`useAdaptivePolling`**: Polling intervals that dynamically slow down on poor connections or hidden tabs.
- **`useMediaControls`**: Abstracted media element state without native DOM event listener bloat.

### Action Pipelines
- **`useEventPipeline`**: Compose asynchronous event handlers with built-in retry and rollback logic.

## Skills Kit Integration

`use-web-kit` goes beyond standard NPM packages by scaffolding its architectural best practices directly into your repository.

\`\`\`bash
npx use-web-kit init
\`\`\`

This command generates a `skills/` directory containing copy-paste ready recipes, performance guidelines, and optimized prompts for AI coding assistants.

## Requirements

- **React**: >= 19.0.0
- **TypeScript**: >= 5.0

## License

MIT License. Engineered for modern web applications.
