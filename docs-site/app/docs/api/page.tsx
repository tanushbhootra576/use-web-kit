import { HOOKS_DATA } from "@/lib/hooks-data";
import ApiHookSection from "@/components/ApiHookSection";

export const metadata = {
  title: "API Reference — use-web-kit",
  description: "Complete API reference for all use-web-kit hooks.",
};

export default function ApiReferencePage() {
  const domains = ["DOM", "Concurrency", "State", "Pipelines", "BOM"] as const;

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="not-prose mb-20 relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-[1px] bg-accent/40" />
          <span className="section-label">Core Architecture</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-[-0.04em] leading-[0.92]">
          API Reference
        </h1>

        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-normal max-w-2xl">
          Complete TypeScript signatures, options, returns, and practical examples for all 14
          production-ready hooks. Built on a zero-cost abstraction model.
        </p>
      </header>

      <div className="h-px bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent mb-16" />

      {/* Domain Sections */}
      <div className="flex flex-col gap-20">
        {domains.map(domain => {
          const hooks = HOOKS_DATA.filter(h => h.domain === domain);
          if (hooks.length === 0) return null;

          return (
            <div key={domain}>
              {/* Domain Header */}
              <div className="flex items-center gap-4 mb-12 pb-4 border-b border-white/[0.04] sticky top-16 z-20 bg-[#060609]/95 backdrop-blur-md -mx-2 px-2 not-prose">
                <div className="w-2 h-2 rounded-full bg-accent/60 shadow-[0_0_8px_rgba(91,227,12,0.3)]" />
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-[-0.02em] m-0">
                    {domain} <span className="text-zinc-600 font-light italic">Engine</span>
                  </h2>
                  <div className="meta-text !text-[9px] text-zinc-600 mt-1">
                    {hooks.length} Hook{hooks.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Hooks */}
              <div>
                {hooks.map(hook => (
                  <ApiHookSection key={hook.id} hook={hook} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
