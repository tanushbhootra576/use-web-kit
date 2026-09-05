"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import PerformanceMatrix from '@/components/PerformanceMatrix';
import BentoGrid from '@/components/BentoGrid';
import FrameGraph from '@/components/FrameGraph';
import InstallTerminal from '@/components/InstallTerminal';
import ArchitectureWall from '@/components/ArchitectureWall';
import GithubStarButton from '@/components/GithubStarButton';

const STATS = [
  { value: "20", label: "Production Hooks", sub: "Across 5 domains" },
  { value: "0",  label: "Dependencies",     sub: "Native APIs only" },
  { value: "<3KB", label: "Bundle Size",    sub: "Tree-shaken ESM" },
  { value: "100%", label: "TypeScript",     sub: "Full inference" },
];

export default function LandingPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden">

      {/* ─── Global Particle Background ─────────────────────────────── */}
      <PerformanceMatrix />

      {/* ─── 1. HERO ─────────────────────────────────────────────────── */}
      <Hero />

      {/* ─── 2. STATS STRIP ──────────────────────────────────────────── */}
      {/* First thing after hero — immediate credibility signal */}
      <section className="relative z-10 border-y border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04]">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-background p-8 lg:p-10 group hover:bg-white/[0.01] transition-colors"
            >
              <div className="text-3xl lg:text-4xl font-bold text-white tracking-tighter mb-1.5 font-mono">
                {stat.value}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] text-zinc-700">{stat.sub}</div>
              <div className="mt-4 h-px w-6 bg-white/10 group-hover:w-full group-hover:bg-accent/30 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 3. THE PROBLEM — Editorial Data Section ──────────────────── */}
      <section className="py-28 px-6 lg:px-10 max-w-[1400px] mx-auto w-full relative z-10">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20"
        >
          <div>
            <span className="section-label mb-5 block">01 — The Problem</span>
            <h2 className="text-5xl md:text-7xl display-heading leading-none">
              React is fast.<br />
              <span className="text-zinc-700 italic font-light">Your code isn&apos;t.</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-base leading-relaxed max-w-xs lg:text-right pb-1">
            Three patterns that silently kill every production React app at scale.
          </p>
        </motion.div>

        {/* Three anti-pattern rows — no cards, pure editorial */}
        <div className="divide-y divide-white/[0.04]">
          {[
            {
              index: "001",
              pattern: "O(N) Instantiation",
              description: "One IntersectionObserver per component. Mount 500 list items — 500 observers, 500 GC roots, one crashed tab.",
              before: { label: "Standard React", value: "N observers" },
              after:  { label: "use-web-kit",    value: "1 observer"  },
            },
            {
              index: "002",
              pattern: "Render-on-Scroll",
              description: "Direct state updates inside scroll handlers. Every pixel of scroll triggers a synchronous re-render cascade.",
              before: { label: "Standard React", value: "22 FPS" },
              after:  { label: "use-web-kit",    value: "60 FPS" },
            },
            {
              index: "003",
              pattern: "Silent Memory Leaks",
              description: "useEffect cleanup forgotten under pressure. Observers, channels, and workers accumulate until the browser tab dies.",
              before: { label: "Standard React", value: "∞ leak"    },
              after:  { label: "use-web-kit",    value: "0 leak"    },
            },
          ].map((row, i) => (
            <motion.div
              key={row.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grid grid-cols-12 gap-8 py-10 group"
            >
              {/* Index */}
              <div className="col-span-1 hidden md:flex items-start pt-1">
                <span className="font-mono text-[10px] text-zinc-700 tracking-widest">{row.index}</span>
              </div>

              {/* Pattern name */}
              <div className="col-span-12 md:col-span-3 flex items-start">
                <h3 className="text-xl font-semibold text-white/90 tracking-tight group-hover:text-white transition-colors">
                  {row.pattern}
                </h3>
              </div>

              {/* Description */}
              <div className="col-span-12 md:col-span-4">
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {row.description}
                </p>
              </div>

              {/* Before / After comparison — stark and typographic */}
              <div className="col-span-12 md:col-span-4 flex items-center gap-6 justify-end">
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-red-500/70 tracking-tight tabular-nums">
                    {row.before.value}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-700 mt-0.5">
                    {row.before.label}
                  </div>
                </div>

                <div className="w-px h-10 bg-white/[0.06]" />

                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-accent tracking-tight tabular-nums">
                    {row.after.value}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-700 mt-0.5">
                    {row.after.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 4. PROOF — WHAT IT CAN DO ───────────────────────────────── */}
      {/* BentoGrid shows breadth. FrameGraph shows depth. Together = conviction. */}
      <section className="relative z-10 border-t border-white/[0.04]">
        <div className="py-8 px-6 lg:px-10 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-2"
          >
            <span className="section-label">02 — Capabilities</span>
          </motion.div>
        </div>
        <BentoGrid />
        <FrameGraph />
      </section>

      {/* ─── 5. INSTALL ──────────────────────────────────────────────── */}
      {/* Now the user is convinced — give them the on-ramp immediately */}
      <section id="quickstart" className="py-32 lg:py-40 px-6 lg:px-10 max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Left: Tight narrative copy */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label mb-6 block">03 — Ship It</span>
            <h2 className="text-4xl md:text-6xl display-heading mb-8">
              One command.<br />
              <span className="text-zinc-700 italic font-light">Everything included.</span>
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-10 max-w-md">
              Full TypeScript inference, tree-shaken ESM, zero peer dependencies.
              Works with Next.js 15, Vite, or any React 19 project.
            </p>
            <div className="flex flex-col gap-3">
              {["Zero Peer Dependencies", "Tree-shakeable ESM", "React Server Components Ready", "React 19 Ref Callback Cleanup"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] group">
                  <div className="w-1 h-1 bg-zinc-800 group-hover:bg-accent transition-colors shrink-0" />
                  <span className="text-[12px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors tracking-wide">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Terminal */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <InstallTerminal />
          </motion.div>

        </div>
      </section>

      {/* ─── 6. ARCHITECTURE AMBIENT DIVIDER ─────────────────────────── */}
      {/* A tasteful signature moment — not a section, just a watermark */}
      <ArchitectureWall />

      {/* ─── 7. FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-40 lg:py-48 px-6 lg:px-10 relative overflow-hidden bg-transparent">
        <div className="absolute inset-0 bg-runtime-grid opacity-[0.03]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/[0.04] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-label mb-10 block tracking-[0.4em]">System.initialize()</span>
            <h2 className="text-5xl md:text-[88px] display-heading mb-14 leading-none">
              Start building <br />
              <span className="text-zinc-800 italic font-light">at the edge.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="px-10 py-4 bg-white text-black font-semibold text-[12px] uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-[0_16px_32px_rgba(255,255,255,0.08)] flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/docs/api"
                className="px-10 py-4 border border-white/10 bg-white/[0.02] text-white font-semibold text-[12px] uppercase tracking-[0.2em] hover:bg-white/[0.06] transition-all"
              >
                View API
              </Link>
              <GithubStarButton className="py-4" />
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
