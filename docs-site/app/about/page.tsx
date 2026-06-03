export const metadata = {
  title: "About — use-web-kit",
  description: "The philosophy and architecture behind use-web-kit.",
};

const principles = [
  {
    num: "01",
    title: "Zero Memory Leaks",
    desc: "Every observe() has an unobserve(). Every addEventListener has a removeEventListener. React 19 ref cleanup callbacks ensure automatic teardown.",
  },
  {
    num: "02",
    title: "O(1) Resource Cost",
    desc: "Heavy browser APIs (IntersectionObserver, BroadcastChannel, Web Workers) are instantiated once globally, not per-component. Ref-counting destroys singletons when the last subscriber unmounts.",
  },
  {
    num: "03",
    title: "SSR-Safe Hydration",
    desc: "All BOM access is guarded. External mutable state uses useSyncExternalStore with a stable server snapshot, guaranteeing the first client render always matches the server.",
  },
  {
    num: "04",
    title: "Type-First Design",
    desc: "No 'any' unless structurally documented. Discriminated unions, generic constraints, and exported public types ensure your IDE provides perfect autocomplete.",
  },
];

const metrics = [
  { value: "14", label: "Hooks" },
  { value: "0", label: "Dependencies" },
  { value: "<3KB", label: "Gzipped" },
  { value: "100%", label: "TypeScript" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <main className="relative overflow-hidden">
        {/* Hero */}
        <section className="pt-24 pb-20 px-6 lg:px-10 max-w-5xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/[0.03] blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-accent/40" />
              <span className="section-label">Philosophy</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-[-0.035em] leading-[0.95]">
              Built for the <br />
              <span className="text-gradient-accent">Next Generation.</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl font-normal">
              14 hooks. Zero dependencies. One philosophy:{" "}
              <span className="text-white font-medium">
                never let a hook library become the bottleneck.
              </span>
            </p>
          </div>
        </section>

        {/* Metrics */}
        <section className="px-6 lg:px-10 max-w-5xl mx-auto mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] border border-white/[0.04]">
            {metrics.map((m) => (
              <div key={m.label} className="text-center py-8 bg-background hover:bg-white/[0.01] transition-colors">
                <div className="text-3xl font-bold font-mono text-white mb-1.5 tracking-tight">{m.value}</div>
                <div className="meta-text text-zinc-600">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="px-6 lg:px-10 max-w-5xl mx-auto pb-24">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-accent/40" />
            <span className="section-label">Core Principles</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">Architecture Decisions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((p) => (
              <div key={p.num} className="group border border-white/[0.05] bg-white/[0.01] p-6 lg:p-8 hover:border-white/[0.08] transition-colors">
                <div className="flex items-start gap-5">
                  <span className="text-xl font-bold font-mono text-accent/40 shrink-0">{p.num}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{p.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed font-normal group-hover:text-zinc-400 transition-colors">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="px-6 lg:px-10 max-w-5xl mx-auto pb-24">
          <div className="border border-white/[0.05] bg-white/[0.01] p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-accent/20 via-transparent to-transparent" />
            <div className="section-label mb-5">Key Advantage</div>
            <blockquote className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light italic max-w-3xl">
              &ldquo;By utilizing global singletons for observers, we reduce
              the cost of DOM observation from O(n) components to O(1) per
              application.&rdquo;
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  );
}
