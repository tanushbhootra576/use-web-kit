import { useCallback, useReducer, useEffect } from "react";

interface ClipboardState {
  copied: boolean;
  error: Error | null;
}

type ClipboardAction = 
  | { type: "COPY_START" }
  | { type: "COPY_SUCCESS" }
  | { type: "COPY_ERROR"; error: Error }
  | { type: "RESET" };

function clipboardReducer(state: ClipboardState, action: ClipboardAction): ClipboardState {
  switch (action.type) {
    case "COPY_START":
      return { copied: false, error: null };
    case "COPY_SUCCESS":
      return { copied: true, error: null };
    case "COPY_ERROR":
      return { copied: false, error: action.error };
    case "RESET":
      return { copied: false, error: null };
    default:
      return state;
  }
}

export function useClipboard(resetDelay = 2000): {
  copy: (text: string) => Promise<void>;
  copied: boolean;
  error: Error | null;
} {
  const [state, dispatch] = useReducer(clipboardReducer, {
    copied: false,
    error: null,
  });

  const copy = useCallback(
    async (text: string) => {
      if (typeof window === "undefined" || !navigator.clipboard) {
        dispatch({ type: "COPY_ERROR", error: new Error("Clipboard API not available") });
        return;
      }

      dispatch({ type: "COPY_START" });
      try {
        await navigator.clipboard.writeText(text);
        dispatch({ type: "COPY_SUCCESS" });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        dispatch({ type: "COPY_ERROR", error });
      }
    },
    []
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    if (state.copied) {
      timeoutId = setTimeout(() => {
        dispatch({ type: "RESET" });
      }, resetDelay);
    }
    
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.copied, resetDelay]);

  return { copy, copied: state.copied, error: state.error };
}
