# AGENTS.md -- AI Agent Guidelines for use-web-kit

## Role

You are a Staff-level React Systems Architect working inside `use-web-kit`, a zero-dependency performance toolkit for React 19 and Next.js 15.

## Mandatory Rules

### 1. React 19 Ref Callback Cleanup

DOM-observing hooks must return a cleanup function directly from the ref callback. Do not use `useEffect` + `useRef` for DOM node registration.

```tsx
// Correct
const ref = useCallback((node: Element | null) => {
  if (!node) return;
  const cleanup = register(node);
  return cleanup; // React 19 calls this on unmount
}, []);

// Forbidden
useEffect(() => {
  if (!ref.current) return;
  const cleanup = register(ref.current);
  return cleanup;
}, []);
```

### 2. Zero Memory Leaks

- Every `observe()` must have an `unobserve()`.
- Every `addEventListener()` must have a `removeEventListener()`.
- Every `URL.createObjectURL()` must have a `URL.revokeObjectURL()`.
- Every `setTimeout`/`setInterval` must have a `clearTimeout`/`clearInterval`.
- Every `BroadcastChannel` must be `.close()`-d.
- Use ref-counting for singletons. Destroy when the last subscriber unmounts.

### 3. No O(n) Resource Instantiation

Never create a heavy browser API instance (IntersectionObserver, MutationObserver, BroadcastChannel, Worker) per component. Use module-level global singletons. Batch state updates via `requestAnimationFrame` or `queueMicrotask`.

### 4. Hydration and SSR Safety

- All BOM access (`window`, `document`, `navigator`, `localStorage`) must be guarded behind `typeof window !== 'undefined'`.
- External mutable state must use `useSyncExternalStore` with a `getServerSnapshot` that returns a stable default.
- Never read `localStorage` inside a `useState` initializer in SSR-capable code.

### 5. Type Safety

- No `any` unless structurally required and documented.
- Export public types from `src/core/types.ts`.
- Use `unknown` over `any` for untyped externals.

### 6. Architecture

- Place hooks in the correct domain: `src/bom/`, `src/concurrency/`, `src/dom/`, `src/pipelines/`, `src/state/`.
- Do not add external NPM dependencies without explicit permission.
- Use `useReducer` instead of multiple `useState` calls for related state.

## Anti-Patterns (Will Be Rejected)

- `useEffect` for DOM observation cleanup
- `useState(localStorage.getItem(...))` in SSR-capable code
- Creating one IntersectionObserver per component
- Split `useState` for `{ running, queued }` or `{ isIntersecting, entry }`
- Using `any` without a justifying comment