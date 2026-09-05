"use client";

import { useCallback, useReducer } from "react";
import type { UseViewTransitionReturn } from "../core/types";

interface State {
  isTransitioning: boolean;
  isSupported: boolean;
}

type Action = 
  | { type: "START" }
  | { type: "FINISH" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { ...state, isTransitioning: true };
    case "FINISH":
      return { ...state, isTransitioning: false };
    default:
      return state;
  }
}

/**
 * Wraps the native View Transitions API with a React-safe wrapper.
 * Falls back gracefully if API not supported.
 */
export function useViewTransition(): UseViewTransitionReturn {
  const [state, dispatch] = useReducer(reducer, {
    isTransitioning: false,
    isSupported: typeof document !== "undefined" && "startViewTransition" in document,
  });

  const startTransition = useCallback(async (updateFn: () => void | Promise<void>) => {
    if (!state.isSupported) {
      await updateFn();
      return;
    }

    dispatch({ type: "START" });

    try {
      const transition = (document as any).startViewTransition(updateFn);
      await transition.finished;
    } finally {
      dispatch({ type: "FINISH" });
    }
  }, [state.isSupported]);

  return {
    startTransition,
    isTransitioning: state.isTransitioning,
    isSupported: state.isSupported,
  };
}
