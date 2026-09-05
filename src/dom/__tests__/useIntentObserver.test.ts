import { renderHook, act } from "@testing-library/react";
import { useIntentObserver } from "../useIntentObserver";

describe("useIntentObserver", () => {
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    (global as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
      }
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };

    // Reset module state
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    delete (global as any).IntersectionObserver;
    jest.restoreAllMocks();
  });

  it("should initialize cleanly without crashing", () => {
    const onIntent = jest.fn();
    const { result } = renderHook(() => useIntentObserver({ onIntent }));
    expect(result.current.ref).toBeInstanceOf(Function);
  });

  it("should observe the element via IntersectionObserver", () => {
    const onIntent = jest.fn();
    const { result, unmount } = renderHook(() => useIntentObserver({ onIntent }));
    const node = document.createElement("button");

    let cleanup: any;
    act(() => {
      cleanup = result.current.ref(node);
    });

    expect(window.addEventListener).toHaveBeenCalledWith("mousemove", expect.any(Function), { passive: true });
    
    act(() => {
      if (cleanup) cleanup();
      unmount();
    });
  });

  it("should trigger onIntent when mouse moves quickly towards element", () => {
    const onIntent = jest.fn();
    const { result, unmount } = renderHook(() => useIntentObserver({ onIntent }));
    const node = document.createElement("div");

    let cleanup: any;
    act(() => {
      cleanup = result.current.ref(node);
    });

    // Mock IntersectionObserver triggering visibility
    act(() => {
      intersectionCallback(
        [
          {
            target: node,
            isIntersecting: true,
            boundingClientRect: { left: 500, right: 600, top: 500, bottom: 600 } as any,
          } as any,
        ],
        {} as any
      );
    });

    // Simulate mouse moves
    const moveListener = (window.addEventListener as jest.Mock).mock.calls.find((c) => c[0] === "mousemove")[1];

    act(() => {
      jest.spyOn(performance, "now").mockReturnValue(100);
      moveListener({ clientX: 0, clientY: 0 } as any);

      jest.spyOn(performance, "now").mockReturnValue(200); // 100ms later
      moveListener({ clientX: 200, clientY: 200 } as any); // velocity = 2.8px/ms (very fast)
    });

    expect(onIntent).toHaveBeenCalledTimes(1);

    act(() => {
      if (cleanup) cleanup();
      unmount();
    });
  });
});
