# API Reference — Utility Hooks

These hooks cover general-purpose browser interactions: background task scheduling, cross-tab state, adaptive polling, network status, element intersection, and page lifecycle.

> **Back to** [README](../README.md) | [Browser API Hooks →](./api-browser-hooks.md)

---

## Table of Contents

- [useIdleQueue](#useidlequeue)
- [useBroadcastState](#usebroadcaststate)
- [useAdaptivePolling](#useadaptivepolling)
- [useNetworkStatus](#usenetworkstatus)
- [useIntersection](#useintersection)
- [usePageLifecycle](#usepagelifecycle)

---

## useIdleQueue

Queue non-urgent tasks to run during browser idle time. Uses `requestIdleCallback` when available, with a `setTimeout` fallback.

### Signature

```ts
useIdleQueue(options?: {
  timeout?: number;
  fallbackInterval?: number;
}): {
  enqueue:     (task: () => void) => void;
  clearQueue:  () => void;
  queueLength: number;
}
```

### Parameters

| Name               | Type     | Default     | Description                                              |
| ------------------ | -------- | ----------- | -------------------------------------------------------- |
| `timeout`          | `number` | `undefined` | Max wait time (ms) before forcing task execution.        |
| `fallbackInterval` | `number` | `50`        | Polling interval (ms) used by the `setTimeout` fallback. |

### Return Value

| Key           | Type                         | Description                         |
| ------------- | ---------------------------- | ----------------------------------- |
| `enqueue`     | `(task: () => void) => void` | Add a task to run during idle time. |
| `clearQueue`  | `() => void`                 | Discard all pending tasks.          |
| `queueLength` | `number`                     | Current number of queued tasks.     |

### Notes

- Intended for best-effort background work (analytics, cache writes, prefetch).
- The hook manages its own queue internally and cleans up on unmount.

---

## useBroadcastState

Synchronize a small JSON-serialisable state value across browser tabs/windows using the `BroadcastChannel` API. Falls back to local in-tab state when the API is unavailable.

### Signature

```ts
useBroadcastState<T>(
  channelName: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>]
```

### Parameters

| Name           | Type     | Description                                |
| -------------- | -------- | ------------------------------------------ |
| `channelName`  | `string` | Unique broadcast channel name.             |
| `initialValue` | `T`      | Initial value (must be JSON-serialisable). |

### Return Value

`[state, setState]` — identical signature to `useState`; `setState` accepts a value or an updater function.

### Notes

- State values must be structured-clone / JSON-serialisable.
- Falls back to local in-tab state when `BroadcastChannel` is unavailable.
- Listeners are cleaned up on unmount.

---

## useAdaptivePolling

Run a callback at a configurable interval. Automatically pauses or reduces frequency when the page is hidden (background tab).

### Signature

```ts
useAdaptivePolling(
  callback: () => void,
  options?: {
    interval?:                 number;
    enabled?:                  boolean;
    pauseOnBackground?:        boolean;
    backgroundSlowdownFactor?: number;
  }
): void
```

### Parameters

| Name                       | Type      | Default | Description                                                                                     |
| -------------------------- | --------- | ------- | ----------------------------------------------------------------------------------------------- |
| `interval`                 | `number`  | —       | Polling interval in milliseconds **(required)**.                                                |
| `enabled`                  | `boolean` | `true`  | Enable or disable polling.                                                                      |
| `pauseOnBackground`        | `boolean` | `true`  | Pause completely when the page is hidden. If `false`, multiplies by `backgroundSlowdownFactor`. |
| `backgroundSlowdownFactor` | `number`  | `5`     | Interval multiplier applied when the page is backgrounded (only when not paused).               |

### Notes

- Wrap `callback` in `useCallback` to avoid unintended restarts on re-renders.
- Timers are cleaned up on unmount or when `enabled` becomes `false`.

---

## useNetworkStatus

Track `navigator.onLine` and, where supported, detailed Network Information API fields.

### Signature

```ts
useNetworkStatus(): {
  online:          boolean;
  effectiveType?:  string;
  downlink?:       number;
  rtt?:            number;
}
```

### Return Value

| Key             | Type                  | Description                                                     |
| --------------- | --------------------- | --------------------------------------------------------------- |
| `online`        | `boolean`             | `navigator.onLine`; defaults to `true` in non-browser contexts. |
| `effectiveType` | `string \| undefined` | `navigator.connection.effectiveType` when supported.            |
| `downlink`      | `number \| undefined` | Estimated bandwidth in Mbps when supported.                     |
| `rtt`           | `number \| undefined` | Round-trip time in ms when supported.                           |

### Notes

- Listens to `online` / `offline` window events and `navigator.connection` change events.
- SSR-safe: returns `{ online: true }` when `navigator` is undefined.

---

## useIntersection

Observe an element's visibility using a pooled `IntersectionObserver`. Hooks with identical options share a single observer instance to minimise overhead.

### Signature

```ts
useIntersection(options?: IntersectionObserverInit): {
  ref:            (node: Element | null) => void;
  isIntersecting: boolean;
  entry?:         IntersectionObserverEntry;
}
```

### Parameters (`IntersectionObserverInit`)

| Name         | Type                 | Default     | Description                      |
| ------------ | -------------------- | ----------- | -------------------------------- |
| `root`       | `Element \| null`    | `null`      | Root element for intersection.   |
| `rootMargin` | `string`             | `undefined` | CSS margin around the root.      |
| `threshold`  | `number \| number[]` | `undefined` | Intersection ratio threshold(s). |

### Return Value

| Key              | Type                                     | Description                                        |
| ---------------- | ---------------------------------------- | -------------------------------------------------- |
| `ref`            | `(node: Element \| null) => void`        | Attach to the element you want to observe.         |
| `isIntersecting` | `boolean`                                | `true` when the element is currently intersecting. |
| `entry`          | `IntersectionObserverEntry \| undefined` | Most recent `IntersectionObserverEntry`.           |

### Notes

- Hooks with identical options share one `IntersectionObserver` instance.
- SSR fallback: `isIntersecting = false`, `entry = undefined`.
- The observer is disconnected on unmount or when the ref target changes.

---

## usePageLifecycle

Track page visibility, window focus state, and freeze/pagehide state where supported.

### Signature

```ts
usePageLifecycle(): {
  visible: boolean;
  focused: boolean;
  frozen:  boolean;
}
```

### Return Value

| Key       | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| `visible` | `boolean` | `true` when `document.visibilityState === "visible"`. |
| `focused` | `boolean` | `true` when `document.hasFocus()` returns `true`.     |
| `frozen`  | `boolean` | `true` during `freeze` / `pagehide` lifecycle events. |

### Notes

- Listens to `visibilitychange`, `focus`, `blur`, `freeze`, and `pagehide`.
- SSR-safe: returns `{ visible: false, focused: false, frozen: false }` on the server.
- All listeners are removed on unmount.

## useIntersection

Observe an element's visibility using a pooled `IntersectionObserver`. Hooks with identical options share a single observer instance to minimise overhead.

### Signature

```ts
useIntersection(options?: IntersectionObserverInit): {
  ref:            (node: Element | null) => void;
  isIntersecting: boolean;
  entry?:         IntersectionObserverEntry;
}
```

### Parameters (`IntersectionObserverInit`)

| Name         | Type                 | Default     | Description                      |
| ------------ | -------------------- | ----------- | -------------------------------- |
| `root`       | `Element \| null`    | `null`      | Root element for intersection.   |
| `rootMargin` | `string`             | `undefined` | CSS margin around the root.      |
| `threshold`  | `number \| number[]` | `undefined` | Intersection ratio threshold(s). |

### Return Value

| Key              | Type                                     | Description                                        |
| ---------------- | ---------------------------------------- | -------------------------------------------------- |
| `ref`            | `(node: Element \| null) => void`        | Ref callback — attach to the element to observe.   |
| `isIntersecting` | `boolean`                                | `true` when the element is currently intersecting. |
| `entry`          | `IntersectionObserverEntry \| undefined` | Most recent `IntersectionObserverEntry`.           |

### Notes

- Hooks with identical options share one `IntersectionObserver` instance.
- SSR fallback: `isIntersecting = false`, `entry = undefined`.
- Observers are cleaned up on unmount or when the ref target changes.

---

## usePageLifecycle

Track page visibility, window focus state, and freeze/pagehide state where supported.

### Signature

```ts
usePageLifecycle(): {
  visible: boolean;
  focused: boolean;
  frozen:  boolean;
}
```

### Return Value

| Key       | Type      | Description                                           |
| --------- | --------- | ----------------------------------------------------- |
| `visible` | `boolean` | `true` when `document.visibilityState === "visible"`. |
| `focused` | `boolean` | `true` when `document.hasFocus()` returns true.       |
| `frozen`  | `boolean` | `true` during `freeze` / `pagehide` lifecycle events. |

### Notes

- Listens to `visibilitychange`, `focus`, `blur`, `freeze`, and `pagehide`.
- SSR-safe: returns `{ visible: false, focused: false, frozen: false }` on the server.
- All listeners are removed on unmount.
