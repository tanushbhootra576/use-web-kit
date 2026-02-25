--------------------------------------------------
# use-web-kit
--------------------------------------------------

Lightweight, composable React hooks for common browser behaviors (polling, idle task queueing, intersection observation, network status, broadcast state, and page lifecycle).

![npm (scoped)](https://img.shields.io/npm/v/use-web-kit/0.1.0)
![license](https://img.shields.io/badge/license-MIT-green)
![bundlephobia-minzip](https://img.shields.io/bundlephobia/minzip/use-web-kit@0.1.0)
![react](https://img.shields.io/badge/react-18%2B-blue)

--------------------------------------------------
## Overview
--------------------------------------------------

`use-web-kit` provides a small collection of single-purpose React hooks that address common browser and application concerns with predictable, minimal APIs. Each hook focuses on a single responsibility, is fully compatible with React 18+, and is designed for composition (you can combine hooks without coupling their internals). The library intentionally avoids heavy abstractions, global singletons, or opinionated state machines: it exposes deterministic primitives you can integrate into applications, micro-frontends, or utilities.

Key goals:
- Precise, minimal APIs that map directly to browser capabilities.
- Safe defaults with sensible fallbacks for older browsers.
- Composition-first: hooks return primitives you can combine.

--------------------------------------------------
## Installation
--------------------------------------------------

Install from npm:

```bash
npm install use-web-kit@0.1.0
```

Or with yarn:

```bash
yarn add use-web-kit@0.1.0
```

Or with pnpm:

```bash
pnpm add use-web-kit@0.1.0
```

Requires React 18 or newer.

--------------------------------------------------
## Quick Start
--------------------------------------------------

The following example shows a complete React component that uses `useNetworkStatus` to render online/offline state and network metrics. It compiles under React 18+ and TypeScript.

```tsx
import React from 'react';
import { useNetworkStatus } from 'use-web-kit';

export default function NetworkBadge() {
  const { online, effectiveType, downlink, rtt } = useNetworkStatus();

  return (
    <div aria-live="polite">
      <strong>Status:</strong> {online ? 'online' : 'offline'}
      <div>
        <span>effectiveType: {effectiveType ?? 'unknown'}</span>
      </div>
      <div>
        <span>downlink: {downlink ?? 'n/a'}</span>
        <span style={{ marginLeft: 12 }}>rtt: {rtt ?? 'n/a'}</span>
      </div>
    </div>
  );
}
```

This component reads network status from the browser `navigator` APIs and updates reactively when connectivity or effective connection characteristics change.

--------------------------------------------------
## Hooks
--------------------------------------------------

Each hook below documents its purpose, TypeScript signature, parameters, returns, examples, edge cases, and best practices.

### useAdaptivePolling

Description:
Runs a callback on an interval that adapts to page visibility. Useful for polling APIs while avoiding unnecessary work when a page is backgrounded.

Signature:
```ts
export interface UseAdaptivePollingOptions {
  interval: number;
  enabled?: boolean;
  pauseOnBackground?: boolean;
  backgroundSlowdownFactor?: number;
}
export function useAdaptivePolling(
  callback: () => void,
  options: UseAdaptivePollingOptions,
): void;
```

Parameters:

| Name | Type | Default | Description |
|---|---|---:|---|
| `callback` | `() => void` | — | Function invoked on each poll tick. |
| `options.interval` | `number` | — | Required. Base interval in milliseconds. |
| `options.enabled` | `boolean` | `true` | Whether polling is active. |
| `options.pauseOnBackground` | `boolean` | `true` | If true, polling stops when `document.visibilityState === 'hidden'`. |
| `options.backgroundSlowdownFactor` | `number` | `5` | Multiplier used for interval when page is backgrounded and `pauseOnBackground` is `false`. |

Returns:

No return value. The hook manages timers internally.

Basic Example:

```tsx
import React, { useCallback } from 'react';
import { useAdaptivePolling } from 'use-web-kit';

function useServerSync() {
  const sync = useCallback(() => {
    // perform lightweight sync, fire-and-forget
    fetch('/api/sync').catch(() => {});
  }, []);

  useAdaptivePolling(sync, { interval: 30_000 });
}

export default function PollingComponent() {
  useServerSync();
  return <div>Background-aware polling enabled.</div>;
}
```

Advanced Example:

```tsx
useAdaptivePolling(fetchMetrics, {
  interval: 10_000,
  enabled: true,
  pauseOnBackground: false,
  backgroundSlowdownFactor: 10,
});
```

Edge Cases:
- In environments without `document` (SSR), the hook does nothing.
- If `pauseOnBackground` is `false`, the hook multiplies the interval during background to reduce CPU/network usage.

Best Practices:
- Keep the `callback` idempotent and resilient to concurrent invocations.
- Avoid heavy synchronous work on each tick; prefer async operations.

---

### useBroadcastState

Description:
Synchronize a piece of state across same-origin tabs/windows using the BroadcastChannel API. Useful for multi-tab coordination (e.g., feature flags, lightweight UI state).

Signature:

```ts
export function useBroadcastState<T>(
  channelName: string,
  initialValue: T
): [T, (value: T | ((prevState: T) => T)) => void];
```

Parameters:

| Name           | Type     | Default | Description                                            |
| -------------- | -------- | ------: | ------------------------------------------------------ |
| `channelName`  | `string` |       — | Channel identifier shared by all participants.         |
| `initialValue` | `T`      |       — | Initial value used before any broadcasts are received. |

Returns:

| Name     | Type    | Description                               |
| -------- | ------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| State    | `T`     | Local state synchronized with broadcasts. |
| setState | `(value | updater) => void`                         | Updates local state and broadcasts JSON-serialized value to the channel. |

Basic Example:

```tsx
import React from "react";
import { useBroadcastState } from "use-web-kit";

export default function SharedCounter() {
  const [count, setCount] = useBroadcastState<number>("shared-counter", 0);

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

Advanced Example:

```tsx
type Settings = { theme: "light" | "dark" };
const [settings, setSettings] = useBroadcastState<Settings>("app-settings", {
  theme: "light",
});
// update and broadcast
setSettings({ theme: "dark" });
```

Edge Cases:

- If `BroadcastChannel` is unavailable (older browsers), the hook is a no-op for cross-tab sync; local state still works.
- Messages are JSON-serialized; non-serializable values should be avoided.

Best Practices:

- Keep broadcast payloads small and serializable.
- Use stable channel names to avoid accidental collisions.

---

### useIdleQueue

Description:
Queue tasks to run during browser idle time using `requestIdleCallback` with a timeout and a `setTimeout` fallback. Useful for non-urgent background work (indexing, cache warming, analytics batching).

Signature:

```ts
export type IdleQueueTask = () => void | Promise<void>;
export interface UseIdleQueueOptions {
  timeout?: number;
  fallbackInterval?: number;
}
export interface UseIdleQueueReturn {
  enqueue: (task: IdleQueueTask) => void;
  clearQueue: () => void;
  queueLength: number;
}
export function useIdleQueue(options?: UseIdleQueueOptions): UseIdleQueueReturn;
```

Parameters:

| Name                       | Type     |     Default | Description                                                                |
| -------------------------- | -------- | ----------: | -------------------------------------------------------------------------- |
| `options.timeout`          | `number` | `undefined` | Timeout passed to `requestIdleCallback`.                                   |
| `options.fallbackInterval` | `number` |        `50` | Fallback polling interval in ms when `requestIdleCallback` is unavailable. |

Returns:

| Name          | Type                            | Description                                         |
| ------------- | ------------------------------- | --------------------------------------------------- |
| `enqueue`     | `(task: IdleQueueTask) => void` | Add a task to the queue.                            |
| `clearQueue`  | `() => void`                    | Remove queued tasks and cancel scheduled callbacks. |
| `queueLength` | `number`                        | Current number of queued tasks.                     |

Basic Example:

```tsx
import React from "react";
import { useIdleQueue } from "use-web-kit";

export default function BackgroundIndexer() {
  const { enqueue, queueLength } = useIdleQueue({ timeout: 2000 });

  function index(items: string[]) {
    items.forEach((item) =>
      enqueue(() => {
        // inexpensive background work
        localStorage.setItem(`idx:${item}`, JSON.stringify({ item }));
      })
    );
  }

  return <div>Pending tasks: {queueLength}</div>;
}
```

Edge Cases:

- `requestIdleCallback` is not available in all browsers; the hook falls back to `setTimeout`.

Best Practices:

- Keep queued tasks short and resilient to errors.
- Use `clearQueue` on unmount if tasks depend on component lifecycle.

---

### useIntersection

Description:
Provides a shared IntersectionObserver pool and returns a `ref` attach function plus latest entry and intersection state. Use for lazy-loading, telemetry, or visibility-driven work.

Signature:

```ts
type Options = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};
export function useIntersection(options?: Options): {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};
```

Parameters:

| Name                 | Type     |   Default | Description         |
| -------------------- | -------- | --------: | ------------------- | ------------------------------ |
| `options.root`       | `Element |     null` | `null`              | Root element for the observer. |
| `options.rootMargin` | `string` |      `""` | Root margin string. |
| `options.threshold`  | `number  | number[]` | `undefined`         | Intersection threshold(s).     |

Returns:

| Name             | Type                       | Description                                    |
| ---------------- | -------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `ref`            | `(node: Element            | null) => void`                                 | Attach this to an element to observe it. |
| `isIntersecting` | `boolean`                  | Whether the element is currently intersecting. |
| `entry`          | `IntersectionObserverEntry | undefined`                                     | Latest observer entry.                   |

Basic Example:

```tsx
import React from "react";
import { useIntersection } from "use-web-kit";

export default function LazyImage({ src, alt }: { src: string; alt: string }) {
  const { ref, isIntersecting } = useIntersection({ rootMargin: "200px" });

  return (
    <div ref={(el) => ref(el)} style={{ minHeight: 200 }}>
      {isIntersecting ? <img src={src} alt={alt} /> : <div>Placeholder</div>}
    </div>
  );
}
```

Advanced Example:

```tsx
const { ref, isIntersecting } = useIntersection({ threshold: [0, 0.5, 1] });
```

Edge Cases:

- If `IntersectionObserver` is unavailable, the hook is a no-op (element is not observed).

Best Practices:

- Use the `rootMargin` to trigger work earlier (e.g., prefetching images).
- Reuse observers via the hook's internal pool (no additional action required).

---

### useNetworkStatus

Description:
Expose online/offline state and the Network Information API values (when available): `effectiveType`, `downlink`, and `rtt`. Useful for adapting behavior based on connectivity.

Signature:

```ts
export type NetworkStatus = {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};
export function useNetworkStatus(): NetworkStatus;
```

Parameters:

This hook accepts no parameters.

Returns:

| Name            | Type      | Description                               |
| --------------- | --------- | ----------------------------------------- | --------------------------------------------------- |
| `online`        | `boolean` | `true` when `navigator.onLine` is `true`. |
| `effectiveType` | `string   | undefined`                                | Network effective type from `navigator.connection`. |
| `downlink`      | `number   | undefined`                                | Estimated downlink in Mbps.                         |
| `rtt`           | `number   | undefined`                                | Estimated round-trip time in ms.                    |

Basic Example: See Quick Start above.

Edge Cases:

- The Network Information API is not available in all browsers; the hook still provides `online` via `navigator.onLine` when available.

Best Practices:

- Use `online` as a boolean guard, and treat `effectiveType`, `downlink`, and `rtt` as advisory metrics.

---

### usePageLifecycle

Description:
Track page visibility, focus, and frozen state. Useful to pause expensive work and to coordinate behavior across focus/visibility boundaries.

Signature:

```ts
export type PageLifecycle = {
  visible: boolean;
  focused: boolean;
  frozen: boolean;
};
export function usePageLifecycle(): PageLifecycle;
```

Parameters:

This hook accepts no parameters.

Returns:

| Name      | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| `visible` | `boolean` | `true` when `document.visibilityState === 'visible'`. |
| `focused` | `boolean` | `true` if `window`/`document` reports focus.          |
| `frozen`  | `boolean` | `true` if the document is frozen (where supported).   |

Basic Example:

```tsx
import React from "react";
import { usePageLifecycle } from "use-web-kit";

export default function LifecycleDebugger() {
  const { visible, focused, frozen } = usePageLifecycle();

  return (
    <div>
      <div>visible: {String(visible)}</div>
      <div>focused: {String(focused)}</div>
      <div>frozen: {String(frozen)}</div>
    </div>
  );
}
```

Edge Cases:

- Not all browsers implement the `freeze` event; the hook handles missing support gracefully.

Best Practices:

- Combine with `useAdaptivePolling` to pause polling on background/freeze.

---

## Advanced Usage

---

Combining hooks is straightforward because each hook manages its own concern.

Adaptive polling + network status example:

```tsx
import React, { useCallback } from "react";
import { useAdaptivePolling, useNetworkStatus } from "use-web-kit";

export function MetricsPoller() {
  const { online } = useNetworkStatus();

  const fetchMetrics = useCallback(() => {
    if (!online) return;
    void fetch("/api/metrics").catch(() => {});
  }, [online]);

  useAdaptivePolling(fetchMetrics, {
    interval: 15_000,
    pauseOnBackground: true,
  });

  return <div>Polling metrics when online and visible.</div>;
}
```

Broadcast state + page lifecycle example:

```tsx
import React from "react";
import { useBroadcastState, usePageLifecycle } from "use-web-kit";

export function SharedUiState() {
  const [state, setState] = useBroadcastState("ui-state", {
    sidebarOpen: false,
  });
  const { visible } = usePageLifecycle();

  React.useEffect(() => {
    if (!visible) {
      // ensure UI is collapsed when leaving
      setState((s) => ({ ...s, sidebarOpen: false }));
    }
  }, [visible, setState]);

  return (
    <button
      onClick={() => setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }))}
    >
      Toggle
    </button>
  );
}
```

---

## API Design Principles

---

- Minimal APIs: each hook exposes only what is necessary for its responsibility to reduce cognitive load.
- No heavy abstractions: the library avoids global side effects and opinionated state machines so you can compose hooks freely.
- Composability: hooks return primitives (refs, booleans, functions) that can be combined to form higher-level behaviors in application code.

---

## Contributing

---

To open issues:

- Create an issue at: https://github.com/tanushbhootra576/use-web-kit/issues

To contribute code:

1. Fork the repository and create a topic branch from `main`.
2. Implement changes with small, focused commits.
3. Run tests and linters locally. (This repo uses TypeScript; ensure `tsc` passes.)
4. Submit a pull request with a clear description and linked issue if applicable.

Code style expectations:

- TypeScript with strict typing where appropriate.
- Keep APIs minimal and side-effect free.
- Add unit tests for behavior-critical logic when practical.

---

## License

---

MIT License

---

## Links

---

GitHub:
https://github.com/tanushbhootra576/use-web-kit

NPM:
https://www.npmjs.com/package/use-web-kit

Issue Tracker:
https://github.com/tanushbhootra576/use-web-kit/issues

## use-web-kit -

<img src="https://img.shields.io/npm/v/use-web-kit.svg" alt="npm version">
<img src="https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg" alt="Build Status">
<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
<img src="https://img.shields.io/badge/types-TypeScript-blue.svg" alt="Typescript">

A compact collection of zero-runtime-dependency, TypeScript-first React hooks for common browser interactions: idle work scheduling, cross-tab state, adaptive polling, network information, intersection observation, and page lifecycle.

This document provides installation, concise examples, API reference, SSR notes, testing guidance, contribution guidelines, and license information.

Package
Name: use-web-kit
Version: 0.1.0
Repository: https://github.com/tanushbhootra576/use-web-kit
Features
Zero runtime dependencies
Tree-shakeable named exports
TypeScript typings included
Graceful fallbacks for unsupported browser APIs
Small runtime surface and predictable cleanup behavior
Installation
Quick example
API Reference
All hooks are exported as named exports. Import only the hooks you need to keep bundles minimal.

Each hook section follows the same structure: Description, Signature, Parameters (when applicable), Return value, and Notes.

useIdleQueue
Description
Queue non-urgent tasks to run during browser idle time. Uses requestIdleCallback when available, otherwise a setTimeout fallback.

Signature

Parameters

Name Type Default Description
timeout number undefined Maximum wait time (ms) before forcing execution of queued tasks.
fallbackInterval number 50 Interval (ms) used by the setTimeout fallback.
Return value

enqueue(task) — enqueue a task to run during idle time.
clearQueue() — clear pending tasks.
queueLength — current number of queued tasks.
Notes

Intended for best-effort background work (analytics, cache writes).
The hook manages its own queue and cleans up on unmount.
useBroadcastState
Description
Synchronize a small JSON-serializable state across browser tabs/windows using the BroadcastChannel API, with a fallback to in-tab state when unavailable.

Signature

Parameters

Name Type Description
channelName string Unique name for the broadcast channel.
initialValue T Initial state value (must be JSON-serializable).
Return value

[state, setState] — React-style state tuple; setState accepts a value or an updater function.
Notes

Values must be structured-clone / JSON-serializable.
Falls back to local in-tab state when BroadcastChannel is not available.
The hook performs cleanup on unmount.
useAdaptivePolling
Description
Run a callback at a configurable interval. The hook can pause or slow polling when the page is backgrounded to conserve resources.

Signature

Parameters

Name Type Default Description
interval number — Polling interval in milliseconds (required).
enabled boolean true Enable or disable polling.
pauseOnBackground boolean true If true, polling is paused when the page is hidden. If false, interval is multiplied by backgroundSlowdownFactor.
backgroundSlowdownFactor number 5 Multiplier applied to interval when the page is backgrounded (if not paused).
Return value

void — the hook manages timers internally.
Notes

The hook listens to page visibility and adjusts polling behavior accordingly.
Provide a stable callback (e.g., wrapped with useCallback) to avoid unintended restarts.
Cleans up timers on unmount or when enabled is set to false.
useNetworkStatus
Description
Track navigator online status and, when available, Network Information API fields.

Signature

Return value

online: boolean — current navigator.onLine if available; defaults to true in non-browser contexts.
effectiveType?: string — navigator.connection.effectiveType when supported.
downlink?: number — navigator.connection.downlink in Mbps when supported.
rtt?: number — navigator.connection.rtt in ms when supported.
Notes
use-web-kit
<img src="https://img.shields.io/npm/v/use-web-kit.svg" alt="npm version">
<img src="https://github.com/tanushbhootra576/use-web-kit/actions/workflows/ci.yml/badge.svg" alt="Build Status">
<img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
<img src="https://img.shields.io/badge/types-TypeScript-blue.svg" alt="Typescript">

A compact collection of zero-runtime-dependency, TypeScript-first React hooks for common browser interactions: idle work scheduling, cross-tab state, adaptive polling, network information, intersection observation, and page lifecycle.

This document provides installation, concise examples, API reference, SSR notes, testing guidance, contribution guidelines, and license information.

## Package

- Name: use-web-kit
- Version: 0.1.0
- Repository: https://github.com/tanushbhootra576/use-web-kit

## Features

- Zero runtime dependencies
- Tree-shakeable named exports
- TypeScript typings included
- Graceful fallbacks for unsupported browser APIs
- Small runtime surface and predictable cleanup behavior

## Installation

## Quick example

## API Reference

All hooks are exported as named exports. Import only the hooks you need to keep bundles minimal.

Each hook section follows the same structure: Description, Signature, Parameters (when applicable), Return value, and Notes.

useIdleQueue
Description
Queue non-urgent tasks to run during browser idle time. Uses requestIdleCallback when available, otherwise a setTimeout fallback.

Signature

Parameters

Name Type Default Description
timeout number undefined Maximum wait time (ms) before forcing execution of queued tasks.
fallbackInterval number 50 Interval (ms) used by the setTimeout fallback.
Return value

enqueue(task) — enqueue a task to run during idle time.
clearQueue() — clear pending tasks.
queueLength — current number of queued tasks.
Notes

Intended for best-effort background work (analytics, cache writes).
The hook manages its own queue and cleans up on unmount.
useBroadcastState
Description
Synchronize a small JSON-serializable state across browser tabs/windows using the BroadcastChannel API, with a fallback to in-tab state when unavailable.

Signature

Parameters

Name Type Description
channelName string Unique name for the broadcast channel.
initialValue T Initial state value (must be JSON-serializable).
Return value

[state, setState] — React-style state tuple; setState accepts a value or an updater function.
Notes

Values must be structured-clone / JSON-serializable.
Falls back to local in-tab state when BroadcastChannel is not available.
The hook performs cleanup on unmount.
useAdaptivePolling
Description
Run a callback at a configurable interval. The hook can pause or slow polling when the page is backgrounded to conserve resources.

Signature

Parameters

Name Type Default Description
interval number — Polling interval in milliseconds (required).
enabled boolean true Enable or disable polling.
pauseOnBackground boolean true If true, polling is paused when the page is hidden. If false, interval is multiplied by backgroundSlowdownFactor.
backgroundSlowdownFactor number 5 Multiplier applied to interval when the page is backgrounded (if not paused).
Return value

void — the hook manages timers internally.
Notes

The hook listens to page visibility and adjusts polling behavior accordingly.
Provide a stable callback (e.g., wrapped with useCallback) to avoid unintended restarts.
Cleans up timers on unmount or when enabled is set to false.
useNetworkStatus
Description
Track navigator online status and, when available, Network Information API fields.

Signature

Return value

online: boolean — current navigator.onLine if available; defaults to true in non-browser contexts.
effectiveType?: string — navigator.connection.effectiveType when supported.
downlink?: number — navigator.connection.downlink in Mbps when supported.
rtt?: number — navigator.connection.rtt in ms when supported.
Notes

Listens to online/offline events and navigator.connection change events when available.
Graceful fallback when the Network Information API is not supported.
SSR-safe: does not access window/navigator during server render and returns safe defaults.
useIntersection
Description
Observe element visibility using a pooled IntersectionObserver implementation to reduce the number of observers created for identical options.

Signature

Parameters

Name Type Default Description
root `Element	null` null
rootMargin string undefined Root margin string.
threshold number | number[] undefined Threshold(s) for intersection ratio.
Return value

ref(node) — assignable ref callback for the observed element.
isIntersecting: boolean — whether the element is currently intersecting.
entry?: IntersectionObserverEntry — most recent entry when available.
Notes

Uses observer pooling: hooks created with identical options share an IntersectionObserver instance.
SSR fallback: returns isIntersecting = false and entry = undefined when IntersectionObserver is not present.
Observers and internal callbacks are cleaned up on unmount or when ref changes.
usePageLifecycle
Description
Track page visibility, window focus, and freeze state where supported.

Signature

Return value

visible: boolean — whether document.visibilityState === 'visible'.
focused: boolean — result of document.hasFocus() when available.
frozen: boolean — reflects freeze/pagehide state when supported.
Notes

Listens to visibilitychange, focus, blur, freeze, and pagehide events where supported and removes listeners on unmount.
SSR-safe: returns defaults when document/window are not available.
SSR compatibility

All hooks perform runtime checks before accessing browser globals. On the server:

- No event listeners, observers, or timers are created.
- Hooks return safe defaults (booleans, undefined for optional fields).
- Example: useNetworkStatus returns an online boolean (default true) when navigator is not available.
- This minimizes differences between server and client renders while avoiding server-side side effects.

Bundle size and tree-shaking

Hooks are exported as named exports to enable tree-shaking by modern bundlers; import only the hooks you use to minimize bundle size.
The library focuses on a small runtime surface; actual bundle size depends on the consumer's bundler and minification settings.

Testing

- Unit tests use Jest with the jsdom environment.
- Browser APIs are mocked where needed (e.g., navigator.connection, IntersectionObserver, document.visibilityState) to verify behavior and cleanup.
- Tests validate event registration and teardown to prevent leaks across mounts/unmounts.

Contributing

- Open an issue to discuss API changes or major work before implementing breaking changes.
- Add unit tests for new features and for listener/observer cleanup.
- Keep runtime dependencies to zero; dev-dependencies for testing/building are acceptable.
- Follow the existing TypeScript configuration and coding style.
- Create a pull request against main with a clear description and test coverage for changes.

### Developed by Tanush Bhootra ✨
