import { renderHook, act } from "@testing-library/react";
import { useElementDimensions } from "../useElementDimensions";

describe("useElementDimensions", () => {
  let resizeCallback: ResizeObserverCallback;
  
  beforeEach(() => {
    (global as any).ResizeObserver = class {
      constructor(cb: ResizeObserverCallback) {
        resizeCallback = cb;
      }
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
  });

  afterEach(() => {
    delete (global as any).ResizeObserver;
  });

  it("should initialize with null dimensions", () => {
    const { result } = renderHook(() => useElementDimensions());
    expect(result.current.dimensions).toBeNull();
  });

  it("should update dimensions when ResizeObserver triggers", () => {
    const { result } = renderHook(() => useElementDimensions());
    const node = document.createElement("div");

    act(() => {
      result.current.ref(node);
    });

    act(() => {
      resizeCallback(
        [
          {
            target: node,
            contentRect: { width: 100, height: 200, x: 0, y: 0, top: 0, right: 100, bottom: 200, left: 0 },
          } as any,
        ],
        {} as any
      );
    });

    expect(result.current.dimensions).toEqual({
      width: 100,
      height: 200,
      x: 0,
      y: 0,
      top: 0,
      right: 100,
      bottom: 200,
      left: 0,
    });
  });
});
