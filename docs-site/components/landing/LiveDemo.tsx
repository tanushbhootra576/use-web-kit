"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const codeLines = [
  { text: `import { useBroadcastState } from 'use-web-kit';`, type: "import" },
  { text: ``, type: "blank" },
  { text: `export default function Cart() {`, type: "keyword" },
  { text: `  // Syncs state across tabs instantly`, type: "comment" },
  { text: `  const [items, setItems] = useBroadcastState('cart', 0);`, type: "code" },
  { text: ``, type: "blank" },
  { text: `  return (`, type: "code" },
  { text: `    <button onClick={() => setItems(n => n + 1)}>`, type: "jsx" },
  { text: `      Add to Cart ({items})`, type: "jsx" },
  { text: `    </button>`, type: "jsx" },
  { text: `  );`, type: "code" },
  { text: `}`, type: "keyword" },
];

function colorize(line: { text: string; type: string }) {
  switch (line.type) {
    case "import":
      return (
        <span className="font-mono">
          <span className="text-cyan-400 font-bold">import</span>
          <span className="text-zinc-500">{" { "}</span>
          <span className="text-white">useBroadcastState</span>
          <span className="text-zinc-500">{" } "}</span>
          <span className="text-cyan-400 font-bold">from</span>
          <span className="text-cyan-400/80"> &apos;use-web-kit&apos;</span>
          <span className="text-zinc-500">;</span>
        </span>
      );
    case "comment":
      return <span className="text-zinc-700 italic font-mono">{line.text}</span>;
    case "keyword":
      return <span className="text-cyan-400 font-bold font-mono">{line.text}</span>;
    case "jsx":
      return <span className="text-zinc-400 font-mono">{line.text}</span>;
    default:
      return <span className="text-zinc-500 font-mono">{line.text}</span>;
  }
}

export default function LiveDemo() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [items, setItems] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= codeLines.length) clearInterval(interval);
          }, 80);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-60 px-6 lg:px-12 max-w-screen-2xl mx-auto relative z-10 bg-[#030303]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-24 mb-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-cyan-400/50" />
            <span className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase font-bold">
              Interactive Demo
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[-0.04em] leading-[0.9] mb-10">
            Write once.
            <br />
            <span className="text-zinc-800 italic">Sync everywhere.</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl leading-relaxed font-light">
            Zero-latency state synchronization via the BroadcastChannel API.
            The <code className="text-cyan-400 font-bold">useBroadcastState</code> hook keeps all browser tabs perfectly in sync — with <span className="text-white italic">zero backend overhead</span>.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Code Editor - Premium Glass */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-cyan-400/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
          <div className="relative h-full bg-[#0a0a0a] rounded-[2rem] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            {/* Window chrome - Refined */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold">
                useBroadcastState.ts
              </span>
              <div className="w-12 h-[1px] bg-white/5" />
            </div>

            {/* Code content */}
            <div className="p-10 overflow-x-auto min-h-[400px] relative">
              <pre className="text-[14px] leading-[2.2]">
                {codeLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-8 transition-all duration-500"
                    style={{
                      opacity: i < visibleLines ? 1 : 0,
                      transform: i < visibleLines ? "translateX(0)" : "translateX(-12px)",
                    }}
                  >
                    <span className="text-zinc-800 text-[11px] select-none w-4 text-right shrink-0 tabular-nums font-mono font-bold">
                      {i + 1}
                    </span>
                    <code>{colorize(line)}</code>
                  </div>
                ))}
                {visibleLines < codeLines.length && (
                  <span className="inline-block w-2.5 h-5 bg-cyan-400 ml-12 animate-pulse rounded-sm" />
                )}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Visual Result - Interactive Playground */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-cyan-400/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
          <div className="relative h-full bg-[#0a0a0a] rounded-[2rem] border border-white/10 p-10 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
            {/* Ambient grid inside the result */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            
            <div className="w-full flex gap-6 relative z-10">
              {/* Tab A */}
              <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-8 relative group/tab hover:border-cyan-400/30 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl">
                <div className="absolute top-4 left-6 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.25em] mt-1 font-bold">
                  CLIENT_ALPHA
                </div>
                <div className="text-7xl font-black text-white tracking-tighter tabular-nums text-glow">
                  <motion.span
                    key={items}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {items}
                  </motion.span>
                </div>
                <button
                  onClick={() => setItems((n) => n + 1)}
                  className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-mono text-sm font-bold hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-95 uppercase tracking-widest"
                >
                  Broadcast
                </button>
              </div>

              {/* Tab B */}
              <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-8 relative group/tab hover:border-white/20 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-2xl">
                <div className="absolute top-4 left-6 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
                <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.25em] mt-1 font-bold">
                  CLIENT_BETA
                </div>
                <div className="text-7xl font-black text-white tracking-tighter tabular-nums opacity-80">
                  <motion.span
                    key={items}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.05 }}
                  >
                    {items}
                  </motion.span>
                </div>
                <button
                  onClick={() => setItems((n) => n + 1)}
                  className="w-full py-4 rounded-2xl border border-white/10 bg-white/[0.05] text-white font-mono text-sm font-bold hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Broadcast
                </button>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 text-[10px] font-mono text-zinc-600 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5 uppercase tracking-widest font-bold">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse-neon shadow-[0_0_12px_#22d3ee]" />
              Live Pipeline: BroadcastChannel active
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
