# API Reference — Browser API Hooks

These hooks integrate directly with browser-native APIs: persistent storage, the Web Permissions API, and HTML media element control.

> **Back to** [README](../README.md) | [← Utility Hooks](./api-utility-hooks.md)

---

## Table of Contents

- [useStorage](#usestorage)
- [usePermission](#usepermission)
- [useMediaControls](#usemediacontrols)

---

## useStorage

Persist state in `localStorage` or `sessionStorage` with React's `useState`-like interface. Handles serialisation, SSR, and storage events across tabs for `localStorage`.

### Signature

```ts
useStorage<T>(
  key:          string,
  initialValue: T,
  storageArea?: "local" | "session"
): [T, Dispatch<SetStateAction<T>>, () => void]
```

### Parameters

| Name           | Type                   | Default   | Description                                         |
| -------------- | ---------------------- | --------- | --------------------------------------------------- |
| `key`          | `string`               | —         | Storage key **_(required)_**.                       |
| `initialValue` | `T`                    | —         | Value used when the key is absent **_(required)_**. |
| `storageArea`  | `"local" \| "session"` | `"local"` | Target storage area.                                |

### Return Value

`[value, setValue, removeValue]`

| Index | Type                          | Description                                                            |
| ----- | ----------------------------- | ---------------------------------------------------------------------- |
| `0`   | `T`                           | Current stored value (or `initialValue` when absent/unparseable).      |
| `1`   | `Dispatch<SetStateAction<T>>` | Setter — accepts a new value or an updater function (like `useState`). |
| `2`   | `() => void`                  | Remove the key from storage and reset to `initialValue`.               |

### Notes

- Values are JSON-encoded; setting `undefined` is equivalent to calling `removeValue`.
- Cross-tab sync is active **only** for `localStorage` via the `storage` window event.
- SSR-safe: returns `initialValue` when `window` is not defined.

---

## usePermission

Query and watch the state of a [Web Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) permission. Requests the permission when a user gesture calls `request()`.

### Signature

```ts
usePermission(name: PermissionName): {
  state:    PermissionState | "unavailable";
  loading:  boolean;
  request:  () => Promise<PermissionState | null>;
}
```

### Parameters

| Name   | Type             | Description                                                            |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| `name` | `PermissionName` | A valid `PermissionDescriptor` name — e.g. `"camera"`, `"geolocation"` |

### Return Value

| Key       | Type                                     | Description                                                      |
| --------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `state`   | `PermissionState \| "unavailable"`       | Current permission state or `"unavailable"` (SSR / unsupported). |
| `loading` | `boolean`                                | `true` while the initial query is in flight.                     |
| `request` | `() => Promise<PermissionState \| null>` | Trigger the native permission request prompt.                    |

### Notes

- `state` is one of: `"granted"`, `"denied"`, `"prompt"`, or `"unavailable"`.
- Live updates: the hook subscribes to `PermissionStatus.onchange` so state re-renders automatically when the user modifies browser permissions.
- SSR / API-unavailable: `state = "unavailable"`, `loading = false`.
- Call `request()` from within a user event handler to satisfy browser activation requirements.

---

## useMediaControls

Attach to an `<audio>` or `<video>` element via a ref callback. Returns reactive state and programmatic control actions.

### Signature

```ts
useMediaControls(): {
  ref:      (node: HTMLMediaElement | null) => void;
  state:    MediaState;
  controls: MediaControls;
}
```

### `MediaState`

| Key            | Type         | Description                                                          |
| -------------- | ------------ | -------------------------------------------------------------------- |
| `paused`       | `boolean`    | `true` when the media is paused (mirrors `HTMLMediaElement.paused`). |
| `ended`        | `boolean`    | `true` when playback has finished.                                   |
| `currentTime`  | `number`     | Current playback position in seconds.                                |
| `duration`     | `number`     | Total duration in seconds (`NaN` before metadata loads).             |
| `volume`       | `number`     | Volume level, `0.0` – `1.0`.                                         |
| `muted`        | `boolean`    | `true` when the element is muted.                                    |
| `buffered`     | `TimeRanges` | The `buffered` `TimeRanges` object from the element.                 |
| `readyState`   | `number`     | `HTMLMediaElement.readyState` (`0`–`4`).                             |
| `playbackRate` | `number`     | Current playback speed (e.g. `1.5`).                                 |

### `MediaControls`

| Key               | Type                   | Description               |
| ----------------- | ---------------------- | ------------------------- |
| `play`            | `() => void`           | Resume playback.          |
| `pause`           | `() => void`           | Pause playback.           |
| `seek`            | `(t: number) => void`  | Jump to `t` seconds.      |
| `setVolume`       | `(v: number) => void`  | Set volume `0.0` – `1.0`. |
| `setMuted`        | `(m: boolean) => void` | Mute or unmute.           |
| `setPlaybackRate` | `(r: number) => void`  | Change playback rate.     |

### Notes

- `ref` is a **callback ref** — assign it directly to the element's `ref` prop.
- State updates on 15 standard media events (`play`, `pause`, `timeupdate`, `ended`, etc.).
- All event listeners are removed when the element is detached or the component unmounts.
- SSR-safe: `state` starts with sensible defaults when no element is attached.

### Usage

```tsx
import { useMediaControls } from "use-web-kit";

function AudioPlayer() {
  const { ref, state, controls } = useMediaControls();

  return (
    <div>
      <audio ref={ref} src="/track.mp3" />

      <button onClick={state.paused ? controls.play : controls.pause}>
        {state.paused ? "Play" : "Pause"}
      </button>

      <input
        type="range"
        min={0}
        max={state.duration || 0}
        value={state.currentTime}
        onChange={(e) => controls.seek(Number(e.target.value))}
      />

      <span>
        {state.currentTime.toFixed(1)}s / {(state.duration || 0).toFixed(1)}s
      </span>
    </div>
  );
}
```

| ----------------- | ---------------------- | ------------------------- |
| `play` | `() => void` | Resume playback. |
| `pause` | `() => void` | Pause playback. |
| `seek` | `(t: number) => void` | Jump to `t` seconds. |
| `setVolume` | `(v: number) => void` | Set volume `0.0` – `1.0`. |
| `setMuted` | `(m: boolean) => void` | Mute or unmute. |
| `setPlaybackRate` | `(r: number) => void` | Change playback rate. |

### Notes

- `ref` is a **callback ref** — assign directly to the element's `ref` prop.
- State updates on 15 standard media events (`play`, `pause`, `timeupdate`, `ended`, etc.).
- Cleans up all event listeners when the element is detached or the component unmounts.
- SSR-safe: `state` starts with sensible defaults when no element is attached.

### Usage

```tsx
import { useMediaControls } from "custom-hook-npm";

function AudioPlayer() {
  const { ref, state, controls } = useMediaControls();

  return (
    <div>
      <audio ref={ref} src="/track.mp3" />

      <button onClick={state.paused ? controls.play : controls.pause}>
        {state.paused ? "Play" : "Pause"}
      </button>

      <input
        type="range"
        min={0}
        max={state.duration || 0}
        value={state.currentTime}
        onChange={(e) => controls.seek(Number(e.target.value))}
      />

      <span>
        {state.currentTime.toFixed(1)}s / {(state.duration || 0).toFixed(1)}s
      </span>
    </div>
  );
}
```
