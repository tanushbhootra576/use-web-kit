export const metadata = {
  title: "useIntentObserver — use-web-kit",
  description: "Predictive hover pre-fetching using global mouse velocity and vector prediction.",
};

export default function Page() {
  return (
    <>
      <div className="mb-12">
        <span
          className="inline-flex items-center text-[10px] font-medium px-3 py-1 rounded-full mb-4"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
          }}
        >
          DOM
        </span>
        <h1
          className="text-4xl font-bold text-white mb-5 tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useIntentObserver
        </h1>
        <p className="text-[#9ca3af] text-[0.95rem] leading-[1.8]">
          Predictive hover pre-fetching using global mouse velocity and vector prediction.
        </p>
      </div>

      <div className="section-divider mb-12" />

      <div className="mb-16">
        <h2
          className="text-xs font-semibold text-[#f0f0f0] mb-6 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Signature
        </h2>
        <div className="glass-card rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-6">
          <pre className="text-[13px] leading-relaxed text-[#a3ff12] overflow-x-auto whitespace-pre">
{`function useIntentObserver(options: UseIntentObserverOptions): { ref }`}
          </pre>
        </div>
      </div>

      <div className="mb-16">
        <h2
          className="text-xs font-semibold text-[#f0f0f0] mb-6 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Basic Usage
        </h2>
        <div className="glass-card rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-6">
          <pre className="text-[13px] leading-relaxed text-[#9ca3af] overflow-x-auto whitespace-pre">
{`import { useIntentObserver } from 'use-web-kit';

const { ref } = useIntentObserver({
  onIntent: () => prefetch("/heavy-route.js")
});
return <a ref={ref} href="/heavy-route">Go</a>;`}
          </pre>
        </div>
      </div>

      <div className="mb-16">
        <h2
          className="text-xs font-semibold text-[#f0f0f0] mb-6 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Returns
        </h2>
        <div className="grid grid-cols-1 gap-4">

            <div className="glass-card p-6 rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#a3ff12] font-mono text-sm">ref</span>
                <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded border border-[rgba(163,255,18,0.2)] bg-[rgba(163,255,18,0.03)] font-mono">(node: Element | null) => void</span>
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">React 19 ref callback.</p>
            </div>
        </div>
      </div>
    </>
  );
}