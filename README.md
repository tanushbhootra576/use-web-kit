# use-web-kit


[![NPM Version](https://img.shields.io/npm/v/use-web-kit.svg)](https://www.npmjs.com/package/use-web-kit)
[![CI Status](https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/tanushbhootra576/use-web-kit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A zero-cost performance toolkit for React 19.

Provides a suite of production-ready hooks that bypass standard React render cascades by leveraging global singletons, RAF-batched state updates, and React 19 native ref cleanups. Built for engineering teams that require perfect 60fps performance and exact SSR hydration matching without the bloat of external dependencies.
=======
<img src="https://img.shields.io/npm/v/use-web-kit.svg" alt="npm version">
<img src="https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg" alt="Build Status">
<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
<img src="https://img.shields.io/badge/types-TypeScript-blue.svg" alt="TypeScript">

A compact collection of **zero-runtime-dependency**, TypeScript-first React hooks for common browser interactions.

---

## Installation

```bash
npm install use-web-kit
```

## Quick Example

```tsx
import { useStorage, usePermission, useMediaControls } from "use-web-kit";

function App() {
  const [theme, setTheme] = useStorage("theme", "light");
  const { state: camState } = usePermission("camera");
  const { ref, state, controls } = useMediaControls();

  return (
    <>
      <button
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      >
        Theme: {theme}
      </button>
      <p>Camera permission: {camState}</p>
      <video ref={ref} src="/clip.mp4" />
      <button onClick={state.paused ? controls.play : controls.pause}>
        {state.paused ? "Play" : "Pause"}
      </button>
    </>
  );
}
```

---

## Hooks

### Utility

| Hook                 | Description                                                   | Docs                                                  |
| -------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `useIdleQueue`       | Schedule non-critical tasks during browser idle time          | [API →](docs/api-utility-hooks.md#useidlequeue)       |
| `useBroadcastState`  | Sync state across browser tabs via `BroadcastChannel`         | [API →](docs/api-utility-hooks.md#usebroadcaststate)  |
| `useAdaptivePolling` | Run a callback at an interval; slows/pauses when backgrounded | [API →](docs/api-utility-hooks.md#useadaptivepolling) |
| `useNetworkStatus`   | Reactive `navigator.onLine` + Network Information API         | [API →](docs/api-utility-hooks.md#usenetworkstatus)   |
| `useIntersection`    | Pooled `IntersectionObserver` with a ref-callback interface   | [API →](docs/api-utility-hooks.md#useintersection)    |
| `usePageLifecycle`   | Track page visibility, focus, and freeze state                | [API →](docs/api-utility-hooks.md#usepagelifecycle)   |

### Browser API

| Hook               | Description                                                  | Docs                                                |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| `useStorage`       | `localStorage` / `sessionStorage` with cross-tab sync        | [API →](docs/api-browser-hooks.md#usestorage)       |
| `usePermission`    | Query and watch Web Permissions API state                    | [API →](docs/api-browser-hooks.md#usepermission)    |
| `useMediaControls` | Attach to `<audio>`/`<video>` with reactive state + controls | [API →](docs/api-browser-hooks.md#usemediacontrols) |

Full API reference:

- [Utility Hooks](docs/api-utility-hooks.md)
- [Browser API Hooks](docs/api-browser-hooks.md)

---

## Features

- Zero runtime dependencies
- Tree-shakeable named exports — import only what you use
- Strict TypeScript typings included
- SSR-safe — all hooks guard `window` / `navigator` access
- Graceful fallbacks for unsupported browser APIs

---

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
=======
## SSR Compatibility

Every hook tests for `window`, `navigator`, and the relevant API before accessing it. In a server render:

- `useStorage` returns `initialValue`
- `usePermission` returns `{ state: "unavailable", loading: false }`
- `useNetworkStatus` returns `{ online: true }`
- `useIntersection` returns `{ isIntersecting: false, entry: undefined }`
- `usePageLifecycle` returns `{ visible: false, focused: false, frozen: false }`
- `useMediaControls` returns default state with a no-op ref

---

## Bundle / Tree-shaking

All hooks are named exports at the package root:

```ts
import { useIdleQueue } from "use-web-kit"; // only useIdleQueue bundled
import { useStorage, usePermission } from "use-web-kit"; // two hooks bundled
```

The package ships both ESM (`dist/index.mjs`) and CJS (`dist/index.js`) builds via `tsup`.

---

## Testing

```bash
npm test            # run all tests once
npm test -- --watch # watch mode
```

All hooks are thoroughly tested with [Jest](https://jestjs.io/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/).

---

## Contributing

1. Fork the repo and create a feature branch.
2. `npm install` to set up dependencies.
3. Write tests alongside your changes.
4. Ensure `npm test` passes with no failures.
5. Open a pull request with a clear description.

---

## License

[MIT](LICENSE)

