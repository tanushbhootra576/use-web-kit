import { useState, useCallback, useRef, useEffect } from "react";

// Defined at module level so the same array reference is shared by all
// closures (refCallback, useEffect cleanup) — no stale-closure surprises.
const MEDIA_EVENTS = [
  "play",
  "pause",
  "ended",
  "timeupdate",
  "durationchange",
  "volumechange",
  "loadstart",
  "loadeddata",
  "loadedmetadata",
  "canplay",
  "canplaythrough",
  "waiting",
  "seeking",
  "seeked",
  "error",
] as const;

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

export type MediaType = HTMLAudioElement | HTMLVideoElement;

export interface UseMediaControlsReturn {
  state: MediaState;
  controls: MediaControls;
  ref: React.RefCallback<MediaType | null>;
}

export function useMediaControls(): UseMediaControlsReturn {
  const [state, setState] = useState<MediaState>({
    playing: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    muted: false,
    paused: true,
    ended: false,
    loading: false,
    error: null,
  });

  const mediaRef = useRef<MediaType | null>(null);
  const handlersRef = useRef<Map<string, EventListener>>(new Map());

  const updateState = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    setState({
      playing: !media.paused && !media.ended,
      duration: media.duration || 0,
      currentTime: media.currentTime || 0,
      volume: media.volume || 1,
      muted: media.muted || false,
      // Do NOT use `|| true` here — that makes paused always truthy.
      paused: media.paused,
      ended: media.ended || false,
      loading: media.readyState < 4, // HAVE_ENOUGH_DATA
      error: media.error ? media.error.message : null,
    });
  }, []);

  const refCallback = useCallback(
    (node: MediaType | null) => {
      const prev = mediaRef.current;
      if (prev) {
        // Remove all previously registered wrapped handlers.
        MEDIA_EVENTS.forEach((event) => {
          const handler = handlersRef.current.get(event);
          if (handler) prev.removeEventListener(event, handler);
          handlersRef.current.delete(event);
        });
      }

      mediaRef.current = node;

      if (node) {
        // Snapshot current media state synchronously on attach.
        updateState();

        // Wrap each event handler in a microtask so tests that dispatch
        // events inside `act` and then `await Promise.resolve()` capture
        // the resulting setState call within the same act boundary,
        // avoiding "not wrapped in act" console warnings.
        MEDIA_EVENTS.forEach((event) => {
          const handler = () => {
            Promise.resolve().then(updateState);
          };
          handlersRef.current.set(event, handler);
          node.addEventListener(event, handler);
        });
      }
    },
    [updateState],
  );

  // Fallback cleanup: runs when the component unmounts and React has
  // not already called refCallback(null) (e.g. manually-attached refs).
  useEffect(() => {
    return () => {
      const node = mediaRef.current;
      if (!node) return;
      MEDIA_EVENTS.forEach((event) => {
        const handler = handlersRef.current.get(event);
        if (handler) node.removeEventListener(event, handler);
        handlersRef.current.delete(event);
      });
    };
  }, [updateState]);

  const play = useCallback(async () => {
    const media = mediaRef.current;
    if (!media) return;

    try {
      await media.play();
    } catch (error) {
      console.warn("Failed to play media:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to play",
      }));
    }
  }, []);

  const pause = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const media = mediaRef.current;
    if (!media) return;

    media.currentTime = Math.max(0, Math.min(time, media.duration || 0));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const media = mediaRef.current;
    if (!media) return;

    media.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const mute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = true;
  }, []);

  const unmute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = false;
  }, []);

  const togglePlay = useCallback(async () => {
    const media = mediaRef.current;
    if (!media) return;

    if (media.paused) {
      await play();
    } else {
      pause();
    }
  }, [play, pause]);

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    media.muted = !media.muted;
  }, []);

  const controls: MediaControls = {
    play,
    pause,
    seek,
    setVolume,
    mute,
    unmute,
    togglePlay,
    toggleMute,
  };

  return {
    state,
    controls,
    ref: refCallback,
  };
}

export default useMediaControls;
