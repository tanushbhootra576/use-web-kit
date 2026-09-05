"use client";

import { useCallback, useReducer } from "react";
import type { UseOptimisticQueueReturn } from "../core/types";

interface QueueItem<T> {
  id: string;
  previousItems: T[];
  serverCall: () => Promise<T[]>;
}

interface State<T> {
  items: T[];
  queue: QueueItem<T>[];
  error: Error | null;
}

type Action<T> = 
  | { type: "ENQUEUE"; item: T; id: string; serverCall: () => Promise<T[]> }
  | { type: "COMMIT"; id: string; resultItems: T[] }
  | { type: "ROLLBACK"; id: string; error: Error };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "ENQUEUE":
      return {
        ...state,
        items: [...state.items, action.item],
        queue: [...state.queue, {
          id: action.id,
          previousItems: state.items,
          serverCall: action.serverCall,
        }],
        error: null,
      };
    case "COMMIT":
      return {
        ...state,
        items: action.resultItems,
        queue: state.queue.filter(q => q.id !== action.id),
      };
    case "ROLLBACK": {
      const failedIndex = state.queue.findIndex(q => q.id === action.id);
      if (failedIndex === -1) return state;
      const failedItem = state.queue[failedIndex];
      return {
        ...state,
        items: failedItem.previousItems,
        queue: state.queue.slice(0, failedIndex),
        error: action.error,
      };
    }
    default:
      return state;
  }
}

/**
 * Manages a queue of optimistic mutations with automatic rollback on server error.
 */
export function useOptimisticQueue<T>(initialItems: T[]): UseOptimisticQueueReturn<T> {
  const [state, dispatch] = useReducer(
    reducer as (state: State<T>, action: Action<T>) => State<T>, 
    {
      items: initialItems,
      queue: [],
      error: null,
    }
  );

  const enqueue = useCallback((optimisticItem: T, serverCall: () => Promise<T[]>) => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    
    dispatch({ type: "ENQUEUE", item: optimisticItem, id, serverCall });
    
    serverCall()
      .then((resultItems) => {
        dispatch({ type: "COMMIT", id, resultItems });
      })
      .catch((error) => {
        dispatch({ type: "ROLLBACK", id, error: error instanceof Error ? error : new Error(String(error)) });
      });
  }, []);

  return {
    items: state.items,
    enqueue,
    isPending: state.queue.length > 0,
    error: state.error,
  };
}
