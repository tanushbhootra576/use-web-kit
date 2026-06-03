import { renderHook, act } from '@testing-library/react';
import { useIdleQueue } from '../useIdleQueue';

function mockRequestIdleCallback() {
    let nextId = 1;
    const pending = new Map<number, FrameRequestCallback>();

    (window as any).requestIdleCallback = jest.fn((cb: any, _opts?: any) => {
        const id = nextId++;
        pending.set(id, cb);
        setTimeout(() => {
            if (pending.has(id)) {
                pending.delete(id);
                cb({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
            }
        }, 0);
        return id;
    });

    (window as any).cancelIdleCallback = jest.fn((id: number) => {
        pending.delete(id);
    });

    return { pending };
}

function removeIdleCallbackSupport() {
    delete (window as any).requestIdleCallback;
    delete (window as any).cancelIdleCallback;
}

describe('useIdleQueue', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        mockRequestIdleCallback();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return initial queueLength of 0', () => {
        const { result } = renderHook(() => useIdleQueue());
        expect(result.current.queueLength).toBe(0);
    });

    it('should enqueue and execute tasks in order', async () => {
        const order: number[] = [];

        const { result } = renderHook(() => useIdleQueue());

        act(() => {
            result.current.enqueue(() => { order.push(1); });
            result.current.enqueue(() => { order.push(2); });
            result.current.enqueue(() => { order.push(3); });
        });

        await act(async () => {
            jest.runAllTimers();
        });
        await act(async () => {
            jest.runAllTimers();
        });
        await act(async () => {
            jest.runAllTimers();
        });

        expect(order).toEqual([1, 2, 3]);
    });

    it('should continue processing after a task throws an error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        const results: string[] = [];

        const { result } = renderHook(() => useIdleQueue());

        act(() => {
            result.current.enqueue(() => { results.push('a'); });
            result.current.enqueue(() => { throw new Error('boom'); });
            result.current.enqueue(() => { results.push('c'); });
        });

        await act(async () => { jest.runAllTimers(); });
        await act(async () => { jest.runAllTimers(); });
        await act(async () => { jest.runAllTimers(); });

        expect(results).toContain('a');
        expect(results).toContain('c');
        expect(consoleSpy).toHaveBeenCalledWith(
            '[useIdleQueue] Task threw an error:',
            expect.any(Error),
        );

        consoleSpy.mockRestore();
    });

    it('should clear the queue when clearQueue is called', async () => {
        const results: number[] = [];

        const { result } = renderHook(() => useIdleQueue());

        act(() => {
            result.current.enqueue(() => { results.push(1); });
            result.current.enqueue(() => { results.push(2); });
        });

        act(() => {
            result.current.clearQueue();
        });

        expect(result.current.queueLength).toBe(0);

        await act(async () => { jest.runAllTimers(); });

        expect(results.length).toBeLessThanOrEqual(1);
    });

    it('should handle async tasks', async () => {
        const results: string[] = [];

        const { result } = renderHook(() => useIdleQueue());

        act(() => {
            result.current.enqueue(async () => {
                await Promise.resolve();
                results.push('async-done');
            });
        });

        await act(async () => { jest.runAllTimers(); });
        await act(async () => { jest.runAllTimers(); });

        expect(results).toContain('async-done');
    });

    it('should cancel pending work on unmount', () => {
        const results: number[] = [];
        const { result, unmount } = renderHook(() => useIdleQueue());

        act(() => {
            result.current.enqueue(() => { results.push(1); });
        });

        unmount();

        expect(window.cancelIdleCallback).toHaveBeenCalled();
    });

    it('should fall back to setTimeout when requestIdleCallback is unavailable', async () => {
        removeIdleCallbackSupport();

        const results: string[] = [];
        const { result } = renderHook(() =>
            useIdleQueue({ fallbackInterval: 100 }),
        );

        act(() => {
            result.current.enqueue(() => { results.push('fallback'); });
        });

        await act(async () => { jest.advanceTimersByTime(150); });

        expect(results).toContain('fallback');

        mockRequestIdleCallback();
    });

    it('should update queueLength reactively', () => {
        const { result } = renderHook(() => useIdleQueue());

        expect(result.current.queueLength).toBe(0);

        act(() => {
            result.current.enqueue(() => { });
            result.current.enqueue(() => { });
        });

        expect(result.current.queueLength).toBeGreaterThanOrEqual(1);
    });
});
