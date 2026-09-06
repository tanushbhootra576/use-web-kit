import Link from "next/link";
import { HOOKS_DATA } from "@/lib/hooks-data";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "API Reference — use-web-kit",
  description:
    "Browse all use-web-kit hooks by domain. Full TypeScript signatures, options, return values, and live examples.",
};

const domains = ["DOM", "Concurrency", "State", "Pipelines", "BOM"] as const;

const domainDescriptions: Record<string, string> = {
  DOM: "Intersection, resize, media, and intent observers. All backed by O(1) global singletons.",
  Concurrency: "Web Workers, idle scheduling, chunked tasks, and shared worker pools.",
  State: "Persistent storage, broadcast sync, and debounced state management.",
  Pipelines: "Event and action pipeline primitives for reactive data flows.",
  BOM: "Network status, page lifecycle, permissions, and adaptive performance.",
};

export default function ApiReferencePage() {
  const totalHooks = HOOKS_DATA.length;

  return (
    <div className="max-w-3xl">
      {/* ── Header ── */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] font-mono font-semibold text-accent/80 bg-accent/10 border border-accent/20 px-2.5 py-1 uppercase tracking-widest">
            Reference
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
          API Reference
        </h1>
        <p className="text-zinc-400 text-xl leading-relaxed">
          {totalHooks} production-ready hooks, organized into 5 domains. Click any hook
          to see its full documentation, type signatures, and live sandbox.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-12">
        {[
          { value: `${totalHooks}+`, label: "Hooks" },
          { value: "5", label: "Domains" },
          { value: "React 19", label: "Native" },
        ].map((s) => (
          <div
            key={s.label}
            className="border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-center"
          >
            <div className="text-2xl font-bold font-mono text-white mb-1">{s.value}</div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Jump ── */}
      <div className="flex flex-wrap gap-2 mb-12">
        {domains.map((domain) => {
          const count = HOOKS_DATA.filter((h) => h.domain === domain).length;
          return (
            <a
              key={domain}
              href={`#domain-${domain.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 px-3 py-1.5 transition-colors rounded-full"
            >
              {domain}
              <span className="text-zinc-700">{count}</span>
            </a>
          );
        })}
      </div>

      <div className="h-px bg-white/[0.06] mb-12" />

      {/* ── Domain Sections ── */}
      <div className="flex flex-col gap-16">
        {domains.map((domain) => {
          const hooks = HOOKS_DATA.filter((h) => h.domain === domain);
          if (!hooks.length) return null;

          return (
            <div key={domain} id={`domain-${domain.toLowerCase()}`} className="scroll-mt-20">
              {/* Domain Header */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {domain} Engine
                  </h2>
                  <span className="text-xs font-mono text-zinc-600">
                    {hooks.length} hook{hooks.length > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-zinc-500 text-base">{domainDescriptions[domain]}</p>
              </div>

              {/* Hook Cards Grid */}
              <div className="flex flex-col gap-2">
                {hooks.map((hook) => (
                  <Link
                    key={hook.id}
                    href={`/docs/hooks/${hook.id}`}
                    className="group flex items-start justify-between p-5 border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12] transition-all rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[13px] font-mono font-semibold text-white group-hover:text-accent transition-colors">
                          {hook.name}
                        </span>
                        {hook.isNew && (
                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 uppercase tracking-widest">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-base leading-relaxed pr-6">
                        {hook.description}
                      </p>
                      {/* Quick signature preview */}
                      <div className="mt-3">
                        <code className="text-[11px] font-mono text-zinc-700 bg-white/[0.03] border border-white/[0.04] px-2 py-1 rounded-sm">
                          {hook.returns.slice(0, 3).map(r => r.name).join(", ")}
                        </code>
                      </div>
                    </div>
                    <ArrowRight
                      size={15}
                      className="text-zinc-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                    />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer CTA ── */}
      <div className="mt-16 pt-10 border-t border-white/[0.06]">
        <p className="text-zinc-500 text-base mb-4">
          Looking for a complete working example with multiple hooks?
        </p>
        <Link
          href="/docs/quick-start"
          className="inline-flex items-center gap-2 text-base font-medium text-accent hover:text-accent/80 transition-colors"
        >
          View Quick Start guide
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
