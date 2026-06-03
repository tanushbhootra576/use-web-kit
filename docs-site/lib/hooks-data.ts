export interface HookExample {
  title: string;
  code: string;
}

export interface HookOption {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface HookReturn {
  name: string;
  type: string;
  description: string;
}

export interface HookDoc {
  id: string;
  slug: string; // added for compatibility
  name: string;
  domain: 'DOM' | 'Concurrency' | 'State' | 'Pipelines' | 'BOM';
  category: string; // added for compatibility
  description: string;
  signature: string;
  options: HookOption[];
  returns: HookReturn[];
  examples: HookExample[];
  codePreview: string; // added for compatibility
  tags: string[]; // added for compatibility
  notes?: string[];
}

export type HookMeta = HookDoc;

const RAW_HOOKS_DATA = [
  // ─── DOM ────────────────────────────────────────────────────────────────
  {
    id: "useSmartIntersection",
    name: "useSmartIntersection",
    domain: "DOM",
    description: "Enterprise-grade Intersection Observer hook that uses a global singleton and RAF batching to achieve O(1) observer overhead and zero render cascades.",
    signature: "function useSmartIntersection(options?: UseSmartIntersectionOptions): { ref, isIntersecting, entry }",
    options: [
      { name: "root", type: "Element | Document | null", default: "null", description: "The element used as the viewport for checking visibility." },
      { name: "rootMargin", type: "string", default: `"0px"`, description: "Margin around the root." },
      { name: "threshold", type: "number | number[]", default: "0", description: "Ratio(s) at which to trigger." },
      { name: "lowPriority", type: "boolean", default: "false", description: "Wraps state updates in startTransition to prevent scroll jank." },
      { name: "onIntersect", type: "(entry: IntersectionObserverEntry) => void", description: "Callback for side-effects without state allocation." }
    ],
    returns: [
      { name: "ref", type: "(node: Element | null) => void | (() => void)", description: "React 19 ref callback with automatic cleanup." },
      { name: "isIntersecting", type: "boolean", description: "True when the element is intersecting the root." },
      { name: "entry", type: "IntersectionObserverEntry | null", description: "The most recent observer entry." }
    ],
    examples: [
      {
        title: "Lazy Image Loading",
        code: `import { useSmartIntersection } from "use-web-kit";

export function LazyImage({ src }: { src: string }) {
  const { ref, isIntersecting } = useSmartIntersection({ lowPriority: true });
  return <img ref={ref} src={isIntersecting ? src : undefined} />;
}`
      }
    ],
    notes: [
      "Uses a single global IntersectionObserver for the entire application.",
      "Events are batched via requestAnimationFrame to avoid O(N) render passes."
    ]
  },
  {
    id: "useIntersection",
    name: "useIntersection",
    domain: "DOM",
    description: "Traditional per-instance observer pool for components requiring custom rootMargin or thresholds not supported by the global singleton.",
    signature: "function useIntersection(options?: IntersectionOptions): { ref, isIntersecting, entry }",
    options: [
      { name: "root", type: "Element | Document | null", default: "null", description: "The element used as the viewport." },
      { name: "rootMargin", type: "string", default: `"0px"`, description: "Margin around the root." },
      { name: "threshold", type: "number | number[]", default: "0", description: "Trigger ratio." }
    ],
    returns: [
      { name: "ref", type: "(node: Element | null) => void", description: "React 19 ref callback." },
      { name: "isIntersecting", type: "boolean", description: "Intersection boolean flag." },
      { name: "entry", type: "IntersectionObserverEntry | null", description: "Observer entry." }
    ],
    examples: [
      {
        title: "Custom Root Margin",
        code: `const { ref, isIntersecting } = useIntersection({ rootMargin: '200px' });`
      }
    ]
  },
  {
    id: "useMediaControls",
    name: "useMediaControls",
    domain: "DOM",
    description: "Unidirectional state management for <audio> and <video> elements with direct API access.",
    signature: "function useMediaControls(): { ref, state, controls }",
    options: [],
    returns: [
      { name: "ref", type: "(node: HTMLMediaElement | null) => void", description: "Attach to media element." },
      { name: "state", type: "MediaState", description: "Current media properties (playing, time, volume)." },
      { name: "controls", type: "MediaControls", description: "Play, pause, seek, setVolume, mute functions." }
    ],
    examples: [
      {
        title: "Video Player",
        code: `const { ref, state, controls } = useMediaControls();
return (
  <div>
    <video ref={ref} src="/vid.mp4" />
    <button onClick={controls.togglePlay}>{state.playing ? 'Pause' : 'Play'}</button>
  </div>
);`
      }
    ]
  },

  // ─── Concurrency ────────────────────────────────────────────────────────
  {
    id: "useWorkerPool",
    name: "useWorkerPool",
    domain: "Concurrency",
    description: "Offload heavy synchronous functions to a managed pool of Web Workers via Blob URL serialization. Protects the main thread from blocking.",
    signature: "function useWorkerPool<Args, Res>(fn: (...args: Args) => Res, options?: UseWorkerPoolOptions): UseWorkerPoolReturn",
    options: [
      { name: "maxWorkers", type: "number", default: "2", description: "Maximum concurrent workers." },
      { name: "timeout", type: "number", default: "30000", description: "Max execution time before termination." },
      { name: "terminateOnIdle", type: "boolean", default: "false", description: "Terminate workers immediately when idle." }
    ],
    returns: [
      { name: "run", type: "(...args: Args) => [Promise<Res>, string]", description: "Submit a task, returns Promise and taskId." },
      { name: "cancel", type: "(taskId?: string) => void", description: "Cancel task or all tasks." },
      { name: "isRunning", type: "boolean", description: "True if pool is processing." },
      { name: "pendingCount", type: "number", description: "Queued task count." },
      { name: "terminate", type: "() => void", description: "Destroy all workers." }
    ],
    examples: [
      {
        title: "Off-thread array sorting",
        code: `const sort = (arr: number[]) => [...arr].sort((a,b) => a - b);
const { run, isRunning } = useWorkerPool(sort);

const handleSort = async () => {
  const [promise] = run(largeData);
  const result = await promise;
};`
      }
    ],
    notes: [
      "Function must be pure and self-contained. Closures are not serialized.",
      "All Blob URLs are automatically revoked on unmount."
    ]
  },
  {
    id: "useIdleQueue",
    name: "useIdleQueue",
    domain: "Concurrency",
    description: "Schedules non-urgent background tasks using requestIdleCallback, safely yielding to user interactions.",
    signature: "function useIdleQueue(options?: UseIdleQueueOptions): { enqueue, clearQueue, queueLength }",
    options: [
      { name: "timeout", type: "number", default: "undefined", description: "Force execution if idle time exceeds this value." },
      { name: "fallbackInterval", type: "number", default: "50", description: "Fallback polling if rIC is unsupported." }
    ],
    returns: [
      { name: "enqueue", type: "(task: () => void) => void", description: "Add task to idle queue." },
      { name: "clearQueue", type: "() => void", description: "Drop all pending tasks." },
      { name: "queueLength", type: "number", description: "Number of pending tasks." }
    ],
    examples: [
      {
        title: "Deferred Analytics",
        code: `const { enqueue } = useIdleQueue();
enqueue(() => sendAnalytics(data));`
      }
    ]
  },
  {
    id: "useAdaptivePolling",
    name: "useAdaptivePolling",
    domain: "Concurrency",
    description: "Interval polling that pauses or slows down when the browser tab is hidden to save battery and network.",
    signature: "function useAdaptivePolling(callback: () => void, options: UseAdaptivePollingOptions): void",
    options: [
      { name: "interval", type: "number", description: "Polling interval in milliseconds." },
      { name: "enabled", type: "boolean", default: "true", description: "Whether polling is active." },
      { name: "pauseOnBackground", type: "boolean", default: "true", description: "Stop completely when hidden." },
      { name: "backgroundSlowdownFactor", type: "number", default: "5", description: "Multiplier when backgrounded (if not paused)." }
    ],
    returns: [],
    examples: [
      {
        title: "Dashboard Polling",
        code: `useAdaptivePolling(fetchLatestMetrics, {
  interval: 5000,
  pauseOnBackground: true
});`
      }
    ]
  },

  // ─── State ────────────────────────────────────────────────────────────────
  {
    id: "useDebouncedStorage",
    name: "useDebouncedStorage",
    domain: "State",
    description: "SSR-safe Web Storage with instant local UI updates, debounced disk writes, and cross-tab synchronization.",
    signature: "function useDebouncedStorage<T>(key: string, initial: T, options?: UseDebouncedStorageOptions<T>): UseDebouncedStorageReturn<T>",
    options: [
      { name: "storage", type: "'localStorage' | 'sessionStorage'", default: "'localStorage'", description: "Target storage medium." },
      { name: "debounceMs", type: "number", default: "300", description: "Delay before writing to disk." },
      { name: "broadcastSync", type: "boolean", default: "true", description: "Sync across tabs." },
      { name: "serializer", type: "StorageSerializer<T>", description: "Custom read/write logic." }
    ],
    returns: [
      { name: "value", type: "T", description: "The current reactive value." },
      { name: "setValue", type: "(val: T | ((prev: T) => T)) => void", description: "Update value (instant UI, debounced write)." },
      { name: "removeValue", type: "() => void", description: "Clear key." },
      { name: "flush", type: "() => void", description: "Force immediate write (e.g. beforeunload)." }
    ],
    examples: [
      {
        title: "Draft Editor",
        code: `const { value, setValue, flush } = useDebouncedStorage('draft', '');
return <textarea value={value} onChange={e => setValue(e.target.value)} onBlur={flush} />;`
      }
    ],
    notes: [
      "Uses useSyncExternalStore internally for perfect SSR hydration."
    ]
  },
  {
    id: "useStorage",
    name: "useStorage",
    domain: "State",
    description: "Basic synchronous Web Storage persistence. For high-frequency updates, prefer useDebouncedStorage.",
    signature: "function useStorage<T>(key: string, initial: T): { value, setValue, removeValue }",
    options: [],
    returns: [
      { name: "value", type: "T", description: "Current value." },
      { name: "setValue", type: "setter", description: "Update value." },
      { name: "removeValue", type: "() => void", description: "Clear key." }
    ],
    examples: [
      {
        title: "Theme Toggle",
        code: `const { value: theme, setValue: setTheme } = useStorage('theme', 'dark');`
      }
    ]
  },
  {
    id: "useBroadcastState",
    name: "useBroadcastState",
    domain: "State",
    description: "Cross-tab state sharing via ref-counted BroadcastChannel singleton.",
    signature: "function useBroadcastState<T>(channel: string, initial: T): [T, setter]",
    options: [],
    returns: [
      { name: "[0]", type: "T", description: "Current shared value." },
      { name: "[1]", type: "setter", description: "Update and broadcast to other tabs." }
    ],
    examples: [
      {
        title: "Cart Sync",
        code: `const [cart, setCart] = useBroadcastState('cart_channel', []);`
      }
    ]
  },

  // ─── Pipelines ────────────────────────────────────────────────────────────
  {
    id: "useEventPipeline",
    name: "useEventPipeline",
    domain: "Pipelines",
    description: "Composable event processing with AbortController cancellation for rapid continuous events.",
    signature: "function useEventPipeline<E, O>(stages: PipelineStage[], options?: Opts): UseEventPipelineReturn",
    options: [
      { name: "onComplete", type: "(res: O) => void", description: "Success callback." },
      { name: "onError", type: "(err: Error) => void", description: "Error callback." }
    ],
    returns: [
      { name: "handler", type: "(e: E) => void", description: "Attach to DOM event." },
      { name: "value", type: "O | null", description: "Final output." },
      { name: "error", type: "Error | null", description: "Pipeline error." },
      { name: "isPending", type: "boolean", description: "True during execution." },
      { name: "reset", type: "() => void", description: "Clear state." }
    ],
    examples: [
      {
        title: "Search Input",
        code: `const { handler, value, isPending } = useEventPipeline([
  (e: React.ChangeEvent<HTMLInputElement>) => e.target.value,
  debounce(300),
  async (q, signal) => fetch('/api?q='+q, { signal }).then(r => r.json())
]);`
      }
    ]
  },
  {
    id: "useActionPipeline",
    name: "useActionPipeline",
    domain: "Pipelines",
    description: "FormData processing for React 19 `<form action>` and Server Actions.",
    signature: "function useActionPipeline<O>(stages: PipelineStage[], options?: Opts): UseActionPipelineReturn",
    options: [
      { name: "action", type: "(data: O) => void | Promise<void>", description: "Server Action." },
      { name: "onComplete", type: "(res: O) => void", description: "Completion handler." }
    ],
    returns: [
      { name: "formAction", type: "(data: FormData) => Promise<void>", description: "Pass to <form action={}>" },
      { name: "value", type: "O | null", description: "Output." },
      { name: "isPending", type: "boolean", description: "Loading state." },
      { name: "error", type: "Error | null", description: "Error state." },
      { name: "reset", type: "() => void", description: "Clear state." }
    ],
    examples: [
      {
        title: "React 19 Form",
        code: `const { formAction, isPending } = useActionPipeline([
  (fd) => Object.fromEntries(fd.entries()),
  validateZodSchema
], { action: submitToServer });

return <form action={formAction}>...</form>;`
      }
    ]
  },

  // ─── BOM ──────────────────────────────────────────────────────────────────
  {
    id: "useNetworkStatus",
    name: "useNetworkStatus",
    domain: "BOM",
    description: "Tracks online/offline state and Network Information API telemetry with SSR-safe hydration.",
    signature: "function useNetworkStatus(): NetworkStatus",
    options: [],
    returns: [
      { name: "online", type: "boolean", description: "Navigator online state." },
      { name: "effectiveType", type: "string | undefined", description: "'4g', '3g', etc." },
      { name: "downlink", type: "number | undefined", description: "Bandwidth estimate." },
      { name: "rtt", type: "number | undefined", description: "Round-trip time estimate." }
    ],
    examples: [
      {
        title: "Offline Banner",
        code: `const { online, effectiveType } = useNetworkStatus();
if (!online) return <Banner>You are offline!</Banner>;`
      }
    ],
    notes: ["Uses useSyncExternalStore with a stable server snapshot to guarantee perfect hydration."]
  },
  {
    id: "usePageLifecycle",
    name: "usePageLifecycle",
    domain: "BOM",
    description: "Page visibility, focus, and frozen state tracking.",
    signature: "function usePageLifecycle(): PageLifecycle",
    options: [],
    returns: [
      { name: "visible", type: "boolean", description: "document.visibilityState === 'visible'" },
      { name: "focused", type: "boolean", description: "document.hasFocus()" },
      { name: "frozen", type: "boolean", description: "Tab is frozen by browser." }
    ],
    examples: [
      {
        title: "Pause Video when Hidden",
        code: `const { visible } = usePageLifecycle();
useEffect(() => { if (!visible) video.pause(); }, [visible]);`
      }
    ]
  },
  {
    id: "usePermission",
    name: "usePermission",
    domain: "BOM",
    description: "Permissions API monitoring with legacy fallbacks.",
    signature: "function usePermission(name: PermissionName): UsePermissionReturn",
    options: [
      { name: "name", type: "PermissionName", description: "e.g., 'camera', 'notifications'." }
    ],
    returns: [
      { name: "state", type: "PermissionState | 'unsupported'", description: "Current permission status." },
      { name: "request", type: "() => Promise<PermissionState>", description: "Trigger prompt." }
    ],
    examples: [
      {
        title: "Notifications",
        code: `const { state, request } = usePermission('notifications');`
      }
    ]
  }
];

export const HOOKS_DATA: HookDoc[] = RAW_HOOKS_DATA.map(h => ({
  ...h,
  slug: h.id,
  category: h.domain,
  tags: [h.domain, 'React 19'],
  codePreview: h.examples[0]?.code ?? ""
})) as HookDoc[];

export const hooksData = HOOKS_DATA;

export const categories = Array.from(new Set(HOOKS_DATA.map(h => h.category)));

export const hooksByCategory = HOOKS_DATA.reduce((acc, hook) => {
  const cat = hook.category;
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(hook);
  return acc;
}, {} as Record<string, HookDoc[]>);
