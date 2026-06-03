"use client";

import HookCard from "./HookCard";
import { hooksData } from "@/lib/hooks-data";
import { motion } from "framer-motion";
import { Activity, Zap, Box, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Primitives", value: "09", icon: Box },
  { label: "Footprint", value: "<3KB", icon: Zap },
  { label: "Contexts", value: "0.0", icon: ShieldCheck },
  { label: "Coverage", value: "100%", icon: Activity },
];

export default function HookExplorer() {
  return (
    <div className="relative">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 mb-24">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-black p-8 group transition-colors hover:bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-6">
              <stat.icon size={12} className="text-zinc-700 group-hover:text-accent transition-colors" />
              <span className="mono-label !text-[8px] text-zinc-600 tracking-[0.3em]">{stat.label}</span>
            </div>
            <div className="text-4xl font-bold text-white tracking-tighter">{stat.value}</div>
            <div className="mt-4 h-px w-8 bg-white/10 group-hover:w-full group-hover:bg-accent/40 transition-all" />
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-end">
        <div className="lg:col-span-7">
           <span className="mono-label text-accent mb-6 block">Library Manifest</span>
           <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
             Engineered <br />
             <span className="text-zinc-800 italic font-extralight">for Determinism.</span>
           </h2>
        </div>
        <div className="lg:col-span-5">
           <p className="text-zinc-500 text-lg font-light leading-relaxed">
             A collection of low-level primitives designed to operate with minimal 
             interruption to the browser's main thread. Zero dependencies, 
             fully typed, and built for production runtimes.
           </p>
        </div>
      </div>

      {/* Hook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
        {hooksData.map((hook, i) => (
          <motion.div
            key={hook.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="bg-black"
          >
            <HookCard hook={hook} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

