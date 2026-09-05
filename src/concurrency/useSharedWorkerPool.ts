import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSharedWorkerPoolOptions {
  /** The URL to the SharedWorker script. */
  workerUrl: string | URL;
  /** Optional name for the SharedWorker, used to group instances. */
  name?: string;
  /**
   * If true, the hook will wait for the worker to broadcast a "ready" message
   * before sending tasks.
   * @default false
   */
  waitForReady?: boolean;
}

export interface UseSharedWorkerPoolReturn<TIn, TOut> {
  /** Sends a message to the SharedWorker and waits for a specific response. */
  postMessage: (message: TIn) => Promise<TOut>;
  /** True if the worker is connected and ready. */
  isReady: boolean;
  /** Broadcasts a message to the worker without waiting for a response. */
  broadcast: (message: TIn) => void;
  /** The latest broadcasted state/message from the worker (unsolicited). */
  latestMessage: any | null;
}

// Module-level registry for SharedWorker singletons
// Keyed by workerUrl + name
const workerRegistry = new Map<
  string,
  {
    worker: SharedWorker;
    subscribers: Set<(msg: any) => void>;
    isReady: boolean;
  }
>();

export function useSharedWorkerPool<TIn = any, TOut = any>({
  workerUrl,
  name,
  waitForReady = false,
}: UseSharedWorkerPoolOptions): UseSharedWorkerPoolReturn<TIn, TOut> {
  const [isReady, setIsReady] = useState(!waitForReady);
  const [latestMessage, setLatestMessage] = useState<any | null>(null);

  const registryKey = `${workerUrl.toString()}|${name || ""}`;
  const portRef = useRef<MessagePort | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof SharedWorker === "undefined") {
      return;
    }

    let record = workerRegistry.get(registryKey);

    if (!record) {
      const worker = new SharedWorker(workerUrl, { name });
      record = {
        worker,
        subscribers: new Set(),
        isReady: !waitForReady,
      };
      
      worker.port.start();
      workerRegistry.set(registryKey, record);
    }

    const { worker, subscribers } = record;
    portRef.current = worker.port;

    const handleMessage = (e: MessageEvent) => {
      // If waiting for ready, the worker should send { type: "READY" }
      if (waitForReady && !record!.isReady && e.data?.type === "READY") {
        record!.isReady = true;
        setIsReady(true);
        return;
      }
      
      // Notify all hook instances of the unsolicited broadcast
      subscribers.forEach((cb) => cb(e.data));
    };

    worker.port.addEventListener("message", handleMessage);
    
    const subscriber = (msg: any) => {
      setLatestMessage(msg);
    };
    
    subscribers.add(subscriber);

    // Initial ready state sync
    if (waitForReady && record.isReady) {
      setIsReady(true);
    }

    return () => {
      worker.port.removeEventListener("message", handleMessage);
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        // If we are the absolute last subscriber across all components,
        // we could optionally close the port. 
        // We won't kill the worker though, because it's a SharedWorker (other tabs might use it).
        // The browser cleans up SharedWorkers when ALL tabs close.
      }
    };
  }, [registryKey, waitForReady, workerUrl]);

  const postMessage = useCallback(
    (message: TIn, timeoutMs = 10000): Promise<TOut> => {
      return new Promise((resolve, reject) => {
        if (!portRef.current) {
          return reject(new Error("SharedWorker port is not initialized"));
        }

        const port = portRef.current;
        const messageId = Math.random().toString(36).substring(2, 11);

        let timeoutId: ReturnType<typeof setTimeout>;

        const handleResponse = (e: MessageEvent) => {
          if (e.data?.messageId === messageId) {
            clearTimeout(timeoutId);
            port.removeEventListener("message", handleResponse);
            if (e.data.error) {
              reject(new Error(e.data.error));
            } else {
              resolve(e.data.result as TOut);
            }
          }
        };

        timeoutId = setTimeout(() => {
          port.removeEventListener("message", handleResponse);
          reject(new Error(`Worker response timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        port.addEventListener("message", handleResponse);
        port.postMessage({ messageId, payload: message });
      });
    },
    []
  );

  const broadcast = useCallback((message: TIn) => {
    if (portRef.current) {
      portRef.current.postMessage({ payload: message });
    }
  }, []);

  return {
    postMessage,
    broadcast,
    isReady,
    latestMessage,
  };
}
