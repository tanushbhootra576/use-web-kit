"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

interface ValueProp {
  title: string;
  desc: string;
  gradient: string;
  icon: React.ReactNode;
  className?: string;
}

const valueProps: ValueProp[] = [
  {
    title: "Zero Memory Leaks",
    desc: "Explicit cleanup via React 19 ref callbacks. No zombie listeners, orphaned singletons, or detached DOM nodes—ever.",
    gradient: "from-[#a3ff12] to-[#22d3ee]",
    className: "md:col-span-2 md:row-span-2",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
  },
  {
    title: "O(1) Observer Cost",
    desc: "One global IntersectionObserver for the entire app. Zero render cascades.",
    gradient: "from-[#60a5fa] to-[#a78bfa]",
    className: "md:col-span-2 md:row-span-1",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    title: "React 19 Native",
    desc: "Engineered for the concurrent future. Ref cleanup, Actions, and Transition support.",
    gradient: "from-[#34d399] to-[#a3ff12]",
    className: "md:col-span-1 md:row-span-1",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    title: "Perfect Hydration",
    desc: "SSR-safe state synchronization with useSyncExternalStore.",
    gradient: "from-[#f472b6] to-[#fb923c]",
    className: "md:col-span-1 md:row-span-1",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

function SpotlightCard({ prop, index }: { prop: ValueProp; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/[0.05] p-8 lg:p-12 flex flex-col justify-between transition-all duration-500 hover:border-white/10 ${prop.className}`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(163, 255, 18, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        {/* Icon with Glow */}
        <div className="mb-8 relative inline-block">
          <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 group-hover:text-[#a3ff12] group-hover:border-[#a3ff12]/30 transition-all duration-500`}>
            {prop.icon}
          </div>
          <div className={`absolute inset-0 rounded-2xl bg-[#a3ff12] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
          {prop.title}
        </h3>
        <p className="text-zinc-500 text-base md:text-lg leading-relaxed font-light max-w-sm group-hover:text-zinc-300 transition-colors duration-500">
          {prop.desc}
        </p>
      </div>

      {/* Bottom Decoration */}
      <div className="mt-12 relative h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  );
}

export default function ValueProps() {
  return (
    <section className="py-48 px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10 bg-[#030303]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-32 text-left"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-[#a3ff12]/50" />
          <span className="text-[#a3ff12] font-mono text-xs tracking-[0.3em] uppercase font-bold">
            Architecture
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[-0.04em] leading-[0.9] max-w-4xl">
          Engineered for
          <br />
          <span className="gradient-text-animated italic">Performance.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
        {valueProps.map((prop, i) => (
          <SpotlightCard key={i} prop={prop} index={i} />
        ))}
      </div>
    </section>
  );
}
