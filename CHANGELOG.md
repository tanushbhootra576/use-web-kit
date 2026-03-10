# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0-preview] - 2026-03-11

### Added

- **useStorage** — persist state in `localStorage` or `sessionStorage` with a `useState`-compatible interface; cross-tab sync via `storage` events; SSR-safe
- **usePermission** — query and watch Web Permissions API state; subscribes to `PermissionStatus.onchange` for live updates; SSR-safe (`"unavailable"` fallback)
- **useMediaControls** — attach to any `<audio>`/`<video>` element via a callback ref; reactive `MediaState` + `MediaControls`; SSR-safe

### Fixed

- `usePermission`: replaced `useSyncExternalStore` with `useState + useEffect` to eliminate unfixable act warnings in tests and prevent unhandled rejections when `permissions.query()` is mocked to reject
- `useMediaControls`: corrected `paused: media.paused || true` (was always `true`) to `paused: media.paused`
- `useMediaControls`: moved `MEDIA_EVENTS` to module level; introduced `handlersRef` (`Map<string, EventListener>`) for accurate wrapped-handler cleanup across all 15 media events

### Testing

- All 9 test suites pass: 93 tests pass, 1 skipped, 0 failures
- `useMediaControls` pause-event test: sets `mockMedia.paused = true` before dispatching the `"pause"` event to mirror real browser behaviour
- `usePermission` suite: `beforeAll` console spy suppresses cosmetic act warnings

### Documentation

- README.md rewritten as a slim landing page (badges, install, quick example, hook reference table, SSR notes, bundle/tree-shaking, testing, contributing)
- `docs/api-utility-hooks.md` — full API reference for `useIdleQueue`, `useBroadcastState`, `useAdaptivePolling`, `useNetworkStatus`, `useIntersection`, `usePageLifecycle`
- `docs/api-browser-hooks.md` — full API reference for `useStorage`, `usePermission`, `useMediaControls`

## [0.1.0] - Previous Release

### Added

- useIdleQueue - Queue tasks for browser idle time
- useBroadcastState - Cross-tab state synchronization
- useAdaptivePolling - Adaptive polling with background optimization
- useNetworkStatus - Network status and connection information
- useIntersection - Intersection observer with pooling
- usePageLifecycle - Page visibility and lifecycle tracking
