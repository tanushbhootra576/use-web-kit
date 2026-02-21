import { renderHook, act } from '@testing-library/react';
import { useBroadcastState } from '../useBroadcastState';

type MessageHandler = ((event: MessageEvent) => void) | null;

class MockBroadcastChannel {
    static instances: MockBroadcastChannel[] = [];

    name: string;
    onmessage: MessageHandler = null;
    onmessageerror: MessageHandler = null;
    closed = false;

    constructor(name: string) {
        this.name = name;
        MockBroadcastChannel.instances.push(this);
    }

    postMessage(data: any) {
        if (this.closed) return;

        MockBroadcastChannel.instances.forEach((instance) => {
            if (instance !== this && instance.name === this.name && !instance.closed) {
                instance.onmessage?.({ data } as MessageEvent);
            }
        });
    }

    close() {
        this.closed = true;
        const idx = MockBroadcastChannel.instances.indexOf(this);
        if (idx !== -1) MockBroadcastChannel.instances.splice(idx, 1);
    }

    addEventListener() { }
    removeEventListener() { }
    dispatchEvent() { return true; }
}

beforeAll(() => {
    (globalThis as any).BroadcastChannel = MockBroadcastChannel;
});

afterAll(() => {
    delete (globalThis as any).BroadcastChannel;
});

beforeEach(() => {
    MockBroadcastChannel.instances = [];
});

describe('useBroadcastState', () => {
    it('should initialise with the given initial value', () => {
        const { result } = renderHook(() => useBroadcastState('test-channel', 42));
        expect(result.current[0]).toBe(42);
    });

    it('should update state locally via the setter', () => {
        const { result } = renderHook(() =>
            useBroadcastState<string>('test-channel', 'hello'),
        );

        act(() => {
            result.current[1]('world');
        });

        expect(result.current[0]).toBe('world');
    });

    it('should support functional updates', () => {
        const { result } = renderHook(() =>
            useBroadcastState<number>('counter', 0),
        );

        act(() => {
            result.current[1]((prev) => prev + 1);
        });

        expect(result.current[0]).toBe(1);

        act(() => {
            result.current[1]((prev) => prev + 10);
        });

        expect(result.current[0]).toBe(11);
    });

    it('should broadcast state changes to other instances', () => {
        const { result: hookA } = renderHook(() =>
            useBroadcastState<number>('shared', 0),
        );
        const { result: hookB } = renderHook(() =>
            useBroadcastState<number>('shared', 0),
        );

        act(() => {
            hookA.current[1](99);
        });

        expect(hookB.current[0]).toBe(99);
    });

    it('should not crash on malformed JSON messages', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const { result } = renderHook(() =>
            useBroadcastState<number>('error-channel', 0),
        );

        const channel = MockBroadcastChannel.instances.find(
            (c) => c.name === 'error-channel',
        );
        expect(channel).toBeDefined();

        act(() => {
            channel!.onmessage?.({ data: '{invalid-json' } as MessageEvent);
        });

        expect(result.current[0]).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith(
            '[useBroadcastState] Failed to parse incoming message:',
            expect.any(Error),
        );

        consoleSpy.mockRestore();
    });

    it('should close the channel on unmount', () => {
        const { unmount } = renderHook(() =>
            useBroadcastState('cleanup-channel', ''),
        );

        const instancesBefore = MockBroadcastChannel.instances.filter(
            (c) => c.name === 'cleanup-channel',
        ).length;
        expect(instancesBefore).toBe(1);

        unmount();

        const instancesAfter = MockBroadcastChannel.instances.filter(
            (c) => c.name === 'cleanup-channel',
        ).length;
        expect(instancesAfter).toBe(0);
    });

    it('should handle complex objects', () => {
        interface User {
            id: number;
            name: string;
        }

        const { result } = renderHook(() =>
            useBroadcastState<User>('obj-channel', { id: 1, name: 'Alice' }),
        );

        act(() => {
            result.current[1]({ id: 2, name: 'Bob' });
        });

        expect(result.current[0]).toEqual({ id: 2, name: 'Bob' });
    });

    it('should not create infinite loops when receiving own message pattern', () => {
        const { result: hookA } = renderHook(() =>
            useBroadcastState<number>('loop-channel', 0),
        );
        const { result: hookB } = renderHook(() =>
            useBroadcastState<number>('loop-channel', 0),
        );

        act(() => {
            hookA.current[1](1);
        });

        act(() => {
            hookB.current[1](2);
        });

        expect(hookA.current[0]).toBe(2);
        expect(hookB.current[0]).toBe(2);
    });
});
