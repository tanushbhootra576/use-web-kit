import { useState, useRef, useCallback, useEffect } from 'react';

export type IdleQueueTask = () => void | Promise<void>;

export interface UseIdleQueueOptions {
    timeout?: number;
    fallbackInterval?: number;
}

export interface UseIdleQueueReturn {
    enqueue: (task: IdleQueueTask) => void;
    clearQueue: () => void;
    queueLength: number;
}

const hasIdleCallback = (): boolean =>
    typeof window !== 'undefined' &&
    typeof window.requestIdleCallback === 'function';

export function useIdleQueue(options: UseIdleQueueOptions = {}): UseIdleQueueReturn {
    const { timeout, fallbackInterval = 50 } = options;

    const queueRef = useRef<IdleQueueTask[]>([]);
    const handleRef = useRef<number | null>(null);
    const processingRef = useRef(false);
    const unmountedRef = useRef(false);

    const [queueLength, setQueueLength] = useState(0);

    const schedule = useCallback(
        (fn: () => void) => {
            if (hasIdleCallback()) {
                const opts: IdleRequestOptions = timeout != null ? { timeout } : {};
                handleRef.current = window.requestIdleCallback(fn, opts);
            } else {
                handleRef.current = window.setTimeout(fn, fallbackInterval) as unknown as number;
            }
        },
        [timeout, fallbackInterval],
    );

    const cancelScheduled = useCallback(() => {
        if (handleRef.current == null) return;

        if (hasIdleCallback()) {
            window.cancelIdleCallback(handleRef.current);
        } else {
            window.clearTimeout(handleRef.current);
        }
        handleRef.current = null;
    }, []);

    const processQueue = useCallback(() => {
        if (unmountedRef.current || processingRef.current) return;

        const task = queueRef.current.shift();
        if (!task) {
            processingRef.current = false;
            return;
        }

        processingRef.current = true;
        setQueueLength(queueRef.current.length);

        const execute = async () => {
            try {
                await task();
            } catch (error) {
                console.error('[useIdleQueue] Task threw an error:', error);
            } finally {
                processingRef.current = false;
                if (!unmountedRef.current && queueRef.current.length > 0) {
                    schedule(processQueue);
                }
            }
        };

        void execute();
    }, [schedule]);

    const enqueue = useCallback(
        (task: IdleQueueTask) => {
            if (unmountedRef.current) return;

            queueRef.current.push(task);
            setQueueLength(queueRef.current.length);

            if (!processingRef.current) {
                schedule(processQueue);
            }
        },
        [schedule, processQueue],
    );

    const clearQueue = useCallback(() => {
        queueRef.current = [];
        setQueueLength(0);
        cancelScheduled();
        processingRef.current = false;
    }, [cancelScheduled]);

    useEffect(() => {
        unmountedRef.current = false;

        return () => {
            unmountedRef.current = true;
            cancelScheduled();
            queueRef.current = [];
        };
    }, [cancelScheduled]);

    return { enqueue, clearQueue, queueLength };
}
