import { renderHook, act } from "@testing-library/react";
import { useChunkedTask } from "../useChunkedTask";

describe("useChunkedTask", () => {
  beforeEach(() => {
    // Mock performance.now
    let time = 0;
    jest.spyOn(performance, "now").mockImplementation(() => {
      time += 5; // Add 5ms on each call
      return time;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should process items successfully", async () => {
    const { result } = renderHook(() => useChunkedTask({ chunkTimeMs: 10 }));

    const items = [1, 2, 3];
    let processed: number[] = [];

    await act(async () => {
      processed = await result.current.run(items, (item) => item * 2);
    });

    expect(processed).toEqual([2, 4, 6]);
    expect(result.current.state.progress).toBe(1);
    expect(result.current.state.isRunning).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  it("should handle cancellation", async () => {
    const { result } = renderHook(() => useChunkedTask({ chunkTimeMs: 1 }));

    const items = [1, 2, 3, 4, 5];

    let runPromise: Promise<any>;
    act(() => {
      runPromise = result.current.run(items, async (item) => {
        return item * 2;
      });
    });

    act(() => {
      result.current.cancel();
    });

    await expect(runPromise!).rejects.toThrow("Task cancelled");
    expect(result.current.state.isRunning).toBe(false);
  });
});
