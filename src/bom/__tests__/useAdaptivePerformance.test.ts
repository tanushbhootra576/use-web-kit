import { renderHook, act } from "@testing-library/react";
import { useAdaptivePerformance } from "../useAdaptivePerformance";

describe("useAdaptivePerformance", () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    Object.defineProperty(global, "navigator", {
      value: {
        ...originalNavigator,
        hardwareConcurrency: 4,
        deviceMemory: 4,
        connection: {
          effectiveType: "4g",
          saveData: false,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
  });

  it("returns medium tier for mid-range devices", () => {
    const { result } = renderHook(() => useAdaptivePerformance());
    expect(result.current.tier).toBe("medium");
    expect(result.current.hardwareConcurrency).toBe(4);
    expect(result.current.deviceMemory).toBe(4);
  });

  it("returns low tier when saveData is true", () => {
    (global.navigator as any).connection.saveData = true;
    const { result, unmount } = renderHook(() => useAdaptivePerformance());
    
    act(() => {
      // Fire network change to update module-level singleton state
      const listener = ((global.navigator as any).connection.addEventListener as jest.Mock).mock.calls[0][1];
      listener();
    });

    expect(result.current.tier).toBe("low");
    unmount();
  });

  it("returns high tier for high-end devices", () => {
    (global.navigator as any).hardwareConcurrency = 12;
    (global.navigator as any).deviceMemory = 16;
    (global.navigator as any).connection.effectiveType = "4g";
    (global.navigator as any).connection.saveData = false;
    const { result, unmount } = renderHook(() => useAdaptivePerformance());

    act(() => {
      // Fire network change
      const listener = ((global.navigator as any).connection.addEventListener as jest.Mock).mock.calls[0][1];
      if (listener) listener();
    });

    expect(result.current.tier).toBe("high");
    unmount();
  });
});
