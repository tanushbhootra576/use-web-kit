import { renderHook, act } from "@testing-library/react";
import { usePageLifecycle } from "../usePageLifecycle";

function setVisibility(state: string) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("usePageLifecycle", () => {
  beforeEach(() => {
    setVisibility("visible");
  });

  it("reports initial state", () => {
    setVisibility("visible");
    const { result } = renderHook(() => usePageLifecycle());
    expect(result.current.visible).toBe(true);
    // document.hasFocus can be true in jsdom
    expect(typeof result.current.focused).toBe("boolean");
    expect(typeof result.current.frozen).toBe("boolean");
  });

  it("updates on visibilitychange", () => {
    const { result } = renderHook(() => usePageLifecycle());
    act(() => setVisibility("hidden"));
    expect(result.current.visible).toBe(false);
    act(() => setVisibility("visible"));
    expect(result.current.visible).toBe(true);
  });

  it("updates on focus and blur", () => {
    const { result } = renderHook(() => usePageLifecycle());
    act(() => window.dispatchEvent(new Event("blur")));
    expect(result.current.focused).toBe(false);
    act(() => window.dispatchEvent(new Event("focus")));
    expect(result.current.focused).toBe(true);
  });

  it("handles freeze and pagehide events", () => {
    const { result } = renderHook(() => usePageLifecycle());
    act(() => document.dispatchEvent(new Event("freeze")));
    expect(result.current.frozen).toBe(true);
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(result.current.visible).toBe(false);
    expect(result.current.frozen).toBe(true);
  });

  it("cleans up listeners on unmount", () => {
    const removeDoc = jest.spyOn(document, "removeEventListener");
    const { unmount } = renderHook(() => usePageLifecycle());
    unmount();
    expect(removeDoc).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
    removeDoc.mockRestore();
  });
});
