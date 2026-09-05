import { renderHook, act } from "@testing-library/react";
import { useHeavyStorage } from "../useHeavyStorage";

describe("useHeavyStorage", () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    Object.defineProperty(global, "navigator", {
      value: {
        ...originalNavigator,
        storage: {
          getDirectory: jest.fn().mockResolvedValue({
            getFileHandle: jest.fn().mockResolvedValue({
              createWritable: jest.fn().mockResolvedValue({
                write: jest.fn().mockResolvedValue(undefined),
                close: jest.fn().mockResolvedValue(undefined),
              }),
              getFile: jest.fn().mockResolvedValue(new File(["data"], "test.txt")),
            }),
            removeEntry: jest.fn().mockResolvedValue(undefined),
          }),
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

  it("should detect OPFS support", () => {
    const { result } = renderHook(() => useHeavyStorage());
    expect(result.current.isSupported).toBe(true);
  });

  it("should save data", async () => {
    const { result } = renderHook(() => useHeavyStorage());
    await act(async () => {
      await result.current.save("test", "data");
    });
    expect(global.navigator.storage.getDirectory).toHaveBeenCalled();
  });

  it("should load data", async () => {
    const { result } = renderHook(() => useHeavyStorage());
    let file: File | null = null;
    await act(async () => {
      file = await result.current.load("test");
    });
    expect(file).toBeInstanceOf(File);
  });
});
