"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const metrics = [
  {
    label: "Bundle Size",
    value: "2.8",
    suffix: "KB",
    description: "Smaller than a standard React component.",
    comparison: "94% smaller than rivals",
  },
  {
    label: "Memory Overhead",
    value: "0",
    suffix: "MB",
    description: "Zero render cascades through singletons.",
    comparison: "Pure O(1) complexity",
  },
  {
    label: "Frame Rate",
    value: "120",
    suffix: "FPS",
    description: "RAF-batched updates for fluid motion.",
    comparison: "Perfect 16.6ms intervals",
  },
  {
    label: "Dependencies",
    value: "0",
    suffix: "",
    description: "Zero external npm dependencies.",
    comparison: "Standard library compatible",
  },
];

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={containerRef} className="py-60 px-6 lg:px-12 max-w-screen-2xl mx-auto relative overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      
      <motion.div style={{ y }} className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-24 mb-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#a3ff12]/50" />
              <span className="text-[#a3ff12] font-mono text-xs tracking-[0.3em] uppercase font-bold">
                Metrics
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[-0.04em] leading-[0.9]">
              Speed is our
              <br />
              <span className="text-zinc-800 italic">Signature.</span>
            </h2>
          </div>
          
          <div className="lg:pt-24 max-w-md">
            <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed">
              Every hook is engineered with a <span className="text-white font-medium italic">zero-cost abstraction</span> mindset. We don't just optimize React; we bypass the overhead entirely.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter tabular-nums">
                  {metric.value}
                </span>
                <span className="text-2xl font-bold text-[#a3ff12]">
                  {metric.suffix}
                </span>
              </div>
              <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] font-bold mb-6">
                {metric.label}
              </h4>
              <p className="text-zinc-600 text-sm font-light mb-4 leading-relaxed group-hover:text-zinc-400 transition-colors">
                {metric.description}
              </p>
              <div className="mt-auto pt-4 border-t border-white/[0.04] text-[10px] font-mono text-[#a3ff12]/60 font-bold uppercase tracking-wider">
                {metric.comparison}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
