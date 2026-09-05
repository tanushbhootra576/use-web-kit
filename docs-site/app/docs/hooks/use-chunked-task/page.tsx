export const metadata = {
  title: "useChunkedTask — use-web-kit",
  description: "Processes large datasets without blocking the main thread using scheduler.yield.",
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
          Concurrency
        </span>
        <h1
          className="text-4xl font-bold text-white mb-5 tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useChunkedTask
        </h1>
        <p className="text-[#9ca3af] text-[0.95rem] leading-[1.8]">
          Processes large datasets without blocking the main thread using scheduler.yield.
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
{`function useChunkedTask<TIn, TOut>(options?: UseChunkedTaskOptions): { run, cancel, state }`}
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
{`import { useChunkedTask } from 'use-web-kit';

const { run, state } = useChunkedTask();
run(hugeArray, item => expensiveCompute(item));`}
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
                <span className="text-[#a3ff12] font-mono text-sm">run</span>
                <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded border border-[rgba(163,255,18,0.2)] bg-[rgba(163,255,18,0.03)] font-mono">(items: TIn[], processor: Function) => Promise<TOut[]></span>
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">Executes the array processor.</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#a3ff12] font-mono text-sm">state</span>
                <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded border border-[rgba(163,255,18,0.2)] bg-[rgba(163,255,18,0.03)] font-mono">ChunkedTaskState</span>
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">isRunning, progress, result, and error state.</p>
            </div>
        </div>
      </div>
    </>
  );
}