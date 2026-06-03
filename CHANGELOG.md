# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-05-01

### Fixed

- Added `docs-site/` to `.npmignore` to prevent documentation source code from being included in the published NPM package tarball.

---

## [1.0.1] - 2026-04-29

### Fixed

- `tsup.config.ts`: added `outExtension` so the bundler now correctly emits `dist/index.cjs` (CJS) and `dist/index.mjs` (ESM). Previously the `"require"` export condition in `package.json` pointed to a non-existent `dist/index.cjs`, breaking all CommonJS consumers.
- `package.json` `"exports"["require"]["types"]`: corrected from `./dist/index.d.cts` (never emitted) to `./dist/index.d.ts`.
- `package.json` `"prepare"` script: replaced `husky install` with a no-op safe on Windows and in CI environments where `husky` is not a globally available binary.
- Added `.npmignore` to exclude test files, docs, tooling config, CI workflows, and IDE settings from the published tarball.

---

## [1.0.0] - 2026-04-29


### Added

- **`useSmartIntersection`** — Global singleton `IntersectionObserver` with RAF batching and `startTransition` support. All components share one observer; scroll throughput is O(1) regardless of observed element count.
- **`useEventPipeline`** — Composable event stream with `AbortController` cancellation. Stage factories: `debounce`, `throttle`, `dedupe`, `sanitize`, `validate`, `transform`, `fromEvent`.
- **`useActionPipeline`** — React 19 `<form action>` / Server Action integration via composable `FormData` pipeline stages.
- **`useWorkerPool`** — Ephemeral Web Worker pool serialized from pure functions via Blob URL. Supports timeout, task cancellation, and `terminateOnIdle`.
- **`useDebouncedStorage`** — Hydration-safe storage with immediate in-memory updates, debounced writes, and optional `BroadcastChannel` cross-tab sync.

### Changed

- **Architecture**: All domain hooks migrated to Domain-Driven folder structure (`bom/`, `concurrency/`, `dom/`, `pipelines/`, `state/`, `core/`).
- **React 19 ref callbacks**: All DOM-observing hooks now return cleanup functions directly from ref callbacks — no paired `useEffect` required.
- **Module-level singletons**: `useNetworkStatus`, `usePageLifecycle`, `useSmartIntersection`, and `useBroadcastState` use module-level global state with ref-counting. Listeners are registered once and torn down when the last subscriber unmounts.
- **`useSyncExternalStore`**: `useNetworkStatus` and `usePageLifecycle` rewritten with stable server snapshots for hydration-safe SSR.
- **Build output**: `tsup` now emits proper `.mjs` (ESM) and `.cjs` (CJS) extensions with matching `.d.mts`/`.d.cts` type declarations.
- **`peerDependencies`**: Broadened from `react >=16.8.0` to `react >=18.0.0` to reflect actual API usage (`useSyncExternalStore`, `startTransition`).

### Fixed

- `package.json` exports `"require"` condition pointed to non-existent `dist/index.cjs`; fixed by adding `outExtension` to tsup config.
- `usePermission`: `useEffect` cleanup removes `PermissionStatus` change listener; guarded `isMounted` flag prevents stale state update after unmount.
- `useMediaControls`: corrected `paused: media.paused || true` (was always `true`) to `paused: media.paused`; fixed handler cleanup via `handlersRef` Map.
- `debounce` stage factory: added `signal.addEventListener('abort', ...)` to clear pending timer immediately on pipeline abort — eliminates dangling timer resource leak.

### Removed

- Legacy `useEffect + useRef` pattern for DOM observation (replaced by React 19 ref callback cleanup).

---

## [0.2.0-preview] - 2026-03-11

### Added

- **useStorage** — persist state in `localStorage` or `sessionStorage`; cross-tab sync via `storage` events; SSR-safe.
- **usePermission** — query and watch Web Permissions API state; legacy fallbacks for browsers without `navigator.permissions`.
- **useMediaControls** — attach to any `<audio>`/`<video>` element via a callback ref; reactive `MediaState` + `MediaControls`; SSR-safe.

### Testing

- All 9 test suites pass: 93 tests pass, 1 skipped, 0 failures.

---

## [0.1.0] - Previous Release

### Added

- `useIdleQueue` — Queue tasks for browser idle time via `requestIdleCallback`
- `useBroadcastState` — Cross-tab state synchronization via `BroadcastChannel`
- `useAdaptivePolling` — Interval polling that adapts to `document.visibilityState`
- `useNetworkStatus` — Online/offline state and Network Information API
- `useIntersection` — Per-instance Intersection Observer with configurable options
- `usePageLifecycle` — Page visibility, focus, and frozen state tracking
