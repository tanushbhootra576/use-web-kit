"use client";
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackCodeEditor, 
  SandpackPreview 
} from "@codesandbox/sandpack-react";
import { Terminal } from "lucide-react";

export default function LivePlayground({ code }: { code: string }) {
  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-2xl premium-border bg-black/40 backdrop-blur-md relative">
      {/* Decorative top bar */}
      <div className="h-9 bg-white/[0.02] border-b border-white/[0.04] flex items-center px-4 justify-between relative z-10">
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
          "/node_modules/use-web-kit/index.js": `import { useState, useEffect, useRef } from 'react';
          
export const useSmartIntersection = () => {
  const [isIntersecting, set] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold: [0, 1] });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, isIntersecting };
};

export const useElementDimensions = () => {
  const [dimensions, set] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver(([e]) => {
      const rect = e.target.getBoundingClientRect();
      set({ width: Math.round(rect.width), height: Math.round(rect.height), x: Math.round(rect.x), y: Math.round(rect.y) });
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, dimensions };
};

export const useIntentObserver = () => ({ ref: () => {} }); 
export const useChunkedTask = () => ({ run: () => {}, cancel: () => {}, state: 'idle' }); 
export const useHeavyStorage = () => ({ save: async () => {}, load: async () => {} }); 
export const useAdaptivePerformance = () => ({ tier: 'high' }); 
export const useSharedWorkerPool = () => ({ postMessage: () => {}, latestMessage: null });
`,
          "/node_modules/use-web-kit/package.json": JSON.stringify({ name: "use-web-kit", version: "1.0.0", main: "index.js" }),
          "/styles.css": `body { margin: 0; background: transparent; color: white; font-family: system-ui, sans-serif; }`
        }}
      >
        <SandpackLayout style={{ background: "transparent", border: "none" }} className="!rounded-none !border-0 flex flex-col md:flex-row">
          <div className="w-full md:w-[55%] border-b md:border-b-0 md:border-r border-white/[0.04]">
            <SandpackCodeEditor 
              showTabs={false} 
              showLineNumbers={true}
              style={{ minHeight: "450px", background: "transparent" }}
            />
          </div>
          <div className="w-full md:w-[45%] relative bg-black/20">
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none z-10" />
            <SandpackPreview 
              showOpenInCodeSandbox={false} 
              showRefreshButton={false}
              style={{ minHeight: "450px", background: "transparent" }}
            />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}