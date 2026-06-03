import { useEffect, useRef, useCallback } from 'react';
import type { UseAdaptivePollingOptions } from "../core/types";

/**
 * Interval-based polling that adapts to page visibility.
 *
 * Pauses or slows down when the browser tab is hidden. Fires immediately on
 * becoming visible if the interval has elapsed while backgrounded.
 *
 * FIX: Callback ref is now updated in the render body (direct assignment)
 * instead of through a separate useEffect. This eliminates one unnecessary
 * effect invocation per render and prevents a stale callback on the first
 * tick after a render.
 */
export function useAdaptivePolling(
    callback: () => void,
    options: UseAdaptivePollingOptions,
): void {
    const {
        interval,
        enabled = true,
        pauseOnBackground = true,
        backgroundSlowdownFactor = 5,
    } = options;

    // Store the latest callback in a ref -- updated synchronously in render.
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const lastFiredRef = useRef<number>(0);
    const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fire = useCallback(() => {
        lastFiredRef.current = Date.now();
        callbackRef.current();
    }, []);

    const clearTimer = useCallback(() => {
        if (intervalIdRef.current != null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }, []);

    const startTimer = useCallback(
        (ms: number) => {
            clearTimer();
            intervalIdRef.current = setInterval(fire, ms);
        },
        [clearTimer, fire],
    );

    useEffect(() => {
        if (!enabled) {
            clearTimer();
            return;
        }

        const isHidden = (): boolean =>
            typeof document !== 'undefined' && document.visibilityState === 'hidden';

        const effectiveInterval = (): number => {
            if (!isHidden()) return interval;
            if (pauseOnBackground) return 0;
            return interval * backgroundSlowdownFactor;
        };

        const startingInterval = effectiveInterval();
        if (startingInterval > 0) {
            startTimer(startingInterval);
        }

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const elapsed = Date.now() - lastFiredRef.current;
                if (elapsed >= interval) {
                    fire();
                }
                startTimer(interval);
            } else {
                if (pauseOnBackground) {
                    clearTimer();
                } else {
                    startTimer(interval * backgroundSlowdownFactor);
                }
            }
        };

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', onVisibilityChange);
        }

        return () => {
            clearTimer();
            if (typeof document !== 'undefined') {
                document.removeEventListener('visibilitychange', onVisibilityChange);
            }
        };
    }, [interval, enabled, pauseOnBackground, backgroundSlowdownFactor, startTimer, clearTimer, fire]);
}
