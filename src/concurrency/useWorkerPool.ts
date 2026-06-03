/**
 * @fileoverview useWorkerPool — Main-thread protection via Web Worker pooling.
 *
 * ─── ARCHITECTURE OVERVIEW ─────────────────────────────────────────────────────
 *
 * PROBLEM:
 *   Heavy synchronous work (JSON parsing, sorting large arrays, image processing,
 *   encryption) blocks the main thread. During a blocked main thread, React
 *   cannot reconcile, animations freeze, and user input is dropped.
 *
 * SOLUTION — WORKER POOL:
 *   1. FUNCTION SERIALIZATION — The pure function provided by the consumer is
 *      serialized to a string via fn.toString() and embedded into a self-contained
 *      worker script. This script is compiled into a Blob URL, allowing Worker
 *      creation without a separate file.
 *
 *   2. POOL — N workers are maintained across task invocations. Workers are
 *      reused (not recreated) after each task, amortizing the ~5ms spawn cost
 *      over many tasks. When all workers are busy, tasks queue until a worker
 *      becomes available.
 *
 *   3. CANCELLATION — Every task has a unique ID. Cancelling terminates the
 *      responsible worker (the only reliable cancellation for arbitrary code),
 *      rejects the task Promise, and spawns a replacement worker to restore
 *      pool capacity.
 *
 *   4. TIMEOUT — A configurable timer rejects and terminates workers that run
 *      beyond the allowed duration, preventing runaway tasks from exhausting
 *      the pool permanently.
 *
 *   5. MEMORY SAFETY — Every Blob URL is tracked and revoked on worker termination.
 *      Component unmount terminates all workers and flushes the task queue.
 *      No workers, Blob URLs, or pending Promises survive unmount.
 *
 * SECURITY NOTE:
 *   fn.toString() embeds the function's source code into the worker script.
 *   ONLY pass pure functions with no closure dependencies — closures are NOT
 *   transferred to the worker. Do NOT pass functions that reference sensitive
 *   data (tokens, keys) via closure — those values are ignored in the worker.
 *
 * LIMITATIONS:
 *   - Transferable objects (ArrayBuffer, ImageBitmap) must be passed via args.
 *   - The worker has no access to the DOM, React context, or app modules.
 *   - Function must be serializable (arrow functions and named functions work;
 *     native builtins like Math.sqrt cannot be serialized meaningfully).
 *
 * @module useWorkerPool
 */

"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { UseWorkerPoolOptions, UseWorkerPoolReturn } from "../core/types";

// ─── Public Types ─────────────────────────────────────────────────────────────

/** Structured error thrown when a worker task times out. */
export class WorkerTimeoutError extends Error {
  readonly taskId: string;
  constructor(taskId: string, timeoutMs: number) {
    super(`Worker task "${taskId}" timed out after ${timeoutMs}ms`);
    this.name = "WorkerTimeoutError";
    this.taskId = taskId;
  }
}

/** Structured error thrown when a worker task is cancelled. */
export class WorkerCancelledError extends Error {
  readonly taskId: string;
  constructor(taskId: string) {
    super(`Worker task "${taskId}" was cancelled`);
    this.name = "WorkerCancelledError";
    this.taskId = taskId;
  }
}

/** Structured error wrapping errors thrown inside the worker. */
export class WorkerExecutionError extends Error {
  constructor(message: string, workerStack?: string) {
    super(message);
    this.name = "WorkerExecutionError";
    if (workerStack) this.stack = workerStack;
  }
}

// ─── Internal Pool Infrastructure ─────────────────────────────────────────────

/** A counter for generating unique task IDs without crypto overhead. */
let taskCounter = 0;
function nextTaskId(): string {
  return `uwk-task-${++taskCounter}`;
}

/** Message shape sent from main thread → worker. */
interface WorkerRequest {
  id: string;
  args: unknown[];
}

/** Message shape sent from worker → main thread. */
interface WorkerResponse {
  id: string;
  result?: unknown;
  error?: { message: string; name: string; stack?: string };
}

/** Generates the self-contained worker script with the function embedded. */
function buildWorkerScript(fnString: string): string {
  // The function is embedded as a literal expression, not eval'd at runtime.
  // The worker calls it directly, passing all args spread from the message.
  // Async functions are supported — the worker awaits the result.
  return `
const __task = ${fnString};
self.onmessage = async function(event) {
  const { id, args } = event.data;
  try {
    const result = await __task(...args);
    self.postMessage({ id, result });
  } catch (err) {
    self.postMessage({
      id,
      error: {
        message: err instanceof Error ? err.message : String(err),
        name: err instanceof Error ? err.name : 'Error',
        stack: err instanceof Error ? err.stack : undefined,
      }
    });
  }
};
`.trim();
}

/** Tracks a single Worker instance along with its Blob URL. */
interface WorkerEntry {
  worker: Worker;
  /** The Blob URL must be revoked when the worker is terminated. */
  blobUrl: string;
  busy: boolean;
  /** ID of the task currently assigned to this worker. */
  currentTaskId: string | null;
}

/** A pending task waiting for an available worker. */
interface PoolTask {
  id: string;
  args: unknown[];
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  /** setTimeout handle for the task timeout. null if no timeout configured. */
  timeoutHandle: ReturnType<typeof setTimeout> | null;
}

/** The complete pool state, stored in a ref (not React state). */
interface WorkerPool {
  entries: WorkerEntry[];
  /** Tasks waiting for a free worker slot. */
  queue: PoolTask[];
  /** All in-flight tasks (assigned to workers), keyed by task ID. */
  activeTasks: Map<string, { entry: WorkerEntry; task: PoolTask }>;
  fnString: string;
  maxWorkers: number;
  timeout: number;
  terminateOnIdle: boolean;
  /** Called when the active+queue task count changes (updates React state). */
  onCountChange: (running: number, queued: number) => void;
}

/** Creates a single Worker from a Blob URL. Returns the WorkerEntry. */
function spawnWorker(fnString: string, pool: WorkerPool): WorkerEntry {
  const blob = new Blob([buildWorkerScript(fnString)], {
    type: "application/javascript",
  });
  const blobUrl = URL.createObjectURL(blob);
  const worker = new Worker(blobUrl);
  const entry: WorkerEntry = {
    worker,
    blobUrl,
    busy: false,
    currentTaskId: null,
  };

  // Handle messages from the worker — both results and errors.
  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const { id, result, error } = event.data;
    const active = pool.activeTasks.get(id);
    if (!active) return; // Task was cancelled before worker responded.

    const { task } = active;

    // Clear the timeout before resolving/rejecting.
    if (task.timeoutHandle !== null) clearTimeout(task.timeoutHandle);

    pool.activeTasks.delete(id);
    entry.busy = false;
    entry.currentTaskId = null;

    if (error) {
      task.reject(new WorkerExecutionError(error.message, error.stack));
    } else {
      task.resolve(result);
    }

    // Either terminate idle worker or immediately process next queued task.
    if (pool.terminateOnIdle) {
      terminateWorkerEntry(entry, pool);
    } else {
      drainQueue(pool);
    }
    updateCount(pool);
  };

  // Worker-level errors (syntax errors in the script, uncaught throws
  // outside the message handler) are rare but must be handled.
  worker.onerror = (event: ErrorEvent) => {
    event.preventDefault();
    const taskId = entry.currentTaskId;
    if (!taskId) return;

    const active = pool.activeTasks.get(taskId);
    if (!active) return;

    const { task } = active;
    if (task.timeoutHandle !== null) clearTimeout(task.timeoutHandle);
    pool.activeTasks.delete(taskId);

    task.reject(new WorkerExecutionError(event.message ?? "Worker error"));
    terminateWorkerEntry(entry, pool);
    updateCount(pool);
  };

  return entry;
}

/**
 * Terminates a single worker, revokes its Blob URL, and removes it from the pool.
 *
 * MEMORY SAFETY: URL.revokeObjectURL() releases the Blob from browser memory.
 * Without this call, the Blob remains allocated until the page is unloaded.
 */
function terminateWorkerEntry(entry: WorkerEntry, pool: WorkerPool): void {
  entry.worker.terminate();
  URL.revokeObjectURL(entry.blobUrl);
  const idx = pool.entries.indexOf(entry);
  if (idx !== -1) pool.entries.splice(idx, 1);
}

/** Assigns the next queued task to the given idle worker. */
function assignTask(entry: WorkerEntry, task: PoolTask, pool: WorkerPool): void {
  entry.busy = true;
  entry.currentTaskId = task.id;
  pool.activeTasks.set(task.id, { entry, task });

  // Timeout: reject and terminate if the worker doesn't respond in time.
  if (pool.timeout > 0) {
    task.timeoutHandle = setTimeout(() => {
      const active = pool.activeTasks.get(task.id);
      if (!active) return; // Already completed.

      pool.activeTasks.delete(task.id);
      task.reject(new WorkerTimeoutError(task.id, pool.timeout));

      // Terminate the timed-out worker and spawn a replacement to keep pool size.
      terminateWorkerEntry(entry, pool);
      // Only spawn a replacement if we're still below maxWorkers.
      // (The pool may have been torn down between the timeout scheduling and now.)
      if (pool.entries.length < pool.maxWorkers) {
        const replacement = spawnWorker(pool.fnString, pool);
        pool.entries.push(replacement);
      }
      drainQueue(pool);
      updateCount(pool);
    }, pool.timeout);
  } else {
    task.timeoutHandle = null;
  }

  const request: WorkerRequest = { id: task.id, args: task.args };
  entry.worker.postMessage(request);
}

/**
 * Attempts to assign queued tasks to idle workers.
 * Also spawns new workers (up to maxWorkers) if needed.
 */
function drainQueue(pool: WorkerPool): void {
  while (pool.queue.length > 0) {
    // Find an idle worker.
    const idleEntry = pool.entries.find((e) => !e.busy);

    if (idleEntry) {
      const task = pool.queue.shift()!;
      assignTask(idleEntry, task, pool);
    } else if (pool.entries.length < pool.maxWorkers) {
      // Spawn a new worker and assign immediately.
      const entry = spawnWorker(pool.fnString, pool);
      pool.entries.push(entry);
      const task = pool.queue.shift()!;
      assignTask(entry, task, pool);
    } else {
      // All workers busy and at capacity — task must wait.
      break;
    }
  }
}

/** Pushes updated running/queued counts to React state. */
function updateCount(pool: WorkerPool): void {
  pool.onCountChange(pool.activeTasks.size, pool.queue.length);
}

/** Terminates all workers and rejects all queued/active tasks. */
function destroyPool(pool: WorkerPool, reason: Error): void {
  // Cancel all queued tasks.
  for (const task of pool.queue) {
    if (task.timeoutHandle !== null) clearTimeout(task.timeoutHandle);
    task.reject(reason);
  }
  pool.queue.length = 0;

  // Cancel all active tasks.
  pool.activeTasks.forEach(({ task }) => {
    if (task.timeoutHandle !== null) clearTimeout(task.timeoutHandle);
    task.reject(reason);
  });
  pool.activeTasks.clear();

  // Terminate and clean up all workers.
  for (const entry of pool.entries) {
    entry.worker.terminate();
    URL.revokeObjectURL(entry.blobUrl);
  }
  pool.entries.length = 0;
}

// ─── The Hook ─────────────────────────────────────────────────────────────────

/**
 * `useWorkerPool` — Offload heavy computation to a managed Web Worker pool.
 *
 * @description
 * Serializes a pure function via `fn.toString()`, embeds it in a Blob-URL worker
 * script, and manages a pool of N workers that execute tasks concurrently.
 * Tasks that exceed the configured pool size are queued and processed in order.
 *
 * **Thread Safety**: All React state updates originate from worker message handlers
 * on the main thread — no concurrency issues.
 *
 * **Memory**: Every Blob URL is revoked and every Worker is terminated on unmount.
 * Zero memory retained after the component tree is destroyed.
 *
 * **Pure functions only**: Workers run in an isolated context with no access to the
 * main thread's scope. Closures, imports, and DOM APIs are unavailable in the worker.
 *
 * @param fn - A **pure** function to execute in the worker pool. Must be
 *   self-contained (no closure dependencies, no imports). Async functions supported.
 * @param options - Pool size, timeout, and idle-termination settings.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API | MDN: Web Workers API}
 *
 * @example Offload large array sort (state-driven):
 * ```tsx
 * "use client";
 * import { useState } from "react";
 * import { useWorkerPool } from "use-web-kit";
 *
 * // ✅ Pure function — no closure dependencies
 * const sortNumbers = (arr: number[]) => [...arr].sort((a, b) => a - b);
 *
 * export function SortButton({ data }: { data: number[] }) {
 *   const [sorted, setSorted] = useState<number[]>([]);
 *   const { run, isRunning } = useWorkerPool(sortNumbers, { maxWorkers: 2 });
 *
 *   const handleSort = async () => {
 *     const [promise] = run(data);
 *     const result = await promise;
 *     setSorted(result);
 *   };
 *
 *   return (
 *     <button onClick={handleSort} disabled={isRunning}>
 *       {isRunning ? "Sorting…" : "Sort"}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Task cancellation:
 * ```tsx
 * const { run, cancel, isRunning } = useWorkerPool(heavyFn, { timeout: 5000 });
 *
 * const handleStart = () => {
 *   const [promise, taskId] = run(largePayload);
 *   promise.catch((err) => {
 *     if (err instanceof WorkerCancelledError) console.log("Cancelled:", taskId);
 *   });
 * };
 *
 * // Cancel all in-flight tasks:
 * <button onClick={() => cancel()}>Cancel all</button>
 * ```
 *
 * @example React 19 `use` integration (Suspense-based):
 * ```tsx
 * "use client";
 * import { use, useState } from "react";
 * import { useWorkerPool } from "use-web-kit";
 *
 * const parseJson = (raw: string) => JSON.parse(raw);
 *
 * export function DataViewer({ rawJson }: { rawJson: string }) {
 *   const { run } = useWorkerPool(parseJson);
 *   const [promise, setPromise] = useState<Promise<unknown> | null>(null);
 *
 *   return (
 *     <>
 *       <button onClick={() => setPromise(run(rawJson)[0])}>Parse</button>
 *       {promise && (
 *         <Suspense fallback={<Spinner />}>
 *           <Result promise={promise} />
 *         </Suspense>
 *       )}
 *     </>
 *   );
 * }
 *
 * function Result({ promise }: { promise: Promise<unknown> }) {
 *   const data = use(promise); // React 19 — suspends until resolved
 *   return <pre>{JSON.stringify(data, null, 2)}</pre>;
 * }
 * ```
 */
export function useWorkerPool<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult | Promise<TResult>,
  options: UseWorkerPoolOptions = {},
): UseWorkerPoolReturn<TArgs, TResult> {
  const {
    maxWorkers = 2,
    timeout = 30_000,
    terminateOnIdle = false,
  } = options;

  // AUDIT FIX #1 — Single useReducer replaces two useState calls.
  // Previously, setRunningCount + setQueuedCount fired sequentially from
  // worker.onmessage (outside a React synthetic event), causing two separate
  // render passes. A single dispatch guarantees one reconciliation per transition.
  const [counts, dispatchCount] = useReducer(
    (_: { running: number; queued: number }, next: { running: number; queued: number }) => next,
    { running: 0, queued: 0 },
  );

  // AUDIT FIX #2 — onCountChangeRef is updated every render (not just on mount).
  // The pool calls this via ref indirection, so it always reaches the latest
  // dispatch regardless of when the pool struct was created.
  const onCountChangeRef = useRef<(r: number, q: number) => void>(() => {});
  onCountChangeRef.current = (r: number, q: number) =>
    dispatchCount({ running: r, queued: q });

  // Pool stored in a ref — pool mutations must not trigger re-renders.
  const poolRef = useRef<WorkerPool | null>(null);
  const fnStringRef = useRef<string>("");

  // AUDIT FIX #3 — Pool creation (a side effect) moved entirely into useEffect.
  // Previously, getOrCreatePool() was called in the render body and could call
  // destroyPool() during render — a side effect that violates React's purity
  // contract for the render phase (broken under StrictMode + concurrent features).
  useEffect(() => {
    if (typeof Worker === "undefined") return;

    const newFnString = fn.toString();

    if (poolRef.current && fnStringRef.current === newFnString) {
      // Same function — update config values in-place so future tasks use them.
      poolRef.current.maxWorkers = maxWorkers;
      poolRef.current.timeout = timeout;
      poolRef.current.terminateOnIdle = terminateOnIdle;
      return;
    }

    // Function changed — tear down old pool (side effect safe here in useEffect).
    if (poolRef.current) {
      destroyPool(poolRef.current, new WorkerCancelledError("pool-reinit"));
    }

    // The pool calls onCountChange via ref indirection: (r, q) => onCountChangeRef.current(r, q)
    // This means the pool struct never holds a stale setter reference.
    poolRef.current = {
      entries: [],
      queue: [],
      activeTasks: new Map(),
      fnString: newFnString,
      maxWorkers,
      timeout,
      terminateOnIdle,
      onCountChange: (r, q) => onCountChangeRef.current(r, q),
    };
    fnStringRef.current = newFnString;
  }, [fn, maxWorkers, timeout, terminateOnIdle]);

  // MEMORY SAFETY: Terminate all workers and flush all pending tasks on unmount.
  useEffect(() => {
    return () => {
      if (poolRef.current) {
        destroyPool(
          poolRef.current,
          new WorkerCancelledError("component-unmount"),
        );
        poolRef.current = null;
        fnStringRef.current = "";
      }
    };
  }, []);

  /**
   * Submits a task to the pool. Returns a [Promise<TResult>, taskId] tuple.
   * The taskId can be passed to cancel() to abort this specific task.
   *
   * NOTE: run() reads poolRef.current at call time (not at render time).
   * If called before the first useEffect fires (SSR or synchronous test),
   * pool will be null and the SSR rejection path fires.
   */
  const run = useCallback(
    (...args: TArgs): [Promise<TResult>, string] => {
      const taskId = nextTaskId();
      const pool = poolRef.current;

      if (!pool) {
        return [
          Promise.reject(
            new WorkerExecutionError(
              "Worker pool not yet initialized or unavailable (SSR).",
            ),
          ),
          taskId,
        ];
      }

      const promise = new Promise<TResult>((resolve, reject) => {
        const task: PoolTask = {
          id: taskId,
          args: args as unknown[],
          resolve: resolve as (v: unknown) => void,
          reject,
          timeoutHandle: null,
        };

        const idleEntry = pool.entries.find((e) => !e.busy);

        if (idleEntry) {
          assignTask(idleEntry, task, pool);
        } else if (pool.entries.length < pool.maxWorkers) {
          const entry = spawnWorker(pool.fnString, pool);
          pool.entries.push(entry);
          assignTask(entry, task, pool);
        } else {
          pool.queue.push(task);
        }

        updateCount(pool);
      });

      return [promise, taskId];
    },
    [], // stable — reads poolRef.current at call time
  );

  const cancel = useCallback((taskId?: string): void => {
    const pool = poolRef.current;
    if (!pool) return;

    if (taskId === undefined) {
      destroyPool(pool, new WorkerCancelledError("cancel-all"));
      poolRef.current = null;
      fnStringRef.current = "";
      onCountChangeRef.current(0, 0);
      return;
    }

    const queueIdx = pool.queue.findIndex((t) => t.id === taskId);
    if (queueIdx !== -1) {
      const [task] = pool.queue.splice(queueIdx, 1);
      if (task.timeoutHandle !== null) clearTimeout(task.timeoutHandle);
      task.reject(new WorkerCancelledError(taskId));
      updateCount(pool);
      return;
    }

    const active = pool.activeTasks.get(taskId);
    if (active) {
      const { entry, task } = active;
      if (task.timeoutHandle !== null) clearTimeout(task.timeoutHandle);
      pool.activeTasks.delete(taskId);
      task.reject(new WorkerCancelledError(taskId));
      terminateWorkerEntry(entry, pool);
      if (pool.entries.length < pool.maxWorkers) {
        const replacement = spawnWorker(pool.fnString, pool);
        pool.entries.push(replacement);
        drainQueue(pool);
      }
      updateCount(pool);
    }
  }, []);

  const terminate = useCallback((): void => {
    if (poolRef.current) {
      destroyPool(poolRef.current, new WorkerCancelledError("terminate-called"));
      poolRef.current = null;
      fnStringRef.current = "";
      onCountChangeRef.current(0, 0);
    }
  }, []);

  return {
    run,
    cancel,
    terminate,
    isRunning: counts.running > 0 || counts.queued > 0,
    pendingCount: counts.queued,
  };
}
