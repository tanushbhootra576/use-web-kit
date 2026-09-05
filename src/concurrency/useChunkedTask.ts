import { useCallback, useReducer, useRef } from "react";

export interface ChunkedTaskState<TOut> {
  isRunning: boolean;
  progress: number;
  result: TOut | null;
  error: Error | null;
}

type Action<TOut> =
  | { type: "START" }
  | { type: "PROGRESS"; progress: number }
  | { type: "SUCCESS"; result: TOut }
  | { type: "ERROR"; error: Error }
  | { type: "RESET" };

function reducer<TOut>(
  state: ChunkedTaskState<TOut>,
  action: Action<TOut>
): ChunkedTaskState<TOut> {
  switch (action.type) {
    case "START":
      return { isRunning: true, progress: 0, result: null, error: null };
    case "PROGRESS":
      return { ...state, progress: action.progress };
    case "SUCCESS":
      return { isRunning: false, progress: 1, result: action.result, error: null };
    case "ERROR":
      return { ...state, isRunning: false, error: action.error };
    case "RESET":
      return { isRunning: false, progress: 0, result: null, error: null };
    default:
      return state;
  }
}

function yieldToMain(): Promise<void> {
  if (typeof (globalThis as any).scheduler?.yield === "function") {
    return (globalThis as any).scheduler.yield();
  }
  if (typeof MessageChannel !== "undefined") {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => {
        resolve();
        channel.port1.close();
        channel.port2.close();
      };
      channel.port2.postMessage(null);
    });
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export interface UseChunkedTaskOptions {
  /**
   * Approximate maximum milliseconds to block the main thread before yielding.
   * Target < 16ms for 60fps, or < 50ms for INP limits.
   * @default 10
   */
  chunkTimeMs?: number;
}

export function useChunkedTask<TIn, TOut>(options: UseChunkedTaskOptions = {}) {
  const { chunkTimeMs = 10 } = options;
  const [state, dispatch] = useReducer(reducer<TOut[]>, {
    isRunning: false,
    progress: 0,
    result: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (
      items: TIn[],
      processor: (item: TIn, index: number) => TOut | Promise<TOut>
    ): Promise<TOut[]> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      dispatch({ type: "START" });

      const results: TOut[] = [];
      const total = items.length;
      let start = performance.now();

      try {
        for (let i = 0; i < total; i++) {
          if (controller.signal.aborted) {
            throw new Error("Task cancelled");
          }

          results.push(await processor(items[i], i));

          // Calculate time spent. Yield if we exceeded the chunk budget.
          const now = performance.now();
          if (now - start >= chunkTimeMs) {
            dispatch({ type: "PROGRESS", progress: i / total });
            await yieldToMain();
            start = performance.now(); // reset timer after yielding
          }
        }
        dispatch({ type: "SUCCESS", result: results });
        return results;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (error.message !== "Task cancelled") {
          dispatch({ type: "ERROR", error });
        }
        throw error;
      }
    },
    [chunkTimeMs]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    dispatch({ type: "RESET" });
  }, []);

  return { run, cancel, state };
}
