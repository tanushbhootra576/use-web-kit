import { renderHook, act, waitFor } from "@testing-library/react";
import { useMediaControls } from "../useMediaControls";

// Mock HTMLMediaElement
class MockMediaElement {
  paused = true;
  ended = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  muted = false;
  readyState = 0; // HAVE_NOTHING

  error: { message: string } | null = null;

  listeners: Record<string, Function[]> = {};

  addEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback,
      );
    }
  }

  dispatchEvent(event: Event) {
    if (this.listeners[event.type]) {
      this.listeners[event.type].forEach((callback) => callback(event));
    }
  }

  async play() {
    this.paused = false;
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }

  // Helper for testing
  _setDuration(duration: number) {
    this.duration = duration;
    this.dispatchEvent(new Event("durationchange"));
  }

  _setCurrentTime(time: number) {
    this.currentTime = time;
    this.dispatchEvent(new Event("timeupdate"));
  }

  _setVolume(volume: number) {
    this.volume = volume;
    this.dispatchEvent(new Event("volumechange"));
  }

  _setMuted(muted: boolean) {
    this.muted = muted;
    this.dispatchEvent(new Event("volumechange"));
  }

  _setEnded() {
    this.ended = true;
    this.paused = true;
    this.dispatchEvent(new Event("ended"));
  }

  _setReadyState(state: number) {
    this.readyState = state;
    this.dispatchEvent(new Event("canplay"));
  }

  _setError(message: string) {
    this.error = { message };
    this.dispatchEvent(new Event("error"));
  }
}

// Mock HTMLAudioElement and HTMLVideoElement
global.HTMLAudioElement = MockMediaElement as any;
global.HTMLVideoElement = MockMediaElement as any;

describe("useMediaControls", () => {
  let mockMedia: MockMediaElement;

  beforeEach(() => {
    mockMedia = new MockMediaElement();
    jest.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useMediaControls());

    expect(result.current.state).toEqual({
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
    expect(result.current.ref).toBeInstanceOf(Function);
  });

  it("updates state when media element is attached", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
      // Trigger events to update state
      mockMedia.dispatchEvent(new Event("loadedmetadata"));
    });

    expect(result.current.state.paused).toBe(true);
    expect(result.current.state.loading).toBe(true); // readyState < 4
  });

  it("plays media", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    const playSpy = jest.spyOn(mockMedia, "play");

    await act(async () => {
      await result.current.controls.play();
    });

    expect(playSpy).toHaveBeenCalled();
    expect(mockMedia.paused).toBe(false);
  });

  it("pauses media", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    const pauseSpy = jest.spyOn(mockMedia, "pause");

    act(() => {
      result.current.controls.pause();
    });

    expect(pauseSpy).toHaveBeenCalled();
    expect(mockMedia.paused).toBe(true);
  });

  it("seeks to time", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    mockMedia._setDuration(100);

    act(() => {
      result.current.controls.seek(50);
    });

    expect(mockMedia.currentTime).toBe(50);
  });

  it("clamps seek time to duration", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    mockMedia._setDuration(100);

    act(() => {
      result.current.controls.seek(150); // Should be clamped to 100
    });

    expect(mockMedia.currentTime).toBe(100);
  });

  it("sets volume", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    act(() => {
      result.current.controls.setVolume(0.5);
    });

    expect(mockMedia.volume).toBe(0.5);
  });

  it("clamps volume between 0 and 1", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    act(() => {
      result.current.controls.setVolume(2); // Should be clamped to 1
    });

    expect(mockMedia.volume).toBe(1);

    act(() => {
      result.current.controls.setVolume(-0.5); // Should be clamped to 0
    });

    expect(mockMedia.volume).toBe(0);
  });

  it("mutes and unmutes", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    act(() => {
      result.current.controls.mute();
    });

    expect(mockMedia.muted).toBe(true);

    act(() => {
      result.current.controls.unmute();
    });

    expect(mockMedia.muted).toBe(false);
  });

  it("toggles play state", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    const playSpy = jest.spyOn(mockMedia, "play");
    const pauseSpy = jest.spyOn(mockMedia, "pause");

    // Start paused
    expect(mockMedia.paused).toBe(true);

    await act(async () => {
      await result.current.controls.togglePlay();
    });

    expect(playSpy).toHaveBeenCalled();

    // Now playing
    mockMedia.paused = false;

    act(() => {
      result.current.controls.togglePlay();
    });

    expect(pauseSpy).toHaveBeenCalled();
  });

  it("toggles mute state", () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    // Start unmuted
    expect(mockMedia.muted).toBe(false);

    act(() => {
      result.current.controls.toggleMute();
    });

    expect(mockMedia.muted).toBe(true);

    act(() => {
      result.current.controls.toggleMute();
    });

    expect(mockMedia.muted).toBe(false);
  });

  it("updates state on play event", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    // Make sure the mock reflects a playing state before firing the
    // `play` event so the hook computes `playing` correctly.
    mockMedia.paused = false;
    await act(async () => {
      mockMedia.dispatchEvent(new Event("play"));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.playing).toBe(true);
      expect(result.current.state.paused).toBe(false);
    });
  });

  it("updates state on pause event", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    // Simulate the browser: paused transitions to true *before* the
    // "pause" event fires, so the hook reads the correct value.
    mockMedia.paused = false; // currently playing
    await act(async () => {
      mockMedia.paused = true; // reflect the paused state
      mockMedia.dispatchEvent(new Event("pause"));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.playing).toBe(false);
      expect(result.current.state.paused).toBe(true);
    });
  });

  it("updates state on ended event", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    await act(async () => {
      mockMedia._setEnded();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.ended).toBe(true);
      expect(result.current.state.playing).toBe(false);
      expect(result.current.state.paused).toBe(true);
    });
  });

  it("updates state on timeupdate event", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    await act(async () => {
      mockMedia._setCurrentTime(50);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.currentTime).toBe(50);
    });
  });

  it("updates state on durationchange event", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    await act(async () => {
      mockMedia._setDuration(120);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.duration).toBe(120);
    });
  });

  it("updates state on volumechange event", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    await act(async () => {
      mockMedia._setVolume(0.7);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.volume).toBe(0.7);
    });

    await act(async () => {
      mockMedia._setMuted(true);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.muted).toBe(true);
    });
  });

  it("updates loading state based on readyState", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    // Initially loading (readyState < 4)
    expect(result.current.state.loading).toBe(true);

    await act(async () => {
      mockMedia._setReadyState(4); // HAVE_ENOUGH_DATA
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
    });
  });

  it("handles error events", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    await act(async () => {
      mockMedia._setError("Media load failed");
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state.error).toBe("Media load failed");
    });
  });

  it("handles play errors gracefully", async () => {
    const { result } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    const playError = new Error("Play failed");
    jest.spyOn(mockMedia, "play").mockRejectedValue(playError);

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    await act(async () => {
      await result.current.controls.play();
    });

    expect(consoleSpy).toHaveBeenCalledWith("Failed to play media:", playError);
    expect(result.current.state.error).toBe("Play failed");

    consoleSpy.mockRestore();
  });

  it("cleans up event listeners on unmount", () => {
    const { result, unmount } = renderHook(() => useMediaControls());

    act(() => {
      result.current.ref(mockMedia as any);
    });

    const removeSpy = jest.spyOn(mockMedia, "removeEventListener");

    unmount();

    // Check that removeEventListener was called for all events
    expect(removeSpy).toHaveBeenCalledTimes(15); // Number of events we listen to
  });

  it("does nothing when no media element is attached", async () => {
    const { result } = renderHook(() => useMediaControls());

    // Don't attach media element

    await act(async () => {
      await result.current.controls.play();
    });

    act(() => {
      result.current.controls.pause();
    });

    act(() => {
      result.current.controls.seek(10);
    });

    act(() => {
      result.current.controls.setVolume(0.5);
    });

    act(() => {
      result.current.controls.mute();
    });

    // Should not throw and state should remain unchanged
    expect(result.current.state.playing).toBe(false);
    expect(result.current.state.currentTime).toBe(0);
    expect(result.current.state.volume).toBe(1);
    expect(result.current.state.muted).toBe(false);
  });
});
