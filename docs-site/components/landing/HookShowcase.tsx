"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hooksData, categories, HookDoc } from "@/lib/hooks-data";
import Link from "next/link";

const domainColors: Record<string, string> = {
  DOM: "from-[#a3ff12] to-[#22d3ee]",
  Concurrency: "from-[#60a5fa] to-[#a78bfa]",
  State: "from-[#f472b6] to-[#fb923c]",
  Pipelines: "from-[#34d399] to-[#a3ff12]",
  BOM: "from-[#fbbf24] to-[#f472b6]",
};

export default function HookShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHooks = useMemo(() => {
    let filtered = hooksData;
    if (activeCategory !== "All") {
      filtered = filtered.filter((h) => h.category === activeCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <section className="py-48 px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10 bg-[#030303]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-[#a3ff12]/50" />
            <span className="text-[#a3ff12] font-mono text-xs tracking-[0.3em] uppercase font-bold">
              Hook Explorer
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[-0.04em] leading-[0.9]">
            Every hook you need.
            <br />
            <span className="text-zinc-700 italic">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-md"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a3ff12]/20 to-[#60a5fa]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100" />
            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-1.5 flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 ml-3">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search hooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white font-mono text-sm w-full py-3 placeholder:text-zinc-600"
              />
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-zinc-500 mr-2">
                <span className="text-zinc-400">⌘</span>K
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Filters - Horizontal Scrollable */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-3 mb-16"
      >
        {["All", ...categories].map((category) => {
          const count =
            category === "All"
              ? hooksData.length
              : hooksData.filter((h) => h.category === category).length;
          const isActive = activeCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl text-xs font-mono font-bold tracking-widest transition-all duration-500 border flex items-center gap-3 ${
                isActive
                  ? "bg-[#a3ff12] border-[#a3ff12] text-[#030303] shadow-[0_0_30px_rgba(163,255,18,0.3)]"
                  : "bg-white/[0.03] border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              {category.toUpperCase()}
              <span className={`text-[10px] tabular-nums font-bold ${isActive ? "text-[#030303]/60" : "text-zinc-700"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredHooks.map((hook, i) => (
            <HookShowcaseCard key={hook.id} hook={hook} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function HookShowcaseCard({ hook, index }: { hook: HookDoc; index: number }) {
  const gradient = domainColors[hook.category] || "from-[#a3ff12] to-[#22d3ee]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link
        href={`/docs/api#${hook.id}`}
        className="block h-full relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/[0.05] p-10 flex flex-col transition-all duration-700 hover:border-white/10 hover:translate-y-[-8px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Subtle internal gradient glow */}
        <div className={`absolute -inset-10 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-1000`} />
        
        {/* Hook Metadata */}
        <div className="flex justify-between items-start w-full mb-10 relative z-10">
          <div className={`px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase group-hover:border-[#a3ff12]/30 group-hover:text-[#a3ff12] transition-all duration-500`}>
            {hook.category}
          </div>
          <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-45">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#a3ff12]">
              <line x1="5" y1="19" x2="19" y2="5" /><polyline points="10 5 19 5 19 14" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 flex-grow">
          <h3 className="text-3xl font-bold text-white mb-6 tracking-tight group-hover:text-[#a3ff12] transition-colors duration-500">
            {hook.name}
          </h3>

          <p className="text-zinc-500 text-base leading-relaxed font-light mb-12 line-clamp-3 group-hover:text-zinc-400 transition-colors duration-500">
            {hook.description}
          </p>
        </div>

        {/* Enhanced Code Preview - "Code Peek" */}
        <div className="relative mt-auto overflow-hidden rounded-2xl bg-black/60 border border-white/[0.04] group-hover:border-[#a3ff12]/10 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <pre className="p-6 text-[11px] font-mono text-zinc-500 leading-[1.8] overflow-x-auto opacity-40 group-hover:opacity-100 transition-all duration-700">
            <code className="block">
              {hook.codePreview || `import { ${hook.name} } from 'use-web-kit';`}
            </code>
          </pre>
          
          {/* Subtle scanline in code block */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent h-10 animate-scan-line" />
        </div>
      </Link>
    </motion.div>
  );
}
