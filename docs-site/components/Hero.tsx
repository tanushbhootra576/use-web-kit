"use client";

import { motion } from "framer-motion";
import { Terminal, Activity, Cpu, ArrowRight, Layers, Zap } from "lucide-react";
import Link from "next/link";
import InstallTerminal from "./InstallTerminal";
import KineticType from "./KineticType";
import GithubStarButton from "./GithubStarButton";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-16 pb-20 overflow-hidden bg-transparent">
      {/* Additional ambient glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/[0.03] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          {/* Left Content - 7/12 */}
          <div className="lg:col-span-7 pt-8 pointer-events-auto">
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

              <h1 className="text-5xl md:text-7xl lg:text-[80px] display-heading mb-8 leading-tight tracking-tighter">
                Orchestrate<br />The Runtime.
              </h1>

              <p className="text-zinc-500 text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-6">
                Infrastructure-grade React hooks for low-latency orchestration.
                Built for frame-perfect performance and O(1) memory overhead
                using the browser&apos;s native capabilities.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14 mt-10">
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
                
                <div className="hidden sm:block">
                  <GithubStarButton className="py-2.5 h-full" />
                </div>
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

          {/* Right Content - 5/12 */}
          <div className="lg:col-span-5 relative hidden lg:block pointer-events-auto h-full min-h-[600px] pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative z-20 w-full h-[550px]"
            >
              {/* KineticType floats bare — no card, no background */}
              <KineticType 
                shape="torusKnot" 
                word="USE-WEB-KIT " 
                color="#5BE30C" 
                fill="transparent"
                density={10}
                distort={8}
                sizePercent={102}
                speed={8}
                hoverBoost={5}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
