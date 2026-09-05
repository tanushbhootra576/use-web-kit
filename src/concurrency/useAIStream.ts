import { useCallback, useReducer, useRef } from "react";
import type { UseAIStreamReturn, AIStreamState } from "../core/types";

type Action =
  | { type: "START" }
  | { type: "CHUNK"; chunk: string }
  | { type: "DONE" }
  | { type: "ERROR"; error: Error }
  | { type: "RESET" };

function reducer(state: AIStreamState, action: Action): AIStreamState {
  switch (action.type) {
    case "START":
      return { text: "", done: false, error: null, streaming: true };
    case "CHUNK":
      return { ...state, text: state.text + action.chunk };
    case "DONE":
      return { ...state, done: true, streaming: false };
    case "ERROR":
      return { ...state, error: action.error, streaming: false };
    case "RESET":
      return { text: "", done: false, error: null, streaming: false };
    default:
      return state;
  }
}

export function useAIStream(): UseAIStreamReturn {
  const [state, dispatch] = useReducer(reducer, {
    text: "",
    done: false,
    error: null,
    streaming: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const stream = useCallback(async (source: Response | ReadableStream<Uint8Array>) => {
    abort(); // Cancel previous stream if any
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    dispatch({ type: "START" });

    try {
      let readableStream: ReadableStream<Uint8Array>;
      
      if (source instanceof Response) {
        if (!source.body) {
          throw new Error("Response body is empty");
        }
        readableStream = source.body;
      } else {
        readableStream = source;
      }

      const reader = readableStream.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        if (controller.signal.aborted) {
          throw new Error("Stream cancelled");
        }

        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // Basic handling of Server-Sent Events (SSE) format
          const lines = chunk.split("\n");
          let textChunk = "";
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                continue;
              }
              try {
                // Try to parse as JSON if it's SSE JSON chunks (common in OpenAI compatible APIs)
                const parsed = JSON.parse(data);
                // Extract common text fields if present, else just append raw string
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  textChunk += parsed.choices[0].delta.content;
                } else if (parsed.response) { // Ollama style
                   textChunk += parsed.response;
                } else {
                   textChunk += data;
                }
              } catch (e) {
                // If not JSON, just append the raw data
                textChunk += data;
              }
            } else if (!line.startsWith("event:") && line.trim() !== "") {
              // Raw text stream fallback
              textChunk += line + "\n";
            }
          }
          
          // If no specific SSE processing resulted in text, maybe it's just raw text without SSE format
          if (!textChunk && chunk && !chunk.includes("data: ")) {
             textChunk = chunk;
          }

          if (textChunk) {
            dispatch({ type: "CHUNK", chunk: textChunk });
          }
        }
      }

      dispatch({ type: "DONE" });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.message !== "Stream cancelled") {
        dispatch({ type: "ERROR", error });
      } else {
        dispatch({ type: "DONE" }); // Stop streaming cleanly on abort
      }
    }
  }, [abort]);

  return {
    ...state,
    stream,
    abort,
  };
}
