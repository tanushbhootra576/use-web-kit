# API Reference

Complete documentation for the `use-web-kit` hook library.

## DOM Engine

### \`useSmartIntersection(options)\`
A global singleton intersection observer. O(1) performance regardless of component count.

**Options:**
- \`onIntersect\`: \`(entry: IntersectionObserverEntry) => void\`
- \`threshold\`: \`number | number[]\`
- \`rootMargin\`: \`string\`

**Returns:**
- \`ref\`: Callback ref to attach to your DOM element.

### \`usePageLifecycle()\`
Tracks page visibility and freeze states to pause expensive operations when the tab is hidden.

**Returns:**
- \`state\`: \`'active' | 'passive' | 'hidden' | 'frozen' | 'terminated'\`

---

## Concurrency Engine

### \`useWorkerPool(workerFunction, options)\`
Executes heavy computations off the main thread using a managed pool of Web Workers.

**Options:**
- \`maxWorkers\`: \`number\` (Defaults to \`navigator.hardwareConcurrency - 1\`)

**Returns:**
- \`run\`: \`(...args) => Promise<Result>\`

### \`useIdleQueue()\`
Defers non-critical execution (like analytics) to browser idle periods.

**Returns:**
- \`enqueue\`: \`(task: () => void) => void\`

---

## State Synchronization

### \`useBroadcastState(key, initialValue)\`
Cross-tab state synchronization using \`BroadcastChannel\`. Bypasses React context for O(1) rendering.

**Returns:**
- \`[state, setState]\` (useState compatible signature)

### \`useDebouncedStorage(key, initialValue, options)\`
SSR-safe \`localStorage\` wrapper with debounced writes and cross-tab syncing.

**Options:**
- \`debounceMs\`: \`number\` (Default: 300)

**Returns:**
- \`[state, setState]\` (useState compatible signature)

---

## Network & BOM

### \`useNetworkStatus()\`
Tracks detailed network conditions to adaptively degrade features.

**Returns:**
- \`isOnline\`: \`boolean\`
- \`effectiveType\`: \`'slow-2g' | '2g' | '3g' | '4g'\`
- \`downlink\`: \`number\`
- \`rtt\`: \`number\`

### \`useAdaptivePolling(callback, options)\`
Polling that slows down on 3G and pauses when the tab is hidden.

**Options:**
- \`interval\`: \`number\`
- \`visibilityInterval\`: \`number\`

**Returns:**
- \`{ pause, resume }\`

### \`useMediaControls()\`
Abstracted HTML5 audio/video state without native DOM listener bloat.

**Returns:**
- \`ref\`: Callback ref to attach to \`<video>\` or \`<audio>\`
- \`state\`: \`{ isPlaying, volume, currentTime, duration }\`
- \`controls\`: \`{ play, pause, seek, setVolume }\`

---

## Action Pipelines

### \`useEventPipeline(stages)\`
Compose async event handlers with automatic retry and rollback mechanisms.

**Returns:**
- \`execute\`: \`(payload: any) => Promise<void>\`
