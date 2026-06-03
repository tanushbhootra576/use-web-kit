import InstallTerminal from "@/components/InstallTerminal";
import Link from "next/link";

export const metadata = {
  title: "Documentation — use-web-kit",
  description:
    "Getting started with use-web-kit: installation and quick start guide.",
};

const steps = [
  {
    step: "01",
    title: "Install",
    description: "Add use-web-kit to your project with a single command.",
  },
  {
    step: "02",
    title: "Import",
    description:
      "Import only the hooks you need. Every hook is individually tree-shakeable.",
  },
  {
    step: "03",
    title: "Use",
    description:
      "Drop hooks directly into your components. No providers, no wrappers.",
  },
];

export default function DocsPage() {
  return (
    <div className="w-full">
      {/* Page header */}
      <header className="not-prose mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-cyan-500/50" />
          <span className="text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
            Getting Started
          </span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-[-0.04em] leading-[0.9]">
          Installation
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
          <code className="text-zinc-300 font-mono">use-web-kit</code> is a zero-dependency React hook library. It is designed from the ground up for
          React 19 and ships with full TypeScript definitions.
        </p>
      </header>

      <hr className="border-white/5 mb-20" />

      {/* Philosophy */}
      <section className="mb-24">
        <h2 className="text-[11px] font-mono font-bold text-zinc-500 mb-8 uppercase tracking-[0.2em] not-prose">
          Philosophy
        </h2>
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/5 bg-zinc-900/50">
          <h3 className="text-2xl font-bold text-white mb-4 tracking-tight mt-0">Zero Dependencies</h3>
          <p>
            We believe that core browser APIs shouldn't require installing lodash, custom event emitters, or polyfills. 
            Every hook in this toolkit relies strictly on native browser APIs and React core primitives.
          </p>
          <ul className="not-prose space-y-4 font-mono text-sm mt-6">
            <li className="flex items-center gap-3 text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> No lodash/debounce overhead
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> No external state managers required
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Perfect 0kb runtime footprint when tree-shaken
            </li>
          </ul>
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-24">
        <h2 className="text-[11px] font-mono font-bold text-zinc-500 mb-8 uppercase tracking-[0.2em] not-prose">
          Requirements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 not-prose">
          {[
            { label: "React", value: "≥ 19.0.0" },
            { label: "TypeScript", value: "≥ 5.0" },
            { label: "Environments", value: "Modern Browsers" },
          ].map((req) => (
            <div
              key={req.label}
              className="glass-card rounded-2xl p-8 text-center border border-white/5 bg-zinc-900/50"
            >
              <div className="text-cyan-400 font-bold text-xl mb-3 font-mono">
                {req.value}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
                {req.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/5 mb-24" />

      {/* Steps */}
      <section className="mb-32">
        <h2 className="text-[11px] font-mono font-bold text-zinc-500 mb-12 uppercase tracking-[0.2em] not-prose">
          Setup Guide
        </h2>

        <div className="space-y-20 not-prose">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 group">
            <div className="shrink-0 text-cyan-400 text-2xl md:text-3xl font-black w-16 pt-1 font-mono opacity-50 group-hover:opacity-100 transition-opacity">
              {steps[0].step}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-2xl mb-4 tracking-tight">
                {steps[0].title}
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 font-light">
                {steps[0].description}
              </p>
              <InstallTerminal />
              <p className="text-[10px] text-zinc-600 mt-6 tracking-widest font-mono uppercase font-bold">
                Also available via <span className="text-zinc-400">yarn</span> or <span className="text-zinc-400">pnpm</span>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 group">
            <div className="shrink-0 text-cyan-400 text-2xl md:text-3xl font-black w-16 pt-1 font-mono opacity-50 group-hover:opacity-100 transition-opacity">
              {steps[1].step}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-2xl mb-4 tracking-tight">
                {steps[1].title}
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 font-light">
                {steps[1].description}
              </p>
              <div className="terminal-box bg-zinc-950 p-8 rounded-2xl overflow-hidden relative border border-white/5 shadow-2xl">
                <pre className="text-[13px] leading-[2] overflow-x-auto font-mono">
                  <span className="text-cyan-400 font-bold">import</span> <span className="text-zinc-500">{"{ "}</span>
                  <span className="text-white">useNetworkStatus</span><span className="text-zinc-500">,</span>
                  <span className="text-white"> useStorage </span>
                  <span className="text-zinc-500">{"}"}</span> <span className="text-cyan-400 font-bold">from</span>{" "}
                  <span className="text-cyan-400/80">'use-web-kit'</span><span className="text-zinc-500">;</span>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 group">
            <div className="shrink-0 text-cyan-400 text-2xl md:text-3xl font-black w-16 pt-1 font-mono opacity-50 group-hover:opacity-100 transition-opacity">
              {steps[2].step}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-2xl mb-4 tracking-tight">
                {steps[2].title}
              </h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 font-light">
                {steps[2].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-white/5 mb-24" />

      {/* Next steps */}
      <section className="not-prose">
        <h2 className="text-[11px] font-mono font-bold text-zinc-500 mb-8 uppercase tracking-[0.2em]">
          Next Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "API Reference",
              desc: "Complete type signatures and options for every hook.",
              href: "/docs/api",
            },
            {
              title: "Usage Patterns",
              desc: "Learn composition and SSR safety best practices.",
              href: "/docs/usage",
            },
            {
              title: "useSmartIntersection",
              desc: "Zero-overhead global Intersection Observer.",
              href: "/docs/api#useSmartIntersection",
            },
            {
              title: "useWorkerPool",
              desc: "Offload heavy tasks to Web Workers.",
              href: "/docs/api#useWorkerPool",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="glass-card rounded-2xl p-8 group relative overflow-hidden transition-all duration-500 border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-white/10"
            >
              <div className="relative z-10 text-white text-lg font-bold group-hover:text-cyan-400 transition-colors mb-3 tracking-tight">
                {item.title}
              </div>
              <div className="relative z-10 text-zinc-500 text-sm leading-relaxed font-light group-hover:text-zinc-400 transition-colors">
                {item.desc}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
