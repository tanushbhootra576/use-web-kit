# use-web-kit

**A zero-dependency, lightweight (~3KB) collection of React hooks optimized for performance and modern Browser APIs.**

`TypeScript: Included` | `Size: ~3KB`

---

## Features

- Full TypeScript support with exported types
- Dual ESM and CJS bundles
- Tree-shakeable exports
- Zero runtime dependencies
- Production-ready with comprehensive test coverage

---

## Installation

```bash
npm install use-web-kit
```

```bash
yarn add use-web-kit
```

```bash
pnpm add use-web-kit
```

---

## API

### useIdleQueue

Queues non-urgent tasks to run during browser idle time using `requestIdleCallback` with a robust `setTimeout` fallback for Safari and older browsers.

**Signature**

```ts
const { enqueue, clearQueue, queueLength } = useIdleQueue(options?)
```

**Options**

| Parameter          | Type     | Default     | Description                                 |
| ------------------ | -------- | ----------- | ------------------------------------------- |
| `timeout`          | `number` | `undefined` | Max wait time (ms) before forcing execution |
| `fallbackInterval` | `number` | `50`        | Interval (ms) for the `setTimeout` fallback |

**Usage**

```tsx
import { useIdleQueue } from "use-web-kit";

function Dashboard() {
  const { enqueue, queueLength } = useIdleQueue({ timeout: 2000 });

  const handleClick = () => {
    enqueue(() => {
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ event: "button_click" }),
      });
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Track Event</button>
      <span>Pending tasks: {queueLength}</span>
    </div>
  );
}
```

---

### useBroadcastState

Synchronizes state across different browser tabs and windows in real-time using the Broadcast Channel API. Works as a drop-in replacement for `useState`.

**Signature**

```ts
const [state, setState] = useBroadcastState<T>(channelName, initialValue);
```

| Parameter      | Type     | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `channelName`  | `string` | Unique name identifying the shared channel      |
| `initialValue` | `T`      | Initial state value (must be JSON-serializable) |

**Usage**

```tsx
import { useBroadcastState } from "use-web-kit";

function Counter() {
  const [count, setCount] = useBroadcastState<number>("shared-counter", 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

Open this component in multiple tabs to see the count stay in sync.

---

### useAdaptivePolling

Polls an endpoint at a specified interval but automatically pauses or throttles the frequency when the browser tab is in the background, saving network and compute resources.

**Signature**

```ts
useAdaptivePolling(callback, options);
```

**Options**

| Parameter                  | Type      | Default    | Description                                                                           |
| -------------------------- | --------- | ---------- | ------------------------------------------------------------------------------------- |
| `interval`                 | `number`  | _required_ | Polling interval in milliseconds                                                      |
| `enabled`                  | `boolean` | `true`     | Toggle polling on or off                                                              |
| `pauseOnBackground`        | `boolean` | `true`     | Fully pause when the tab is hidden                                                    |
| `backgroundSlowdownFactor` | `number`  | `5`        | Multiplier applied to interval when hidden (used when `pauseOnBackground` is `false`) |

**Usage**

```tsx
import { useAdaptivePolling } from "react-hook-kit";
import { useState } from "react";

function Notifications() {
  const [data, setData] = useState(null);

  useAdaptivePolling(
    () => {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then(setData);
    },
    {
      interval: 3000,
      pauseOnBackground: false,
      backgroundSlowdownFactor: 4,
    }
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

When the tab is hidden, the polling interval increases from 3 seconds to 12 seconds. When the user returns, polling resumes at normal speed and fires immediately.

---


## Author

Tanush
