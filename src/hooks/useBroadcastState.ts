import { useState, useRef, useCallback, useEffect } from 'react';

export function useBroadcastState<T>(
    channelName: string,
    initialValue: T,
): [T, (value: T | ((prevState: T) => T)) => void] {
    const [state, setState] = useState<T>(initialValue);

    const stateRef = useRef<T>(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const channelRef = useRef<BroadcastChannel | null>(null);
    const isExternalUpdateRef = useRef(false);

    useEffect(() => {
        if (typeof BroadcastChannel === 'undefined') return;

        const channel = new BroadcastChannel(channelName);
        channelRef.current = channel;

        channel.onmessage = (event: MessageEvent) => {
            try {
                const incoming: T =
                    typeof event.data === 'string'
                        ? (JSON.parse(event.data) as T)
                        : (event.data as T);

                const current = JSON.stringify(stateRef.current);
                const next = JSON.stringify(incoming);

                if (current !== next) {
                    isExternalUpdateRef.current = true;
                    setState(incoming);
                }
            } catch (error) {
                console.error(
                    '[useBroadcastState] Failed to parse incoming message:',
                    error,
                );
            }
        };

        channel.onmessageerror = (event: MessageEvent) => {
            console.error(
                '[useBroadcastState] Message deserialization error:',
                event,
            );
        };

        return () => {
            channel.close();
            channelRef.current = null;
        };
    }, [channelName]);

    const setBroadcastState = useCallback(
        (value: T | ((prevState: T) => T)) => {
            const nextValue: T =
                typeof value === 'function'
                    ? (value as (prevState: T) => T)(stateRef.current)
                    : value;

            stateRef.current = nextValue;
            setState(nextValue);

            if (channelRef.current) {
                try {
                    channelRef.current.postMessage(JSON.stringify(nextValue));
                } catch (error) {
                    console.error(
                        '[useBroadcastState] Failed to broadcast state:',
                        error,
                    );
                }
            }
        },
        [],
    );

    useEffect(() => {
        if (isExternalUpdateRef.current) {
            isExternalUpdateRef.current = false;
        }
    }, [state]);

    return [state, setBroadcastState];
}
