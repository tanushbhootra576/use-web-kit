/**
 * @fileoverview useEventPipeline & useActionPipeline — Composable functional
 * event and form-action streams for React 19.
 *
 * ─── ARCHITECTURE OVERVIEW ────────────────────────────────────────────────────
 *
 * CORE CONCEPT — THE PIPELINE:
 *   A pipeline is an ordered array of pure stage functions. Each stage receives
 *   the output of the previous stage and returns either:
 *     a) Transformed data      → pipeline continues with the new value
 *     b) PIPELINE_SKIP symbol  → pipeline silently cancels (no state update)
 *     c) throws                → pipeline fails (error state set)
 *
 *   Stages are async-capable: returning a Promise is fully supported. This
 *   enables debounce (timer-based Promise), remote validation, async transforms,
 *   and Server Action integration — all within the same composable model.
 *
 * CANCELLATION — AbortController per invocation:
 *   Every handler/formAction call creates a new AbortController. If a new call
 *   arrives while a previous pipeline is in-flight (e.g., user types fast):
 *     1. The old controller is aborted — its pipeline is orphaned immediately.
 *     2. Orphaned pipelines check signal.aborted between stages and bail.
 *     3. No state update fires for an aborted pipeline.
 *   Component unmount also aborts the active controller, guaranteeing zero
 *   setState-after-unmount calls.
 *
 * MEMORY SAFETY:
 *   - No module-level mutable state in the hooks themselves.
 *   - Stage factories (debounce, throttle, dedupe) hold state in closures;
 *     their lifetime is tied to the stages[] array the consumer creates.
 *   - AbortController refs are replaced (not accumulated) on each invocation.
 *   - useEffect cleanup aborts the controller on unmount.
 *
 * PERFORMANCE:
 *   - handler/formAction are stable (useCallback with empty deps) — they read
 *     stages and options from refs, never capturing stale closures.
 *   - useReducer (not two useState calls) — one dispatch = one re-render.
 *   - debounce stage uses a Promise that resolves on a timer; rapid calls
 *     resolve prior Promises with PIPELINE_SKIP before starting the timer,
 *     ensuring only one pipeline completion per debounce window.
 *
 * SSR SAFETY:
 *   - No BOM access at module load time.
 *   - AbortController is available in Node 18+ (Next.js runtime); the hook
 *     body runs only on the client since it requires user interaction.
 *
 * @module useEventPipeline
 */

"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  type SyntheticEvent,
} from "react";
import type { UseEventPipelineOptions, UseEventPipelineReturn, UseActionPipelineOptions, UseActionPipelineReturn, PipelineSkip, PipelineStage, AnyPipelineStage } from "../core/types";

// ─── Core Pipeline Types ──────────────────────────────────────────────────────

/**
 * Sentinel symbol returned by a stage to silently cancel the pipeline.
 * No state update, no error — the invocation is simply discarded.
 *
 * @example
 * ```ts
 * // Custom stage that skips empty strings:
 * const skipEmpty: PipelineStage<string, string> = (input) =>
 *   input.trim() === "" ? PIPELINE_SKIP : input;
 * ```
 */
export const PIPELINE_SKIP: unique symbol = Symbol("PIPELINE_SKIP");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// ─── Pipeline Execution Engine ────────────────────────────────────────────────

/**
 * Executes an ordered array of stages sequentially, threading the output of
 * each stage as the input to the next. Checks signal.aborted between every
 * stage so abandoned pipelines exit immediately without doing extra work.
 *
 * @returns The final stage's output, or PIPELINE_SKIP if any stage skipped
 *          or the signal was aborted mid-flight.
 */
async function runPipeline<TOut>(
  input: unknown,
  stages: AnyPipelineStage[],
  signal: AbortSignal,
): Promise<TOut | PipelineSkip> {
  let current: unknown = input;

  for (const stage of stages) {
    // Check abort before every stage — cheap O(1) property read.
    if (signal.aborted) return PIPELINE_SKIP;

    // Await the stage (sync stages resolve immediately, no cost).
    const result = await stage(current, signal);

    // A stage signalled skip → abandon the pipeline without error.
    if (result === PIPELINE_SKIP) return PIPELINE_SKIP;

    // Check again after the await — the signal may have fired while this
    // stage's Promise was pending (e.g., during a debounce timer).
    if (signal.aborted) return PIPELINE_SKIP;

    current = result;
  }

  return current as TOut;
}

// ─── Shared Reducer ───────────────────────────────────────────────────────────

interface PipelineState<TOut> {
  value: TOut | null;
  error: Error | null;
  isPending: boolean;
}

type PipelineAction<TOut> =
  | { type: "PENDING" }
  | { type: "SUCCESS"; payload: TOut }
  | { type: "ERROR"; payload: Error }
  | { type: "RESET" };

function pipelineReducer<TOut>(
  state: PipelineState<TOut>,
  action: PipelineAction<TOut>,
): PipelineState<TOut> {
  switch (action.type) {
    case "PENDING":
      return { ...state, isPending: true, error: null };
    case "SUCCESS":
      return { value: action.payload, error: null, isPending: false };
    case "ERROR":
      return { ...state, error: action.payload, isPending: false };
    case "RESET":
      return { value: null, error: null, isPending: false };
  }
}

// ─── Built-in Stage Factories ─────────────────────────────────────────────────

/**
 * Delays pipeline execution by `ms` milliseconds. If a new invocation arrives
 * before the timer fires, the previous pending invocation receives PIPELINE_SKIP
 * and the timer resets. Only the final invocation in a burst completes.
 *
 * STATE SAFETY: The timer and resolver live in the factory closure — they are
 * shared across all invocations of the pipeline that use this stage instance.
 * Create a new debounce() call per pipeline (do not share instances).
 *
 * @example `useEventPipeline([debounce(300), validate(isEmail)], ...)`
 */
export function debounce<T>(ms: number): PipelineStage<T, T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let previousResolve: ((v: T | PipelineSkip) => void) | null = null;

  return (input: T, signal: AbortSignal): Promise<T | PipelineSkip> =>
    new Promise((resolve) => {
      // Cancel the previous pending timer and resolve its Promise with SKIP.
      if (timer !== null) {
        clearTimeout(timer);
        previousResolve?.(PIPELINE_SKIP);
      }
      previousResolve = resolve;
      timer = setTimeout(() => {
        timer = null;
        previousResolve = null;
        resolve(input);
      }, ms);

      // AUDIT FIX: Cancel the pending timer immediately when the pipeline is
      // aborted (component unmount or new handler call arriving). Without this,
      // the setTimeout fires after `ms` ms even on unmounted components, wasting
      // a timer slot. The dispatch is already blocked by the signal guard in the
      // hook body, so this is a performance fix, not a correctness one — but
      // it eliminates the dangling timer category of resource leak entirely.
      signal.addEventListener(
        "abort",
        () => {
          if (timer !== null) {
            clearTimeout(timer);
            timer = null;
          }
          previousResolve?.(PIPELINE_SKIP);
          previousResolve = null;
        },
        { once: true }, // auto-removes listener after firing — no cleanup needed
      );
    });
}


/**
 * Passes input through at most once per `ms` window. Calls that arrive during
 * the cooldown period receive PIPELINE_SKIP immediately — no queuing.
 *
 * Use throttle for rate-limiting scroll/mousemove handlers. Use debounce for
 * search inputs where you want the final value after typing stops.
 */
export function throttle<T>(ms: number): PipelineStage<T, T> {
  let lastRun = 0;
  return (input: T): T | PipelineSkip => {
    const now = Date.now();
    if (now - lastRun < ms) return PIPELINE_SKIP;
    lastRun = now;
    return input;
  };
}

/**
 * Skips the pipeline if the input is strictly equal to the previous input.
 * Prevents redundant state updates when the user submits the same value twice.
 *
 * @param compareFn - Custom equality check. Defaults to Object.is (strict equality).
 */
export function dedupe<T>(
  compareFn: (a: T, b: T) => boolean = Object.is,
): PipelineStage<T, T> {
  let hasValue = false;
  let lastValue: T;
  return (input: T): T | PipelineSkip => {
    if (hasValue && compareFn(lastValue, input)) return PIPELINE_SKIP;
    hasValue = true;
    lastValue = input;
    return input;
  };
}

/**
 * Applies a pure string transformation (sanitization) to the input.
 * Use with the built-in `Sanitizers` helpers or any custom function.
 *
 * @example `sanitize(Sanitizers.trim)`, `sanitize(v => v.replace(/\s+/g, ' '))`
 */
export function sanitize(
  fn: (value: string) => string,
): PipelineStage<string, string> {
  return (input: string) => fn(input);
}

/**
 * Common string sanitization functions for use with the `sanitize()` stage.
 */
export const Sanitizers = {
  trim: (v: string) => v.trim(),
  lowercase: (v: string) => v.toLowerCase(),
  uppercase: (v: string) => v.toUpperCase(),
  /** Removes all HTML tags from a string. */
  stripHtml: (v: string) => v.replace(/<[^>]*>/g, ""),
  /** Collapses multiple whitespace characters into a single space. */
  collapseWhitespace: (v: string) => v.replace(/\s+/g, " ").trim(),
} as const;

/**
 * Validates the input against a predicate. If the predicate returns false (or
 * a string error message), the pipeline fails with an Error containing the message.
 *
 * @param predicate - Returns true if valid, false or a string message if invalid.
 * @param errorMessage - Fallback message when predicate returns false.
 */
export function validate<T>(
  predicate: (value: T) => boolean | string,
  errorMessage = "Validation failed",
): PipelineStage<T, T> {
  return (input: T): T => {
    const result = predicate(input);
    if (result === true) return input;
    throw new Error(typeof result === "string" ? result : errorMessage);
  };
}

/**
 * Applies a pure transformation function to the input value, changing its type
 * or shape. Unlike `sanitize` (string → string), `transform` is fully generic.
 *
 * @example `transform((s: string) => parseInt(s, 10))`
 * @example `transform((fd: FormData) => Object.fromEntries(fd))`
 */
export function transform<TIn, TOut>(
  fn: (value: TIn) => TOut,
): PipelineStage<TIn, TOut> {
  return (input: TIn) => fn(input);
}

/**
 * Extracts a value from a synthetic or native DOM event. Typically used as
 * the **first stage** of a `useEventPipeline` to pull the target value from
 * the raw event object before subsequent stages process the plain value.
 *
 * @param extractor - Custom extractor. Defaults to `event.target.value`.
 *
 * @example
 * ```ts
 * // Input pipeline: Event → string → validated string
 * const stages = [fromEvent(), validate(isEmail), debounce(300)];
 * ```
 */
export function fromEvent<
  TEvent extends Event | SyntheticEvent = SyntheticEvent,
>(
  extractor: (e: TEvent) => unknown = (e) =>
    (e.target as HTMLInputElement)?.value ?? "",
): PipelineStage<TEvent, unknown> {
  return (event: TEvent) => extractor(event);
}

/**
 * Extracts one or more fields from a `FormData` object. Typically used as the
 * **first stage** of a `useActionPipeline`.
 *
 * @param fields - A single field name (returns string), an array of field names
 *   (returns `Record<string, string>`), or omit to return all fields as a record.
 *
 * @example
 * ```ts
 * // Extract a single field:
 * const stages = [fromFormData("email"), validate(isEmail)];
 *
 * // Extract multiple fields:
 * const stages = [fromFormData(["email", "name"]), validate(isValidUser)];
 * ```
 */
export function fromFormData(
  fields?: string | string[],
): PipelineStage<FormData, string | Record<string, string>> {
  return (formData: FormData): string | Record<string, string> => {
    if (fields === undefined) {
      const result: Record<string, string> = {};
      formData.forEach((value, key) => {
        result[key] = String(value);
      });
      return result;
    }
    if (typeof fields === "string") {
      return String(formData.get(fields) ?? "");
    }
    const result: Record<string, string> = {};
    fields.forEach((key) => {
      result[key] = String(formData.get(key) ?? "");
    });
    return result;
  };
}

// ─── useEventPipeline ─────────────────────────────────────────────────────────

/**
 * `useEventPipeline` — Composable event processing for React 19.
 *
 * @description
 * Transforms raw DOM/synthetic events through an ordered sequence of pure stage
 * functions before committing a React state update. Supports debounce, throttle,
 * dedupe, validation, and arbitrary async transforms — all composable and cancellable.
 *
 * **Cancellation**: Each handler call aborts the previous in-flight pipeline. The
 * most recently initiated invocation always wins. Aborted pipelines produce no
 * state updates.
 *
 * **Stability**: `handler` has a stable identity across renders (useCallback with
 * empty deps). Stages and options are read from refs — no stale closures.
 *
 * @param stages - Ordered array of pipeline stages. Create stage instances outside
 *   the component (or in useMemo) to preserve their internal state across renders.
 * @param options - Completion and error callbacks.
 *
 * @see {@link https://react.dev/reference/react/useCallback | React: useCallback}
 *
 * @example Debounced search input with validation:
 * ```tsx
 * "use client";
 * import { useEventPipeline, fromEvent, debounce, validate } from "use-web-kit";
 *
 * const stages = [
 *   fromEvent(),              // Event → string (input value)
 *   sanitize(Sanitizers.trim),
 *   validate(v => v.length >= 2 || "Minimum 2 characters"),
 *   debounce(400),            // wait 400ms after last keystroke
 * ];
 *
 * export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
 *   const { handler, value, error, isPending } = useEventPipeline<
 *     React.ChangeEvent<HTMLInputElement>,
 *     string
 *   >(stages, { onComplete: onSearch });
 *
 *   return (
 *     <div>
 *       <input onChange={handler} />
 *       {isPending && <Spinner />}
 *       {error && <p>{error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useEventPipeline<
  TEvent extends Event | SyntheticEvent = SyntheticEvent,
  TOut = unknown,
>(
  stages: AnyPipelineStage[],
  options: UseEventPipelineOptions<TOut> = {},
): UseEventPipelineReturn<TEvent, TOut> {
  // useReducer: single dispatch → single re-render (vs. two useState calls).
  const [state, dispatch] = useReducer(
    pipelineReducer as (
      s: PipelineState<TOut>,
      a: PipelineAction<TOut>,
    ) => PipelineState<TOut>,
    { value: null, error: null, isPending: false },
  );

  // Refs for latest stages and options — keeps handler stable (empty dep array)
  // while always reading the most up-to-date values. Prevents stale closures
  // without needing to recreate the handler on every render.
  const stagesRef = useRef(stages);
  stagesRef.current = stages;
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Tracks the AbortController for the currently running pipeline invocation.
  // Replaced (not accumulated) on each handler call.
  const controllerRef = useRef<AbortController | null>(null);

  // MEMORY SAFETY: Abort any in-flight pipeline when the component unmounts.
  // This prevents a resolved Promise from calling dispatch on an unmounted component.
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const handler = useCallback((event: TEvent): void => {
    // Cancel the previous in-flight pipeline (if any).
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    dispatch({ type: "PENDING" });

    runPipeline<TOut>(event, stagesRef.current, controller.signal)
      .then((result) => {
        // Guard: if aborted mid-flight or the pipeline skipped, do nothing.
        if (controller.signal.aborted || result === PIPELINE_SKIP) return;
        dispatch({ type: "SUCCESS", payload: result });
        optionsRef.current.onComplete?.(result);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const err = error instanceof Error ? error : new Error(String(error));
        dispatch({ type: "ERROR", payload: err });
        optionsRef.current.onError?.(err);
      });
  }, []); // stable — all live values are read from refs

  const reset = useCallback((): void => {
    controllerRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return {
    handler,
    value: state.value,
    error: state.error,
    isPending: state.isPending,
    reset,
  };
}

// ─── useActionPipeline ────────────────────────────────────────────────────────

/**
 * `useActionPipeline` — Composable FormData processing for React 19 form actions.
 *
 * @description
 * Processes `FormData` from a React 19 `<form action>` through a pipeline of
 * pure stage functions before invoking a Server Action or local handler.
 * Supports extraction, sanitization, validation, and async transforms — all
 * with automatic cancellation and zero memory leaks.
 *
 * **React 19 Integration**: The returned `formAction` is compatible with both
 * `<form action={formAction}>` and `useTransition`-based imperative calls.
 *
 * @param stages - Ordered pipeline stages. The first stage typically uses
 *   `fromFormData()` to extract fields from the raw FormData.
 * @param options - Server action, completion, and error callbacks.
 *
 * @see {@link https://react.dev/reference/react-dom/components/form | React 19: form action}
 *
 * @example Contact form with validation and Server Action:
 * ```tsx
 * "use client";
 * import { useActionPipeline, fromFormData, sanitize, validate, Sanitizers } from "use-web-kit";
 *
 * // Defined outside component to preserve debounce/dedupe state:
 * const stages = [
 *   fromFormData(["name", "email", "message"]),
 *   validate((d) => d.email.includes("@") || "Invalid email"),
 *   transform((d) => ({ ...d, name: d.name.trim() })),
 * ];
 *
 * export function ContactForm({ submitAction }: { submitAction: ServerAction }) {
 *   const { formAction, isPending, error, value } = useActionPipeline<ContactPayload>(
 *     stages,
 *     { action: submitAction, onComplete: () => router.push("/thank-you") },
 *   );
 *
 *   return (
 *     <form action={formAction}>
 *       <input name="name" required />
 *       <input name="email" type="email" required />
 *       <textarea name="message" required />
 *       <button disabled={isPending}>{isPending ? "Sending…" : "Send"}</button>
 *       {error && <p role="alert">{error.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example Callback-driven mode (no Server Action):
 * ```tsx
 * const { formAction, value } = useActionPipeline<SearchParams>(stages, {
 *   onComplete: (params) => router.push(`/search?q=${params.query}`),
 * });
 * ```
 */
export function useActionPipeline<TOut = FormData>(
  stages: AnyPipelineStage[],
  options: UseActionPipelineOptions<TOut> = {},
): UseActionPipelineReturn<TOut> {
  const [state, dispatch] = useReducer(
    pipelineReducer as (
      s: PipelineState<TOut>,
      a: PipelineAction<TOut>,
    ) => PipelineState<TOut>,
    { value: null, error: null, isPending: false },
  );

  const stagesRef = useRef(stages);
  stagesRef.current = stages;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const formAction = useCallback(async (formData: FormData): Promise<void> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    dispatch({ type: "PENDING" });

    try {
      const result = await runPipeline<TOut>(
        formData,
        stagesRef.current,
        controller.signal,
      );

      if (controller.signal.aborted || result === PIPELINE_SKIP) return;

      // Invoke the Server Action (or local async handler) with the processed data.
      // This runs AFTER all pipeline stages pass — never with invalid/unsanitized data.
      const { action, onComplete } = optionsRef.current;
      if (action) await action(result);

      if (controller.signal.aborted) return;

      dispatch({ type: "SUCCESS", payload: result });
      onComplete?.(result);
    } catch (error: unknown) {
      if (controller.signal.aborted) return;
      const err = error instanceof Error ? error : new Error(String(error));
      dispatch({ type: "ERROR", payload: err });
      optionsRef.current.onError?.(err);
    }
  }, []); // stable — all live values read from refs

  const reset = useCallback((): void => {
    controllerRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return {
    formAction,
    value: state.value,
    isPending: state.isPending,
    error: state.error,
    reset,
  };
}

// ─── Usage Examples ────────────────────────────────────────────────────────────
/**
 * @example STAGE ORDER GUIDE — Most common composition patterns
 *
 * ```ts
 * // 1. Input event → debounced validated string
 * const searchStages = [
 *   fromEvent(),                            // SyntheticEvent → string
 *   sanitize(Sanitizers.trim),              // strip whitespace
 *   validate(v => v.length > 1 || "Too short"),
 *   debounce(300),                          // wait for typing to pause
 * ];
 *
 * // 2. FormData → sanitized validated record → Server Action
 * const loginStages = [
 *   fromFormData(["email", "password"]),    // FormData → { email, password }
 *   transform(d => ({ ...d, email: d.email.toLowerCase() })),
 *   validate(d => d.password.length >= 8 || "Password too short"),
 * ];
 *
 * // 3. Throttled scroll tracking (callback mode, zero re-renders)
 * const scrollStages = [
 *   fromEvent((e: Event) => (e.target as Element).scrollTop),
 *   throttle(100),
 *   dedupe(),
 * ];
 * const { handler } = useEventPipeline(scrollStages, {
 *   onComplete: (scrollTop) => analytics.track("scroll", { scrollTop }),
 * });
 * ```
 *
 * @example CREATING A CUSTOM STAGE
 *
 * ```ts
 * import { PipelineStage, PIPELINE_SKIP } from "use-web-kit";
 *
 * // Async validation against an API endpoint:
 * const remoteValidate: PipelineStage<string, string> = async (email, signal) => {
 *   const res = await fetch(`/api/check-email?email=${email}`, { signal });
 *   const { available } = await res.json();
 *   if (!available) throw new Error("Email already registered");
 *   return email;
 * };
 *
 * // Note: the AbortSignal is forwarded to fetch(), so in-flight requests are
 * // automatically cancelled when a new pipeline invocation aborts the old one.
 * ```
 */
