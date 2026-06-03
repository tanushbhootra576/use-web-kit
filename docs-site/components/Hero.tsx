"use client";

import { motion } from "framer-motion";
import { Terminal, Activity, Cpu, ArrowRight, Layers, Zap } from "lucide-react";
import Link from "next/link";
import InstallTerminal from "./InstallTerminal";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-24 pb-20 overflow-hidden bg-background">
      {/* Background Systems */}
      <div className="absolute inset-0 bg-runtime-grid opacity-15" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/[0.03] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          {/* Left Content — 7/12 */}
          <div className="lg:col-span-7 pt-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="px-3 py-1 border border-accent/20 bg-accent/5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-subtle" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-semibold text-accent">Runtime Active</span>
                </div>
                <span className="meta-text text-zinc-700">Build 2026.05</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[80px] display-heading mb-8">
                Orchestrate <br />
                <span className="text-zinc-700 italic font-light">The Runtime.</span>
              </h1>

              <p className="text-zinc-500 text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-10">
                Infrastructure-grade React hooks for low-latency orchestration.
                Built for frame-perfect performance and O(1) memory overhead
                using the browser&apos;s native capabilities.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
                <Link
                  href="/docs"
                  className="group px-7 py-3.5 bg-white text-black font-semibold text-[12px] uppercase tracking-[0.15em] transition-all hover:bg-accent hover:text-black flex items-center gap-2.5"
                >
                  Get Started
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/docs/api"
                  className="px-7 py-3.5 border border-white/10 bg-white/[0.03] text-white font-semibold text-[12px] uppercase tracking-[0.15em] hover:bg-white/[0.07] transition-all"
                >
                  API Reference
                </Link>
              </div>

              {/* Technical Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Layers, label: "Zero-Cost", value: "0 deps" },
                  { icon: Cpu, label: "Type-Safe", value: "100% TS" },
                  { icon: Activity, label: "Latency", value: "<0.1ms" },
                  { icon: Zap, label: "Bundle", value: "<3KB" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-t border-white/[0.05] group cursor-default">
                    <item.icon size={13} className="text-zinc-700 group-hover:text-accent transition-colors" />
                    <div className="flex flex-col -space-y-0.5">
                      <span className="font-mono text-[10px] text-white/80 font-medium">{item.value}</span>
                      <span className="meta-text !text-[8px] text-zinc-700">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Content — Runtime Monitor 5/12 */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative z-20"
            >
              {/* Main Visual Panel */}
              <div className="glass-panel p-1 border-white/[0.08] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800" />
                  </div>
                  <div className="meta-text !text-[8px] text-zinc-600">RuntimeMonitor.tsx</div>
                </div>

                <div className="p-6 bg-black/40">
                  <div className="space-y-5">
                    {/* Orchestration Graph */}
                    <div className="h-40 border border-white/[0.05] relative overflow-hidden bg-black/60">
                      <div className="absolute inset-0 bg-runtime-grid opacity-10" />

                      {/* Animated Lines */}
                      <motion.div
                        animate={{ x: [0, 400], opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="orchestration-line w-20 h-px top-1/4 left-0"
                      />
                      <motion.div
                        animate={{ x: [-100, 300], opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                        className="orchestration-line w-32 h-px top-1/2 left-0"
                      />
                      <motion.div
                        animate={{ x: [0, 400], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                        className="orchestration-line w-16 h-px top-3/4 left-0"
                      />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="w-14 h-14 border border-accent/20 rotate-45 flex items-center justify-center">
                            <Cpu size={20} className="text-accent/40 -rotate-45" />
                          </div>
                          <div className="absolute -inset-3 border border-accent/10 rotate-45 animate-[spin_12s_linear_infinite]" />
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-white/[0.05] bg-white/[0.01]">
                        <span className="meta-text !text-[7px] text-zinc-600 mb-1 block">Context Swapping</span>
                        <span className="text-lg font-mono text-white font-medium">0.00ns</span>
                      </div>
                      <div className="p-3 border border-white/[0.05] bg-white/[0.01]">
                        <span className="meta-text !text-[7px] text-zinc-600 mb-1 block">Memory Pressure</span>
                        <span className="text-lg font-mono text-accent font-medium">Stable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Install Terminal */}
              <div className="absolute -bottom-8 -left-8 w-64 hidden xl:block shadow-2xl transition-transform hover:-translate-y-1">
                <InstallTerminal />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
