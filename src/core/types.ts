// ── Shared & Public Types ──
import type { SyntheticEvent } from 'react';
import { PIPELINE_SKIP } from '../pipelines/useEventPipeline';

export type NetworkStatus = {
      online: boolean;
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };

export type WindowSize = {
    width: number;
    height: number;
};

export type PageLifecycle = {
      visible: boolean;
      focused: boolean;
      frozen: boolean;
    };

export interface UsePermissionReturn {
    state: PermissionState | "unsupported";
    request: () => Promise<PermissionState>;
}

export type PermissionName = | "geolocation"
      | "notifications"
      | "persistent-storage"
      | "push"
      | "camera"
      | "microphone"
      | "speaker"
      | "device-info"
      | "background-sync"
      | "background-fetch"
      | "accelerometer"
      | "gyroscope"
      | "magnetometer"
      | "ambient-light-sensor"
      | "clipboard-read"
      | "clipboard-write";
export type PermissionState = "granted" | "denied" | "prompt";

export interface UseAdaptivePollingOptions {
    interval: number;
    enabled?: boolean;
    pauseOnBackground?: boolean;
    backgroundSlowdownFactor?: number;
}

export interface UseIdleQueueOptions {
    timeout?: number;
    fallbackInterval?: number;
}

export interface UseIdleQueueReturn {
    enqueue: (task: IdleQueueTask) => void;
    clearQueue: () => void;
    queueLength: number;
}

export type IdleQueueTask = () => void | Promise<void>;

/** Options for `useWorkerPool`. */
export interface UseWorkerPoolOptions {
    /**
     * Maximum number of concurrent workers in the pool.
     * Each worker consumes ~1-4 MB of memory. Keep this ≤ navigator.hardwareConcurrency.
     * @default 2
     */
    maxWorkers?: number;
    /**
     * Maximum milliseconds a single task may run before it is forcibly terminated.
     * The task Promise rejects with a `WorkerTimeoutError`.
     * @default 30000 (30 seconds)
     */
    timeout?: number;
    /**
     * When true, idle workers are terminated after completing a task to free
     * memory immediately. When false (default), workers are kept alive for reuse.
     * Use true for infrequent tasks; false for high-frequency workloads.
     * @default false
     */
    terminateOnIdle?: boolean;
}

/** Return value of `useWorkerPool`. */
export interface UseWorkerPoolReturn<TArgs extends unknown[], TResult> {
    /**
     * Submits a task to the worker pool. Returns a Promise that resolves with the
     * worker's result, or rejects with a `WorkerExecutionError`, `WorkerTimeoutError`,
     * or `WorkerCancelledError`.
     *
     * @returns A tuple of [Promise<TResult>, taskId]. The taskId can be passed
     *   to `cancel()` to abort this specific task.
     */
    run: (...args: TArgs) => [Promise<TResult>, string];
    /**
     * Cancels a specific task by ID, or all in-flight and queued tasks if no ID
     * is provided. Cancellation is immediate — the responsible worker is terminated.
     */
    cancel: (taskId?: string) => void;
    /** True if any task is currently running or queued. */
    isRunning: boolean;
    /** Number of tasks waiting in the queue (not yet assigned to a worker). */
    pendingCount: number;
    /**
     * Immediately terminates all workers and clears the queue. After calling this,
     * the hook re-initializes on the next `run()` call.
     * Equivalent to unmounting and remounting the component — use sparingly.
     */
    terminate: () => void;
}

export interface MediaState {
    playing: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    muted: boolean;
    paused: boolean;
    ended: boolean;
    loading: boolean;
    error: string | null;
}

export interface MediaControls {
    play: () => Promise<void>;
    pause: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    mute: () => void;
    unmute: () => void;
    togglePlay: () => Promise<void>;
    toggleMute: () => void;
}

export interface UseMediaControlsReturn {
    state: MediaState;
    controls: MediaControls;
    ref: (node: MediaType | null) => void | (() => void);
}

export type MediaType = HTMLAudioElement | HTMLVideoElement;

/**
 * Options forwarded to the underlying IntersectionObserver, plus React-specific
 * performance controls.
 */
export interface UseSmartIntersectionOptions {
    /**
     * The element used as the viewport for checking visibility of the target.
     * Defaults to the browser viewport when null or omitted.
     */
    root?: Element | Document | null;
    /**
     * Margin around the root. Accepts values similar to the CSS `margin` property.
     * @example "100px 0px" — triggers 100px before the element enters the viewport.
     */
    rootMargin?: string;
    /**
     * A single threshold or an array of thresholds at which the callback is invoked.
     * Each threshold is a ratio between 0.0 and 1.0.
     * @example [0, 0.25, 0.5, 0.75, 1] — fires at 0%, 25%, 50%, 75%, and 100% visibility.
     */
    threshold?: number | number[];
    /**
     * When true, intersection state updates are wrapped in React's `startTransition`,
     * marking them as non-urgent. Use this for features like lazy-loading images or
     * analytics where a few frames of delay is acceptable in exchange for keeping
     * the UI responsive to higher-priority interactions.
     *
     * @default false
     */
    lowPriority?: boolean;
    /**
     * An optional callback invoked on every intersection change. When provided,
     * the hook operates in **callback-driven mode**: no internal React state is
     * maintained, making it completely allocation-free on each scroll tick.
     *
     * If omitted, the hook operates in **state-driven mode** and returns
     * `{ isIntersecting, entry }` reactive state values.
     *
     * Mixing both modes is supported — the callback fires AND state updates.
     */
    onIntersect?: IntersectionCallback;
}

/**
 * The object returned by `useSmartIntersection`.
 *
 * - `ref`: Attach this to the DOM element you want to observe.
 * - `isIntersecting`: True when the element is within the root viewport.
 * - `entry`: The raw IntersectionObserverEntry from the last update.
 *   Starts as `null` on the server and before the first observation fires.
 */
export interface UseSmartIntersectionReturn {
    /**
     * React 19 ref callback. Attach directly to a JSX element:
     * ```tsx
     * <div ref={ref}>...</div>
     * ```
     * The callback returns its own cleanup function, which React 19 calls
     * automatically when the element is unmounted or the ref changes.
     */
    ref: (node: Element | null) => void | (() => void);
    /** Whether the observed element is currently intersecting the root. */
    isIntersecting: boolean;
    /** The most recent IntersectionObserverEntry, or null if not yet observed. */
    entry: IntersectionObserverEntry | null;
}

/**
 * A subscriber callback invoked whenever the observed element's intersection
 * state changes. Receives the raw IntersectionObserverEntry.
 */
export type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

/** Options for `useEventPipeline`. */
export interface UseEventPipelineOptions<TOut> {
    /**
     * Called with the final pipeline output after all stages complete successfully.
     * Use this for side effects (analytics, API calls) without relying on state.
     */
    onComplete?: (result: TOut) => void;
    /**
     * Called when any stage throws. Receives the error for display or logging.
     * If omitted, the error is available via the returned `error` state.
     */
    onError?: (error: Error) => void;
}

/** Return value of `useEventPipeline`. */
export interface UseEventPipelineReturn<TEvent extends Event | SyntheticEvent, TOut> {
    /**
     * Stable event handler — attach directly to JSX elements.
     * Each call aborts the previous in-flight pipeline invocation.
     * ```tsx
     * <input onChange={handler} />
     * ```
     */
    handler: (event: TEvent) => void;
    /** The most recent successful pipeline output. null before first completion. */
    value: TOut | null;
    /** The most recent pipeline error, or null if the last run succeeded. */
    error: Error | null;
    /** True while a pipeline invocation is in-flight (including debounce wait). */
    isPending: boolean;
    /** Resets value, error, and isPending to their initial state. Also cancels any in-flight pipeline. */
    reset: () => void;
}

/** Options for `useActionPipeline`. */
export interface UseActionPipelineOptions<TOut> {
    /**
     * A React 19 Server Action or async function to invoke with the final pipeline
     * output. Called after all stages complete successfully.
     * If omitted, use `onComplete` or the returned state to handle the result.
     */
    action?: (data: TOut) => void | Promise<void>;
    /** Called with the final pipeline output (after `action` resolves, if provided). */
    onComplete?: (result: TOut) => void;
    /** Called when any stage or the action throws. */
    onError?: (error: Error) => void;
}

/** Return value of `useActionPipeline`. */
export interface UseActionPipelineReturn<TOut> {
    /**
     * Async form action handler for React 19 `<form action={...}>`.
     * Each invocation aborts the previous in-flight pipeline + action.
     *
     * ```tsx
     * <form action={formAction}>...</form>
     * ```
     */
    formAction: (formData: FormData) => Promise<void>;
    /** The most recent successful pipeline output. null before first completion. */
    value: TOut | null;
    /** True while the pipeline or server action is in-flight. */
    isPending: boolean;
    /** The most recent error from any stage or the server action. */
    error: Error | null;
    /** Resets state and cancels any in-flight invocation. */
    reset: () => void;
}

export type PipelineSkip = typeof PIPELINE_SKIP;
/**
 * A single pipeline stage. Receives the output of the previous stage (or the
 * raw input for the first stage) and an AbortSignal for cancellation awareness.
 *
 * Returning `PIPELINE_SKIP` short-circuits the pipeline silently.
 * Throwing cancels the pipeline with an error.
 */
export type PipelineStage<TIn = unknown, TOut = unknown> = (
      input: TIn,
      signal: AbortSignal,
    ) => TOut | PipelineSkip | Promise<TOut | PipelineSkip>;
export type AnyPipelineStage = PipelineStage<any, any>;

/**
 * Custom serializer for converting between T and raw storage strings.
 * Provide this when T is not JSON-serializable or when you need compact
 * encoding (e.g., MessagePack, Base64, custom formats).
 */
export interface StorageSerializer<T> {
    /** Deserialize a raw storage string into T. Must be pure and throw-safe. */
    read: (raw: string) => T;
    /** Serialize T into a raw storage string. Must be pure and throw-safe. */
    write: (value: T) => string;
}

/** Options accepted by `useDebouncedStorage`. */
export interface UseDebouncedStorageOptions<T> {
    /**
     * Which Web Storage API to target.
     * @default "localStorage"
     */
    storage?: StorageArea;
    /**
     * Milliseconds to wait after the last write before flushing to actual storage.
     * The in-memory state updates immediately; only the disk write is debounced.
     * Lower values increase storage durability; higher values reduce write thrashing.
     * @default 300
     */
    debounceMs?: number;
    /**
     * Custom serializer. Defaults to JSON.parse / JSON.stringify.
     * Provide this for non-JSON types (Date, Map, Set, etc.).
     */
    serializer?: StorageSerializer<T>;
    /**
     * Enable cross-tab synchronization via BroadcastChannel.
     * When true, writes in one tab are reflected in all other open tabs.
     * Automatically disabled for sessionStorage (which is tab-scoped by spec).
     * @default true for localStorage, false for sessionStorage
     */
    broadcastSync?: boolean;
}

/** The object returned by `useDebouncedStorage`. */
export interface UseDebouncedStorageReturn<T> {
    /**
     * The current value, reactively updated on local writes and cross-tab changes.
     * Returns `initialValue` during SSR and before the first client-side hydration.
     */
    value: T;
    /**
     * Update the stored value. The React state updates synchronously (immediate
     * re-render), while the actual storage write is debounced by `debounceMs`.
     * Accepts a direct value or an updater function, identical to React's setState.
     */
    setValue: (value: T | ((prev: T) => T)) => void;
    /**
     * Remove the key from storage entirely and reset the value to `initialValue`.
     * Broadcasts the removal to other tabs if broadcastSync is enabled.
     */
    removeValue: () => void;
    /**
     * Force an immediate write to storage, bypassing the debounce timer.
     * Call this in `beforeunload` handlers or any scenario where data must be
     * persisted before the current task yields.
     *
     * @example
     * ```ts
     * useEffect(() => {
     *   window.addEventListener('beforeunload', flush);
     *   return () => window.removeEventListener('beforeunload', flush);
     * }, [flush]);
     * ```
     */
    flush: () => void;
}

/** Which Web Storage API to use. */
export type StorageArea = "localStorage" | "sessionStorage";

export interface UseStorageOptions {
    serializer?: {
        read: (value: string) => unknown;
        write: (value: unknown) => string;
        };
}

export interface UseStorageReturn<T> {
    value: T;
    setValue: (value: T | ((prev: T) => T)) => void;
    removeValue: () => void;
}

export type StorageType = "localStorage" | "sessionStorage";

export interface UseKeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  target?: 'window' | 'document';
}

export interface AIStreamState {
  text: string;
  done: boolean;
  error: Error | null;
  streaming: boolean;
}

export interface UseAIStreamReturn extends AIStreamState {
  stream: (response: Response | ReadableStream<Uint8Array>) => void;
  abort: () => void;
}

export interface UseViewTransitionReturn {
  startTransition: (updateFn: () => void | Promise<void>) => Promise<void>;
  isTransitioning: boolean;
  isSupported: boolean;
}

export interface UseOptimisticQueueReturn<T> {
  items: T[];
  enqueue: (item: T, serverCall: () => Promise<T[]>) => void;
  isPending: boolean;
  error: Error | null;
}

