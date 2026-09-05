import { renderHook, act } from "@testing-library/react";
import { useSharedWorkerPool } from "../useSharedWorkerPool";

describe("useSharedWorkerPool", () => {
  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;
  let postMessageMock: jest.Mock;

  beforeEach(() => {
    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();
    postMessageMock = jest.fn();

    (global as any).SharedWorker = class {
      port = {
        start: jest.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: removeEventListenerMock,
        postMessage: postMessageMock,
      };
      constructor() {}
    };
  });

  afterEach(() => {
    delete (global as any).SharedWorker;
  });

  it("should initialize SharedWorker properly", () => {
    const { result } = renderHook(() =>
      useSharedWorkerPool({ workerUrl: "worker.js" })
    );
    expect(result.current.isReady).toBe(true);
  });

  it("should send postMessage and wait for response", async () => {
    const { result } = renderHook(() =>
      useSharedWorkerPool({ workerUrl: "worker2.js" })
    );

    let promise: Promise<any>;
    act(() => {
      promise = result.current.postMessage({ foo: "bar" });
    });

    const sentMessage = postMessageMock.mock.calls[0][0];
    const messageId = sentMessage.messageId;

    // Simulate worker response to all registered listeners
    const messageListeners = addEventListenerMock.mock.calls
      .filter((c) => c[0] === "message")
      .map((c) => c[1]);
    
    act(() => {
      messageListeners.forEach((listener) => {
        listener({
          data: { messageId, result: "success" },
        } as any);
      });
    });

    const res = await promise!;
    expect(res).toBe("success");
  });
});
