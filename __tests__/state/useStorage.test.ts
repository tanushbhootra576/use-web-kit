import { renderHook, act } from "@testing-library/react";
import useStorage, { StorageType } from "../useStorage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

// Setup mocks
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

describe("useStorage", () => {
  beforeEach(() => {
    // Reset mocks before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.getItem.mockImplementation((key: string) => (localStorageMock as any).store[key] || null);
    
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.getItem.mockImplementation((key: string) => (sessionStorageMock as any).store[key] || null);
    
    // Clear the store
    (localStorageMock as any).store = {};
    (sessionStorageMock as any).store = {};
  });

  it("returns initial value when storage is empty", () => {
    const { result } = renderHook(() => useStorage("test", "default"));
    
    expect(result.current.value).toBe("default");
  });

  it("reads existing value from localStorage", () => {
    // Set up the mock to return the value
    (localStorageMock as any).store["test"] = JSON.stringify("existing");
    localStorageMock.getItem.mockImplementation((key: string) => (localStorageMock as any).store[key] || null);
    
    const { result } = renderHook(() => useStorage("test", "default"));
    
    expect(result.current.value).toBe("existing");
  });

  it("reads existing value from sessionStorage", () => {
    (sessionStorageMock as any).store["test"] = JSON.stringify("existing");
    sessionStorageMock.getItem.mockImplementation((key: string) => (sessionStorageMock as any).store[key] || null);
    
    const { result } = renderHook(() => useStorage("test", "default", "sessionStorage"));
    
    expect(result.current.value).toBe("existing");
  });

  it("sets value in localStorage", () => {
    const { result } = renderHook(() => useStorage("test", "default"));
    
    act(() => {
      result.current.setValue("new value");
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test", JSON.stringify("new value"));
    expect(result.current.value).toBe("new value");
  });

  it("sets value in sessionStorage", () => {
    const { result } = renderHook(() => useStorage("test", "default", "sessionStorage"));
    
    act(() => {
      result.current.setValue("new value");
    });
    
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith("test", JSON.stringify("new value"));
    expect(result.current.value).toBe("new value");
  });

  it("removes value from localStorage", () => {
    localStorageMock.setItem("test", JSON.stringify("existing"));
    
    const { result } = renderHook(() => useStorage("test", "default"));
    
    act(() => {
      result.current.removeValue();
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("test");
    expect(result.current.value).toBe("default");
  });

  it("handles function updater", () => {
    const { result } = renderHook(() => useStorage<string | number>("test", "count"));
    
    // Set initial value
    act(() => {
      result.current.setValue("count");
    });
    
    act(() => {
      result.current.setValue((prev) => {
        expect(prev).toBe("count");
        return 1;
      });
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test", JSON.stringify(1));
    expect(result.current.value).toBe(1);
  });

  it("handles JSON serialization errors gracefully", () => {
    // Mock localStorage to return invalid JSON
    (localStorageMock as any).store["test"] = "invalid json";
    localStorageMock.getItem.mockImplementation((key: string) => (localStorageMock as any).store[key] || null);
    
    const { result } = renderHook(() => useStorage("test", "default"));
    
    // The default serializer returns the raw value when JSON.parse fails
    expect(result.current.value).toBe("invalid json");
  });

  it("uses custom serializer", () => {
    const customSerializer = {
      read: (value: string) => `read-${value}`,
      write: (value: unknown) => `write-${value}`,
    };
    
    const { result } = renderHook(() => 
      useStorage("test", "default", "localStorage", { serializer: customSerializer })
    );
    
    act(() => {
      result.current.setValue("value");
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith("test", "write-value");
  });

  it("syncs across tabs with storage events", () => {
    const { result } = renderHook(() => useStorage("test", "default"));
    
    // Simulate storage event from another tab
    act(() => {
      // Update the mock store first
      (localStorageMock as any).store["test"] = JSON.stringify("updated from other tab");
      const event = new Event("storage", { bubbles: true }) as any;
      event.key = "test";
      event.newValue = JSON.stringify("updated from other tab");
      event.storageArea = window.localStorage;
      window.dispatchEvent(event);
    });
    
    expect(result.current.value).toBe("updated from other tab");
  });

  it("handles cross-tab synchronization with localStorage", () => {
    const { result } = renderHook(() => useStorage("test", "default"));
    
    act(() => {
      result.current.setValue("new-value");
    });
    
    // Simulate storage event from another tab
    act(() => {
      // Update the mock store first
      (localStorageMock as any).store["test"] = '"updated from other tab"';
      const event = new Event("storage", { bubbles: true }) as any;
      event.key = "test";
      event.newValue = '"updated from other tab"';
      event.storageArea = window.localStorage;
      window.dispatchEvent(event);
    });
    
    expect(result.current.value).toBe("updated from other tab");
  });

  it("ignores storage events for different keys", () => {
    const { result } = renderHook(() => useStorage("test", "default"));
    
    act(() => {
      // Update a different key in the store
      (localStorageMock as any).store["different-key"] = '"should not update"';
      const event = new Event("storage", { bubbles: true }) as any;
      event.key = "different-key";
      event.newValue = '"should not update"';
      event.storageArea = window.localStorage;
      window.dispatchEvent(event);
    });
    
    expect(result.current.value).toBe("default");
  });

  it("ignores storage events for different storage areas", () => {
    const { result } = renderHook(() => useStorage("test", "default", "localStorage"));
    
    act(() => {
      const event = new Event("storage", { bubbles: true }) as any;
      event.key = "test";
      event.newValue = '"should not update"';
      event.storageArea = window.sessionStorage;
      window.dispatchEvent(event);
    });
    
    expect(result.current.value).toBe("default");
  });

  it("handles null value in storage event", () => {
    const { result } = renderHook(() => useStorage("test", "default"));
    
    act(() => {
      // Remove the key from the store
      delete (localStorageMock as any).store["test"];
      const event = new Event("storage", { bubbles: true }) as any;
      event.key = "test";
      event.newValue = null;
      event.storageArea = window.localStorage;
      window.dispatchEvent(event);
    });
    
    // When storage item is null, the hook returns the initial value
    expect(result.current.value).toBe("default");
  });

  it.skip("works on SSR (when window is undefined)", () => {
    const originalWindow = (global as any).window;
    
    // Mock window to be undefined
    delete (global as any).window;
    
    try {
      const { result } = renderHook(() => useStorage("test", "default"));
      
      expect(result.current.value).toBe("default");
      
      act(() => {
        result.current.setValue("ssr-value");
      });
      
      expect(result.current.value).toBe("ssr-value");
    } finally {
      (global as any).window = originalWindow;
    }
  });

  it("cleans up event listeners on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    
    const { unmount } = renderHook(() => useStorage("test", "default"));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});
