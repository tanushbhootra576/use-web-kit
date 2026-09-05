"use client";
import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

// ── Mini-demo: Chunked task — animated chunk blocks processing ──────────
function ChunkedDemo() {
  const total = 24;
  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="w-4 h-4 rounded-sm"
          initial={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          animate={{
            backgroundColor: [
              "rgba(255,255,255,0.04)",
              "rgba(91,227,12,0.8)",
              "rgba(91,227,12,0.15)",
            ],
          }}
          transition={{
            duration: 0.4,
            delay: (i % 8) * 0.08 + Math.floor(i / 8) * 0.8,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Mini-demo: Single shared observer vs N observers ────────────────────
function ObserverDemo() {
  const items = 6;
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* One shared observer node */}
      <div className="flex items-center gap-2">
        <div className="shrink-0 w-7 h-7 border border-accent/40 bg-accent/10 rounded flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
        <div className="h-px flex-1 bg-accent/20" />
        {Array.from({ length: items }).map((_, i) => (
          <motion.div
            key={i}
            className="w-5 h-5 rounded border border-white/10 bg-white/[0.03]"
            animate={{ borderColor: ["rgba(255,255,255,0.1)", "rgba(91,227,12,0.4)", "rgba(255,255,255,0.1)"] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-[9px] font-mono text-accent uppercase tracking-widest">1 observer</div>
        <div className="h-px flex-1 bg-white/[0.04]" />
        <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{items} elements</div>
      </div>
    </div>
  );
}

// ── Mini-demo: Storage meter ────────────────────────────────────────────
function StorageDemo() {
  const bars = [
    { label: "cache.db",    size: 78 },
    { label: "assets.bin",  size: 45 },
    { label: "prefetch.gz", size: 91 },
  ];
  return (
    <div className="flex flex-col gap-3 w-full">
      {bars.map((bar, i) => (
        <div key={bar.label} className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] text-zinc-600">{bar.label}</span>
            <span className="font-mono text-[9px] text-zinc-600">{bar.size}%</span>
          </div>
          <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent/60 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${bar.size}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
      <div className="text-[9px] font-mono text-zinc-700 mt-1 uppercase tracking-widest">
        Off-main-thread · OPFS
      </div>
    </div>
  );
}

// ── Mini-demo: Pipeline stages flowing ─────────────────────────────────
function PipelineDemo() {
  const stages = ["validate", "transform", "authorize", "persist", "respond"];
  return (
    <div className="flex items-center gap-0 overflow-hidden w-full">
      {stages.map((stage, i) => (
        <div key={stage} className="flex items-center flex-1 min-w-0">
          <motion.div
            className="flex flex-col items-center gap-1 flex-1 min-w-0"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              className="w-2 h-2 rounded-full border border-accent/40"
              animate={{ backgroundColor: ["transparent", "rgba(91,227,12,0.8)", "transparent"] }}
              transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
            />
            <span className="font-mono text-[8px] text-zinc-600 truncate text-center w-full px-1">
              {stage}
            </span>
          </motion.div>
          {i < stages.length - 1 && (
            <motion.div
              className="h-px flex-1 min-w-[8px] max-w-[20px]"
              animate={{ backgroundColor: ["rgba(255,255,255,0.04)", "rgba(91,227,12,0.4)", "rgba(255,255,255,0.04)"] }}
              transition={{ duration: 2.5, delay: i * 0.4 + 0.3, repeat: Infinity }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Mini-demo: Network status live badge ────────────────────────────────
function NetworkDemo() {
  const tiers = ["SLOW-2G", "2G", "3G", "4G", "FAST"];
  const [tier, setTier] = useState(4);

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-accent"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          effectiveType: <span className="text-accent">{tiers[tier]}</span>
        </span>
      </div>
      {/* Signal bars */}
      <div className="flex items-end gap-1 h-8">
        {tiers.map((_, i) => (
          <motion.div
            key={i}
            className="w-3 rounded-sm"
            style={{ height: `${((i + 1) / tiers.length) * 100}%` }}
            animate={{ backgroundColor: i <= tier ? "rgba(91,227,12,0.7)" : "rgba(255,255,255,0.06)" }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
        useNetworkStatus · isOnline: true
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────
export default function BentoGrid() {
  return (
    <section className="py-8 px-6 lg:px-10 max-w-[1400px] mx-auto w-full relative z-10">

      {/* Asymmetric bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(200px,auto)]">

        {/* ── Card 1: useChunkedTask — HERO card, wide + tall ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7 md:row-span-2 border border-white/[0.05] bg-white/[0.01] p-8 flex flex-col justify-between overflow-hidden relative group hover:border-white/[0.1] transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/[0.06] bg-white/[0.02] mb-6">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">concurrency</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                useChunkedTask
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Process one million items without blocking a single frame. Time-slices heavy computation
                across browser idle periods using a cooperative scheduler.
              </p>
            </div>

            <div className="mt-auto">
              <div className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest mb-4">
                Live · Processing chunks
              </div>
              <ChunkedDemo />
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.04] pt-5">
              <span className="font-mono text-[10px] text-zinc-600">16ms budget · RAF-synced</span>
              <span className="font-mono text-[10px] text-accent">0 dropped frames</span>
            </div>
          </div>
        </motion.div>

        {/* ── Card 2: O(1) Observer — tall right ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-5 border border-white/[0.05] bg-white/[0.01] p-7 flex flex-col justify-between overflow-hidden relative group hover:border-white/[0.1] transition-colors"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/[0.06] bg-white/[0.02] mb-5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">dom</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              useSmartIntersection
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              One shared observer for every element on the page. O(1) memory cost, regardless of list size.
            </p>
          </div>
          <ObserverDemo />
        </motion.div>

        {/* ── Card 3: Network Status ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-5 border border-white/[0.05] bg-white/[0.01] p-7 flex flex-col justify-between overflow-hidden relative group hover:border-white/[0.1] transition-colors"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/[0.06] bg-white/[0.02] mb-5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">bom</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              useNetworkStatus
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Reactive network quality tier. Adapt your UI to the user&apos;s real connection in real time.
            </p>
          </div>
          <NetworkDemo />
        </motion.div>

        {/* ── Card 4: OPFS Storage — bottom left ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="md:col-span-5 border border-white/[0.05] bg-white/[0.01] p-7 flex flex-col justify-between overflow-hidden relative group hover:border-white/[0.1] transition-colors"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/[0.06] bg-white/[0.02] mb-5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">pipelines</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              useOPFSFile
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Gigabytes of local persistence, entirely off the main thread via the Origin Private File System.
            </p>
          </div>
          <StorageDemo />
        </motion.div>

        {/* ── Card 5: Action Pipelines — bottom right wide ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="md:col-span-7 border border-white/[0.05] bg-white/[0.01] p-7 flex flex-col justify-between overflow-hidden relative group hover:border-white/[0.1] transition-colors"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/[0.06] bg-white/[0.02] mb-5">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">state</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
              useActionPipeline
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Declarative FormData processing for React 19 server actions. Compose validation,
              transformation, and authorization as a type-safe pipeline.
            </p>
          </div>
          <PipelineDemo />
        </motion.div>

      </div>
    </section>
  );
}