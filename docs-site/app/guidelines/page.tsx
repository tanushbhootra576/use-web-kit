import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Guidelines — use-web-kit",
  description: "Code standards and contribution guidelines for use-web-kit.",
};

const standards = [
  { rule: "React 19 Ref Callback Cleanup", desc: "DOM-observing hooks must return a cleanup function directly from the ref callback. Never use useEffect + useRef for DOM node registration." },
  { rule: "Zero Memory Leaks", desc: "Every observe() must have an unobserve(). Every addEventListener must have a removeEventListener. Every URL.createObjectURL must have a revokeObjectURL." },
  { rule: "No O(n) Resource Instantiation", desc: "Never create a heavy browser API instance per component. Use module-level global singletons with ref-counting." },
  { rule: "SSR-Safe Hydration", desc: "All BOM access must be guarded behind typeof window !== 'undefined'. External mutable state must use useSyncExternalStore." },
  { rule: "Type Safety", desc: "No 'any' unless structurally required and documented. Export public types from src/core/types.ts. Use unknown over any for untyped externals." },
  { rule: "Architecture Compliance", desc: "Place hooks in the correct domain directory. Do not add external NPM dependencies. Use useReducer for related state." },
];

const reviewCriteria = [
  "All existing tests must pass",
  "New hooks require unit tests with ≥90% coverage",
  "SSR snapshot tests for any hook reading BOM APIs",
  "Performance benchmarks for observation-heavy hooks",
  "TypeScript strict mode compliance",
  "Documentation in hooks-data.ts with examples",
];

export default function GuidelinesPage() {
  return (
    <LegalPageLayout
      label="Engineering Standards"
      title="Guidelines"
      description="Code standards, architectural rules, and review criteria that govern all contributions to use-web-kit."
      lastUpdated="May 2026"
    >
      <section className="not-prose mb-16">
        <h2 className="mono-label !text-[9px] text-zinc-500 mb-8">Core Rules</h2>
        <div className="space-y-4">
          {standards.map((s, i) => (
            <div key={i} className="border border-white/[0.05] bg-white/[0.01] p-6 group hover:border-white/[0.08] transition-colors">
              <div className="flex items-start gap-4">
                <span className="text-accent/50 font-mono text-lg font-bold shrink-0 w-8">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-base mb-2 tracking-tight">{s.rule}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-normal">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="not-prose">
        <h2 className="mono-label !text-[9px] text-zinc-500 mb-8">Review Criteria</h2>
        <div className="border border-white/[0.05] bg-white/[0.01] p-6 lg:p-8">
          <div className="space-y-4">
            {reviewCriteria.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-4 h-4 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5 bg-accent/[0.04]">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#5BE30C" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-normal">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
