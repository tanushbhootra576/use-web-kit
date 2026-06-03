"use client";

// ── BOM (Browser Object Model) ──
export { useNetworkStatus } from "./bom/useNetworkStatus";
export { usePageLifecycle } from "./bom/usePageLifecycle";
export { usePermission } from "./bom/usePermission";

<<<<<<< HEAD
// ── Concurrency & Offloading ──
export { useAdaptivePolling } from "./concurrency/useAdaptivePolling";
export { useIdleQueue } from "./concurrency/useIdleQueue";
export { useWorkerPool, WorkerExecutionError, WorkerCancelledError } from "./concurrency/useWorkerPool";
=======
export { useAdaptivePolling } from "./hooks/useAdaptivePolling";
export type { UseAdaptivePollingOptions } from "./hooks/useAdaptivePolling";

export { useNetworkStatus } from "./hooks/useNetworkStatus";
export type { NetworkStatus } from "./hooks/useNetworkStatus";
>>>>>>> cad53af05773fcc07c4594153dc696afa10f531f

// ── DOM & Rendering ──
export { useIntersection } from "./dom/useIntersection";
export { useMediaControls } from "./dom/useMediaControls";
export { useSmartIntersection } from "./dom/useSmartIntersection";

<<<<<<< HEAD
// ── Pipelines & Events ──
export { useEventPipeline, useActionPipeline, PIPELINE_SKIP } from "./pipelines/useEventPipeline";
export * from "./pipelines/useEventPipeline"; // exports pipeline factories (debounce, throttle, etc.)

// ── State & Storage ──
export { useBroadcastState } from "./state/useBroadcastState";
export { useDebouncedStorage } from "./state/useDebouncedStorage";
export { useStorage } from "./state/useStorage";

// ── Core Types ──
export * from "./core/types";
=======
export { usePageLifecycle } from "./hooks/usePageLifecycle";

export { useStorage } from "./hooks/useStorage";
export type { 
  StorageType, 
  UseStorageOptions, 
  UseStorageReturn 
} from "./hooks/useStorage";

export { usePermission } from "./hooks/usePermission";
export type { 
  PermissionName, 
  PermissionState, 
  UsePermissionReturn 
} from "./hooks/usePermission";

export { useMediaControls } from "./hooks/useMediaControls";
export type { 
  MediaState, 
  MediaControls, 
  MediaType, 
  UseMediaControlsReturn 
} from "./hooks/useMediaControls";
>>>>>>> cad53af05773fcc07c4594153dc696afa10f531f
