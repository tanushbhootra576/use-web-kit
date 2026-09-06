"use client";
import { 
  SandpackProvider, 
  SandpackCodeEditor, 
  SandpackPreview 
} from "@codesandbox/sandpack-react";
import { Terminal } from "lucide-react";

export default function LivePlayground({ code }: { code: string }) {
  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-2xl premium-border bg-black/40 backdrop-blur-md relative group transition-all duration-500 hover:shadow-accent/5 hover:border-white/10">
      {/* Decorative top bar */}
      <div className="h-9 bg-white/[0.02] border-b border-white/[0.04] flex items-center px-4 justify-between relative z-10 transition-colors duration-500 group-hover:bg-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Terminal size={12} className="text-accent" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <SandpackProvider
        template="react-ts"
        theme={{
          colors: {
            surface1: "transparent",
            surface2: "rgba(255, 255, 255, 0.02)",
            surface3: "rgba(255, 255, 255, 0.05)",
            clickable: "#9ca3af",
            base: "#d1d5db",
            disabled: "#4b5563",
            hover: "#ffffff",
            accent: "#5BE30C",
            error: "#ef4444",
            errorSurface: "rgba(239, 68, 68, 0.1)",
          },
          syntax: {
            plain: "#d1d5db",
            comment: { color: "#6b7280", fontStyle: "italic" },
            keyword: "#5BE30C",
            tag: "#a3ff12",
            punctuation: "#6b7280",
            definition: "#ffffff",
            property: "#a3ff12",
            static: "#5BE30C",
            string: "#fcd34d",
          },
          font: {
            body: "var(--font-sans)",
            mono: "var(--font-mono)",
            size: "13px",
            lineHeight: "24px",
          },
        }}
        files={{
          "/App.tsx": code,
          "/index.tsx": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
          "/node_modules/use-web-kit/index.js": `import { useState, useEffect, useRef } from 'react';
export const useSmartIntersection = () => { const [isIntersecting, set] = useState(false); const ref = useRef(null); useEffect(() => { if (!ref.current) return; const obs = new IntersectionObserver(([e]) => set(e.isIntersecting)); obs.observe(ref.current); return () => obs.disconnect(); }, []); return { ref, isIntersecting }; };
export const root = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const rootMargin = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const threshold = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const lowPriority = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const onIntersect = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const ref = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const isIntersecting = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const entry = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useElementDimensions = () => { const [dimensions, set] = useState({ width: 0, height: 0, x: 0, y: 0 }); const ref = useRef(null); useEffect(() => { if (!ref.current) return; const obs = new ResizeObserver(([e]) => { const rect = e.target.getBoundingClientRect(); set({ width: Math.round(rect.width), height: Math.round(rect.height), x: Math.round(rect.x), y: Math.round(rect.y) }); }); obs.observe(ref.current); return () => obs.disconnect(); }, []); return { ref, dimensions }; };
export const dimensions = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useIntentObserver = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const onIntent = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const once = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useIntersection = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useMediaControls = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const state = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const controls = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useWorkerPool = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const maxWorkers = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const timeout = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const terminateOnIdle = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const run = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const cancel = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const isRunning = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const pendingCount = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const terminate = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useIdleQueue = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const fallbackInterval = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const enqueue = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const clearQueue = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const queueLength = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useAdaptivePolling = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const interval = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const enabled = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const pauseOnBackground = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const backgroundSlowdownFactor = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useChunkedTask = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const chunkTimeMs = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useSharedWorkerPool = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const workerUrl = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const name = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const waitForReady = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const postMessage = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const broadcast = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const isReady = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const latestMessage = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useDebouncedStorage = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const storage = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const debounceMs = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const broadcastSync = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const serializer = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const value = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const setValue = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const removeValue = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const flush = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useStorage = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useBroadcastState = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const [0] = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const [1] = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useHeavyStorage = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const save = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const load = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const remove = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const isSupported = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useEventPipeline = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const onComplete = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const onError = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const handler = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const error = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const isPending = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const reset = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useActionPipeline = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const action = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const formAction = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useNetworkStatus = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const online = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const effectiveType = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const downlink = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const rtt = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const usePageLifecycle = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const visible = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const focused = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const frozen = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const usePermission = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const request = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const useAdaptivePerformance = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const tier = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const hardwareConcurrency = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const deviceMemory = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });
export const saveData = () => new Proxy({}, { get: (t, p) => typeof p === 'string' && p.match(/is|has/) ? false : p === 'ref' || p === 'sentinelRef' ? () => {} : () => {} });`,
          "//node_modules/use-web-kit/package.json": JSON.stringify({ name: "use-web-kit", version: "1.0.0", main: "index.js" }),
          "/styles.css": `html, body { margin: 0; height: 100%; background: transparent !important; color: white; font-family: system-ui, sans-serif; overflow: hidden; } #root { height: 100%; overflow: auto; }`
        }}
      >
        <div className="flex flex-col w-full border-t border-white/[0.04]">
          <div className="w-full border-b border-white/[0.04] h-[450px] flex flex-col">
            <SandpackCodeEditor 
              showTabs={false} 
              showLineNumbers={true}
              style={{ flex: 1, minHeight: 0, height: "100%", background: "transparent" }}
            />
          </div>
          <div className="w-full h-[450px] relative bg-black/20 flex flex-col">
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none z-10" />
            <SandpackPreview 
              showOpenInCodeSandbox={false} 
              showRefreshButton={false}
              style={{ flex: 1, minHeight: 0, height: "100%", background: "transparent" }}
            />
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}