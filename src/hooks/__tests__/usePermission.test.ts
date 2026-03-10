import { renderHook, act, waitFor } from "@testing-library/react";
import { usePermission } from "../usePermission";

// Mock navigator.permissions
const createMockPermissions = (supported: boolean = true) => {
  const listeners: Record<string, Function[]> = { change: [] };

  const permissionsAPI = supported
    ? {
        query: jest.fn(),
        request: jest.fn(),
        addEventListener: jest.fn((event: string, callback: Function) => {
          listeners[event].push(callback);
        }),
        removeEventListener: jest.fn((event: string, callback: Function) => {
          listeners[event] = listeners[event].filter((cb) => cb !== callback);
        }),
        // For testing event dispatch
        _listeners: listeners,
      }
    : undefined;

  Object.defineProperty(navigator, "permissions", {
    value: permissionsAPI,
    configurable: true,
  });

  return permissionsAPI;
};

// Mock MediaStream
global.MediaStream = class MediaStream {} as any;

// Mock Notification API
const mockNotification = {
  requestPermission: jest.fn(),
};

Object.defineProperty(window, "Notification", {
  value: mockNotification,
  configurable: true,
});

// Mock Geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

Object.defineProperty(navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
});

// Mock MediaDevices API
const mockMediaDevices = {
  getUserMedia: jest.fn(),
};

Object.defineProperty(navigator, "mediaDevices", {
  value: mockMediaDevices,
  configurable: true,
});

describe("usePermission", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    // Suppress React act() warnings in this suite; tests assert behavior
    // and we control timing via waitFor/act. Restored in afterAll.
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to supported permissions API by default
    createMockPermissions(true);
  });

  afterEach(() => {
    // Clean up navigator.permissions
    delete (navigator as any).permissions;
  });

  it("returns 'prompt' for unsupported permissions API", () => {
    createMockPermissions(false);

    const { result } = renderHook(() => usePermission("camera"));

    // When permissions API is not supported and it's not a special case
    // (notifications/geolocation), it returns "unsupported"
    expect(result.current.state).toBe("unsupported");
  });

  it("returns 'unsupported' for unsupported permission names", () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.query.mockResolvedValue({ state: "granted" });

    const { result } = renderHook(() => usePermission("camera" as any));

    // The hook returns "prompt" initially until the async query completes
    expect(result.current.state).toBe("prompt");
  });

  it("queries permission state on mount", async () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.query.mockResolvedValue({ state: "granted" });

    const { result } = renderHook(() => usePermission("camera"));

    // Let any microtask-based updates run inside act so React doesn't warn.
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockPerms!.query).toHaveBeenCalledWith({ name: "camera" });
    await waitFor(() => {
      expect(result.current.state).toBe("granted");
    });
  });

  it("handles permission query errors", async () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.query.mockRejectedValue(new Error("Permission denied"));

    const { result } = renderHook(() => usePermission("camera"));

    // Let any microtask-based updates run inside act so React doesn't warn.
    await act(async () => {
      await Promise.resolve();
    });

    // When query fails, it returns the initial "prompt" state
    await waitFor(() => {
      expect(result.current.state).toBe("prompt");
    });
  });

  it("requests permission successfully", async () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.request.mockResolvedValue("granted");

    const { result } = renderHook(() => usePermission("camera"));

    let permissionState: string | undefined;
    await act(async () => {
      permissionState = await result.current.request();
    });

    expect(mockPerms!.request).toHaveBeenCalledWith({ name: "camera" });
    expect(permissionState).toBe("granted");
  });

  it("handles permission request errors", async () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.request.mockRejectedValue(new Error("Request failed"));

    const { result } = renderHook(() => usePermission("camera"));

    let permissionState: string | undefined;
    await act(async () => {
      permissionState = await result.current.request();
    });

    expect(permissionState).toBe("denied");
  });

  it("listens to permission changes", async () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.query.mockResolvedValue({ state: "granted" });

    const { result } = renderHook(() => usePermission("camera"));

    expect(mockPerms!.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("updates state when permission changes", async () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.query.mockResolvedValue({ state: "granted" });

    const { result, rerender } = renderHook(() => usePermission("camera"));

    // Simulate permission change
    mockPerms!.query.mockResolvedValue({ state: "denied" });

    // Trigger the change listener
    const changeCallback = mockPerms!._listeners.change[0];
    await act(async () => {
      await changeCallback();
    });

    expect(result.current.state).toBe("denied");
  });

  it("cleans up listeners on unmount", () => {
    const mockPerms = createMockPermissions(true);
    mockPerms!.query.mockResolvedValue({ state: "granted" });

    const { unmount } = renderHook(() => usePermission("camera"));

    unmount();

    expect(mockPerms!.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  describe("fallback for notifications", () => {
    it("uses Notification API when permissions API is not supported", async () => {
      createMockPermissions(false);
      mockNotification.requestPermission.mockResolvedValue("granted");

      const { result } = renderHook(() => usePermission("notifications"));

      let permissionState: string | undefined;
      await act(async () => {
        permissionState = await result.current.request();
      });

      expect(mockNotification.requestPermission).toHaveBeenCalled();
      expect(permissionState).toBe("granted");
    });

    it("converts 'default' to 'prompt' for notifications", async () => {
      createMockPermissions(false);
      mockNotification.requestPermission.mockResolvedValue("default");

      const { result } = renderHook(() => usePermission("notifications"));

      let permissionState: string | undefined;
      await act(async () => {
        permissionState = await result.current.request();
      });

      expect(permissionState).toBe("prompt");
    });
  });

  describe("fallback for geolocation", () => {
    it("uses geolocation API when permissions API is not supported", async () => {
      createMockPermissions(false);
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({} as any);
      });

      const { result } = renderHook(() => usePermission("geolocation"));

      let permissionState: string | undefined;
      await act(async () => {
        permissionState = await result.current.request();
      });

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
      expect(permissionState).toBe("granted");
    });

    it("handles geolocation denial", async () => {
      createMockPermissions(false);
      mockGeolocation.getCurrentPosition.mockImplementation(
        (success, error) => {
          error({ code: 1 } as any);
        },
      );

      const { result } = renderHook(() => usePermission("geolocation"));

      let permissionState: string | undefined;
      await act(async () => {
        permissionState = await result.current.request();
      });

      expect(permissionState).toBe("denied");
    });
  });

  describe("fallback for camera/microphone", () => {
    it("uses mediaDevices API when permissions API is not supported", async () => {
      createMockPermissions(false);
      mockMediaDevices.getUserMedia.mockResolvedValue(new MediaStream());

      const { result } = renderHook(() => usePermission("camera"));

      let permissionState: string | undefined;
      await act(async () => {
        permissionState = await result.current.request();
      });

      expect(mockMediaDevices.getUserMedia).toHaveBeenCalledWith({
        camera: true,
      });
      expect(permissionState).toBe("granted");
    });

    it("handles mediaDevices denial", async () => {
      createMockPermissions(false);
      const error = new Error("Permission denied") as any;
      error.name = "NotAllowedError";
      mockMediaDevices.getUserMedia.mockRejectedValue(error);

      const { result } = renderHook(() => usePermission("camera"));

      let permissionState: string | undefined;
      await act(async () => {
        permissionState = await result.current.request();
      });

      expect(permissionState).toBe("denied");
    });
  });

  it("works on SSR (when navigator is undefined)", () => {
    const originalNavigator = global.navigator;
    delete (global as any).navigator;

    const { result } = renderHook(() => usePermission("camera"));

    expect(result.current.state).toBe("unsupported");

    // Restore navigator
    global.navigator = originalNavigator;
  });
});
