## use-web-kit

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

### Developed by Tanush Bhootra
