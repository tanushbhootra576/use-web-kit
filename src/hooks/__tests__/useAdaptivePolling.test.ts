import { renderHook } from '@testing-library/react';
import { useAdaptivePolling } from '../useAdaptivePolling';

function simulateVisibility(state: 'visible' | 'hidden') {
    Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => state,
    });
    document.dispatchEvent(new Event('visibilitychange'));
}

describe('useAdaptivePolling', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        simulateVisibility('visible');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should call the callback at the specified interval', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, { interval: 1000 }),
        );

        expect(callback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(2);

        jest.advanceTimersByTime(3000);
        expect(callback).toHaveBeenCalledTimes(5);
    });

    it('should not call the callback when enabled is false', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, { interval: 1000, enabled: false }),
        );

        jest.advanceTimersByTime(5000);
        expect(callback).not.toHaveBeenCalled();
    });

    it('should pause polling when tab is hidden and pauseOnBackground is true', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, {
                interval: 1000,
                pauseOnBackground: true,
            }),
        );

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        simulateVisibility('hidden');

        jest.advanceTimersByTime(5000);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should slow down polling when tab is hidden and pauseOnBackground is false', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, {
                interval: 1000,
                pauseOnBackground: false,
                backgroundSlowdownFactor: 5,
            }),
        );

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        simulateVisibility('hidden');

        jest.advanceTimersByTime(4000);
        expect(callback).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should fire immediately (throttled) when tab becomes visible again', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, {
                interval: 1000,
                pauseOnBackground: true,
            }),
        );

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        simulateVisibility('hidden');
        jest.advanceTimersByTime(3000);
        expect(callback).toHaveBeenCalledTimes(1);

        simulateVisibility('visible');
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should NOT double-fire when returning to visible within the throttle window', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, {
                interval: 1000,
                pauseOnBackground: true,
            }),
        );

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        simulateVisibility('hidden');
        jest.advanceTimersByTime(100);
        simulateVisibility('visible');

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should restart the timer when interval changes dynamically', () => {
        const callback = jest.fn();

        const { rerender } = renderHook(
            ({ interval }) =>
                useAdaptivePolling(callback, { interval }),
            { initialProps: { interval: 1000 } },
        );

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        rerender({ interval: 500 });

        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(2);

        jest.advanceTimersByTime(500);
        expect(callback).toHaveBeenCalledTimes(3);
    });

    it('should clean up interval and listeners on unmount', () => {
        const callback = jest.fn();
        const removeListenerSpy = jest.spyOn(document, 'removeEventListener');

        const { unmount } = renderHook(() =>
            useAdaptivePolling(callback, { interval: 1000 }),
        );

        unmount();

        jest.advanceTimersByTime(5000);
        expect(callback).toHaveBeenCalledTimes(0);
        expect(removeListenerSpy).toHaveBeenCalledWith(
            'visibilitychange',
            expect.any(Function),
        );

        removeListenerSpy.mockRestore();
    });

    it('should resume normal interval after returning from background', () => {
        const callback = jest.fn();

        renderHook(() =>
            useAdaptivePolling(callback, {
                interval: 1000,
                pauseOnBackground: true,
            }),
        );

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(1);

        simulateVisibility('hidden');
        jest.advanceTimersByTime(5000);

        simulateVisibility('visible');
        const countAfterReturn = callback.mock.calls.length;

        jest.advanceTimersByTime(1000);
        expect(callback).toHaveBeenCalledTimes(countAfterReturn + 1);
    });
});
