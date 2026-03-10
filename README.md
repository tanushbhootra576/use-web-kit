# use-web-kit

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
