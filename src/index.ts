"use client";

// ── BOM (Browser Object Model) ──
export { useNetworkStatus } from "./bom/useNetworkStatus";
export { usePageLifecycle } from "./bom/usePageLifecycle";
export { usePermission } from "./bom/usePermission";
export { useAdaptivePerformance } from "./bom/useAdaptivePerformance";
export type { AdaptivePerformanceMetrics, PerformanceTier } from "./bom/useAdaptivePerformance";

// ── Concurrency & Offloading ──
export { useAdaptivePolling } from "./concurrency/useAdaptivePolling";
export { useIdleQueue } from "./concurrency/useIdleQueue";
export { useWorkerPool, WorkerExecutionError, WorkerCancelledError } from "./concurrency/useWorkerPool";
export { useChunkedTask } from "./concurrency/useChunkedTask";
export type { ChunkedTaskState, UseChunkedTaskOptions } from "./concurrency/useChunkedTask";
export { useSharedWorkerPool } from "./concurrency/useSharedWorkerPool";
export type { UseSharedWorkerPoolOptions, UseSharedWorkerPoolReturn } from "./concurrency/useSharedWorkerPool";

// ── DOM & Rendering ──
export { useIntersection } from "./dom/useIntersection";
export { useMediaControls } from "./dom/useMediaControls";
export { useSmartIntersection } from "./dom/useSmartIntersection";
export { useElementDimensions } from "./dom/useElementDimensions";
export type { ElementDimensions } from "./dom/useElementDimensions";
export { useIntentObserver } from "./dom/useIntentObserver";
export type { UseIntentObserverOptions } from "./dom/useIntentObserver";

// ── Pipelines & Events ──
export { useEventPipeline, useActionPipeline, PIPELINE_SKIP } from "./pipelines/useEventPipeline";
export * from "./pipelines/useEventPipeline"; // exports pipeline factories (debounce, throttle, etc.)

// ── State & Storage ──
export { useBroadcastState } from "./state/useBroadcastState";
export { useDebouncedStorage } from "./state/useDebouncedStorage";
export { useStorage } from "./state/useStorage";
export { useHeavyStorage } from "./state/useHeavyStorage";
export type { UseHeavyStorageReturn } from "./state/useHeavyStorage";

// ── Core Types ──
export * from "./core/types";
