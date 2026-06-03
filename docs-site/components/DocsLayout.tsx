"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { Activity, Zap, Cpu, Terminal } from "lucide-react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-runtime-grid opacity-10 pointer-events-none" />
      <div className="scanline" />

      {/* Left Sidebar - High-density technical nav */}
      <aside className="hidden lg:block w-80 border-r border-white/5 sticky top-0 h-screen overflow-y-auto no-scrollbar bg-black/40 backdrop-blur-sm z-20">
        <div className="p-8 pb-32">
           <Sidebar />
        </div>
      </aside>

      {/* Main Documentation Content - Optimized for reading density */}
      <main className="flex-1 min-w-0 flex flex-col items-start relative z-10">
        <div className="w-full max-w-5xl px-8 py-32 lg:px-20 lg:py-40">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
              {children}
           </motion.div>
        </div>

        {/* Bottom Section Marker */}
        <div className="w-full px-8 lg:px-20 pb-20 mt-auto">
           <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/10 to-transparent" />
           <div className="mt-8 flex justify-between items-center opacity-30">
              <span className="mono-label !text-[8px]">End of Segment</span>
              <span className="mono-label !text-[8px]">Section Hash: 0x5BE30C</span>
           </div>
        </div>
      </main>

      {/* Right Sidebar - Contextual Navigation / Runtime Panel */}
      <aside className="hidden xl:block w-96 border-l border-white/5 sticky top-0 h-screen overflow-y-auto no-scrollbar bg-black/20 z-20">
        <div className="p-10 flex flex-col gap-12">
          {/* On this page nav */}
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-1 h-1 bg-accent" />
               <span className="mono-label text-zinc-500 !text-[9px]">Document Tree</span>
            </div>
            <nav className="flex flex-col gap-4">
              <div className="group cursor-pointer">
                 <div className="text-[11px] text-accent font-bold uppercase tracking-wider mb-1">01. Overview</div>
                 <div className="h-0.5 w-8 bg-accent/40 transition-all group-hover:w-full" />
              </div>
              <div className="group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                 <div className="text-[11px] text-white font-medium uppercase tracking-wider mb-1">02. Architecture</div>
                 <div className="h-px w-4 bg-white/20 transition-all group-hover:w-full" />
              </div>
              <div className="group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                 <div className="text-[11px] text-white font-medium uppercase tracking-wider mb-1">03. Performance</div>
                 <div className="h-px w-4 bg-white/20 transition-all group-hover:w-full" />
              </div>
              <div className="group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                 <div className="text-[11px] text-white font-medium uppercase tracking-wider mb-1">04. Installation</div>
                 <div className="h-px w-4 bg-white/20 transition-all group-hover:w-full" />
              </div>
            </nav>
          </div>

          {/* Runtime Status Panel */}
          <div className="pt-10 border-t border-white/5">
            <div className="flex items-center gap-3 mb-8">
               <Activity size={14} className="text-zinc-600" />
               <span className="mono-label text-zinc-500 !text-[9px]">Runtime Status</span>
            </div>
            
            <div className="space-y-6">
               <div className="glass-panel p-5 rounded-none border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                     <Cpu size={40} />
                  </div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-center mb-4">
                        <span className="mono-label !text-[7px] text-zinc-600">Event Loop Latency</span>
                        <span className="text-[10px] font-mono text-accent">0.12ms</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-none overflow-hidden mb-6">
                        <motion.div 
                          animate={{ width: ["20%", "45%", "30%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="h-full bg-accent/40" 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <div className="mono-label !text-[7px] text-zinc-700 mb-1">Threads</div>
                           <div className="text-xs font-mono text-white">4 Active</div>
                        </div>
                        <div>
                           <div className="mono-label !text-[7px] text-zinc-700 mb-1">Heap</div>
                           <div className="text-xs font-mono text-white">12.4MB</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-5 border border-white/5 bg-white/[0.01]">
                  <div className="flex items-center gap-3 mb-4">
                     <Terminal size={12} className="text-accent/60" />
                     <span className="mono-label !text-[8px] text-zinc-500">Quick Command</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 bg-black/60 p-3 border border-white/5">
                     $ npx use-web-kit init
                  </div>
               </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

