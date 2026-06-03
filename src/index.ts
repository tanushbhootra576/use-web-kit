"use client";

// ── BOM (Browser Object Model) ──
export { useNetworkStatus } from "./bom/useNetworkStatus";
export { usePageLifecycle } from "./bom/usePageLifecycle";
export { usePermission } from "./bom/usePermission";

// ── Concurrency & Offloading ──
export { useAdaptivePolling } from "./concurrency/useAdaptivePolling";
export { useIdleQueue } from "./concurrency/useIdleQueue";
export { useWorkerPool, WorkerExecutionError, WorkerCancelledError } from "./concurrency/useWorkerPool";

// ── DOM & Rendering ──
export { useIntersection } from "./dom/useIntersection";
export { useMediaControls } from "./dom/useMediaControls";
export { useSmartIntersection } from "./dom/useSmartIntersection";

// ── Pipelines & Events ──
export { useEventPipeline, useActionPipeline, PIPELINE_SKIP } from "./pipelines/useEventPipeline";
export * from "./pipelines/useEventPipeline"; // exports pipeline factories (debounce, throttle, etc.)

// ── State & Storage ──
export { useBroadcastState } from "./state/useBroadcastState";
export { useDebouncedStorage } from "./state/useDebouncedStorage";
export { useStorage } from "./state/useStorage";

// ── Core Types ──
export * from "./core/types";
