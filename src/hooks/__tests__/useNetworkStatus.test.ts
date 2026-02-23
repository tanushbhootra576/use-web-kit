import { renderHook, act } from "@testing-library/react";
import { useNetworkStatus } from "../useNetworkStatus";

function setNavigatorOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    get: () => value,
  });
}

describe("useNetworkStatus", () => {
  beforeEach(() => {
    // default online
    setNavigatorOnline(true);
    // clear connection
    try {
      // @ts-ignore
      delete (navigator as any).connection;
    } catch (e) {}
  });

  it("reads initial online state", () => {
    setNavigatorOnline(false);
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.online).toBe(false);
  });

  it("updates on online/offline events", () => {
    setNavigatorOnline(true);
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.online).toBe(true);

    act(() => {
      setNavigatorOnline(false);
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current.online).toBe(false);

    act(() => {
      setNavigatorOnline(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current.online).toBe(true);
  });

  it("reads connection API when present and updates on change", () => {
    const listeners: Record<string, Function[]> = { change: [] };
    const conn = {
      effectiveType: "4g",
      downlink: 10,
      rtt: 50,
      addEventListener: (ev: string, cb: Function) => listeners[ev].push(cb),
      removeEventListener: (ev: string, cb: Function) => {
        listeners[ev] = listeners[ev].filter((f) => f !== cb);
      },
    } as any;

    // @ts-ignore
    (navigator as any).connection = conn;

    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.effectiveType).toBe("4g");
    expect(result.current.downlink).toBe(10);
    expect(result.current.rtt).toBe(50);

    act(() => {
      // simulate change
      (conn.effectiveType as any) = "3g";
      (conn.downlink as any) = 2;
      (conn.rtt as any) = 150;
      listeners.change.forEach((cb) => cb());
    });

    expect(result.current.effectiveType).toBe("3g");
    expect(result.current.downlink).toBe(2);
    expect(result.current.rtt).toBe(150);
  });

  it("gracefully handles missing connection API", () => {
    try {
      // @ts-ignore
      delete (navigator as any).connection;
    } catch (e) {}
    const { result } = renderHook(() => useNetworkStatus());
    // should have online bool and not throw
    expect(typeof result.current.online).toBe("boolean");
  });

  it("cleans up listeners on unmount", () => {
    const removeWin = jest.spyOn(window, "removeEventListener");

    const listeners: Record<string, Function[]> = { change: [] };
    const conn = {
      effectiveType: "4g",
      downlink: 10,
      rtt: 50,
      addEventListener: (ev: string, cb: Function) => listeners[ev].push(cb),
      removeEventListener: (ev: string, cb: Function) => {
        listeners[ev] = listeners[ev].filter((f) => f !== cb);
      },
    } as any;
    // @ts-ignore
    (navigator as any).connection = conn;

    const { unmount } = renderHook(() => useNetworkStatus());
    unmount();

    expect(removeWin).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeWin).toHaveBeenCalledWith("offline", expect.any(Function));

    removeWin.mockRestore();
  });
});
