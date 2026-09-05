"use client";
import { motion } from "framer-motion";

export default function FrameGraph() {
  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1400px] mx-auto w-full relative z-10 border-t border-white/[0.04]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block px-3 py-1 border border-accent/20 bg-accent/5 mb-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-accent">Telemetry</span>
          </div>
          <h2 className="text-4xl md:text-5xl display-heading mb-6">Zero-Drop <br />Frame Graph.</h2>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
            Traditional React applications block the main thread, leading to dropped frames during heavy DOM events like scrolling. 
            By entirely bypassing the React Render phase for continuous events, we guarantee a locked 60 FPS runtime.
          </p>
        </div>

        <div className="relative h-64 border border-white/[0.06] bg-black/40 backdrop-blur-md rounded-2xl p-6 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-runtime-grid opacity-20" />
          
          <div className="relative z-10 h-full w-full flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/* Bad React Line (Spiky) */}
              <motion.polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                points="0,50 10,60 20,40 30,80 40,30 50,70 60,40 70,80 80,50 90,70 100,40"
                animate={{ x: [-10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="opacity-40"
              />
              
              {/* use-web-kit Line (Flat Perfect) */}
              <motion.line
                x1="0"
                y1="85"
                x2="100"
                y2="85"
                stroke="#5BE30C"
                strokeWidth="2"
                animate={{ strokeDashoffset: [0, -100] }}
                strokeDasharray="10 10"
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </div>

          <div className="absolute top-6 right-6 flex flex-col gap-2 font-mono text-[10px] uppercase">
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Standard Event (22 FPS)
            </div>
            <div className="flex items-center gap-2 text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              use-web-kit (60 FPS)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}