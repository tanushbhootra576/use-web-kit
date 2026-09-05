"use client";

import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Activity, Zap, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import Hero from '@/components/Hero';
import InstallTerminal from '@/components/InstallTerminal';

export default function LandingPage() {
  return (
    <div className="relative flex flex-col w-full bg-background overflow-hidden">
      <Hero />

      {/* ═══ Section 01 — Architecture Pillars ═══ */}
      <section className="py-32 lg:py-40 px-6 lg:px-10 max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 border border-accent/20 flex items-center justify-center bg-accent/5">
                  <Cpu className="text-accent" size={15} />
                </div>
                <span className="section-label">01 — Architecture</span>
              </div>

              <h2 className="text-4xl md:text-6xl display-heading mb-10">
                Engineered for <br />
                <span className="text-zinc-800 italic font-light">Predictable Runtimes.</span>
              </h2>

              <p className="text-zinc-500 text-lg font-normal leading-relaxed mb-14 max-w-lg">
                Modern web apps are hitting the performance ceiling of React&apos;s render loop.
                We provide the low-level primitives needed to offload orchestration
                to the browser&apos;s native engine.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                {[
                  { title: "O(1) Memory", desc: "Shared module-level singletons.", icon: ShieldCheck },
                  { title: "RAF Sync", desc: "Frame-perfect DOM batching.", icon: Activity },
                  { title: "Worker Pool", desc: "Background thread orchestration.", icon: Zap },
                  { title: "Server Native", desc: "Zero-dependency compiler-safe.", icon: Layers }
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col gap-3 group">
                    <div className="flex items-center gap-2.5 text-white font-semibold text-[11px] uppercase tracking-[0.15em] transition-colors group-hover:text-accent">
                      <feature.icon size={13} className="text-zinc-700 group-hover:text-accent transition-colors" />
                      {feature.title}
                    </div>
                    <p className="text-zinc-600 text-xs leading-relaxed font-mono">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 relative lg:pt-12">
            <div className="absolute -inset-20 bg-accent/[0.03] blur-[120px] rounded-full opacity-30 pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative border border-white/[0.06] bg-black p-1 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 border border-white/10" />
                  <div className="w-1.5 h-1.5 border border-white/10" />
                </div>
                <div className="meta-text !text-[8px] text-zinc-600">NetworkService.ts</div>
              </div>
              <div className="p-4 bg-black/60">
                <CodeBlock
                  filename=""
                  code={`import { useNetworkStatus } from "use-web-kit";

export function ConnectionGuard({ children }) {
  const { isOnline, effectiveType } = useNetworkStatus();

  if (!isOnline || effectiveType === '2g') {
    return <OfflinePlaceholder />;
  }

  return children;
}`}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ Section 02 — Metrics Strip ═══ */}
      <section className="relative z-10 border-y border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04]">
          {[
            { label: "Hooks", value: "20", sub: "Production-ready" },
            { label: "Dependencies", value: "0", sub: "Zero-cost" },
            { label: "Bundle Size", value: "<3KB", sub: "Tree-shaken" },
            { label: "TypeScript", value: "100%", sub: "Full coverage" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-8 lg:p-10 group transition-colors hover:bg-white/[0.01]">
              <div className="text-3xl lg:text-4xl font-bold text-white tracking-tighter mb-2 font-mono">{stat.value}</div>
              <div className="meta-text text-zinc-500 mb-1">{stat.label}</div>
              <div className="text-[11px] text-zinc-700 font-normal">{stat.sub}</div>
              <div className="mt-4 h-px w-6 bg-white/10 group-hover:w-full group-hover:bg-accent/30 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Section 03 — Install + Deploy ═══ */}
      <section id="quickstart" className="py-32 lg:py-40 px-6 lg:px-10 max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label mb-6 block">02 — Setup</span>
              <h2 className="text-4xl md:text-6xl display-heading mb-8">
                Production <br />
                <span className="text-zinc-800 italic font-light">Ready.</span>
              </h2>
              <p className="text-zinc-500 text-lg font-normal leading-relaxed mb-10 max-w-md">
                Integrate the toolkit with any modern build system or runtime.
                Full TypeScript definitions included out of the box.
              </p>
              <div className="space-y-4">
                {[
                  "Zero Peer Dependencies",
                  "Tree-shakeable ESM",
                  "React Server Components Ready"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-white/[0.04] group">
                    <div className="w-1 h-1 bg-zinc-800 group-hover:bg-accent transition-colors" />
                    <span className="text-[12px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors tracking-wide">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <InstallTerminal />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="py-40 lg:py-48 px-6 lg:px-10 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-runtime-grid opacity-[0.04]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/[0.04] blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-label mb-10 block tracking-[0.4em]">System.initialize()</span>
            <h2 className="text-5xl md:text-[96px] display-heading mb-14">
              Start building <br />
              <span className="text-zinc-900">at the edge.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/docs"
                className="px-10 py-4 bg-white text-black font-semibold text-[12px] uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-[0_16px_32px_rgba(255,255,255,0.08)] flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/docs/api"
                className="px-10 py-4 border border-white/10 bg-white/[0.03] text-white font-semibold text-[12px] uppercase tracking-[0.2em] hover:bg-white/[0.07] transition-all"
              >
                View API
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
