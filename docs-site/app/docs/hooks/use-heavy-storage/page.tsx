export const metadata = {
  title: "useHeavyStorage — use-web-kit",
  description: "Asynchronously stores GBs of Blobs using Origin Private File System (OPFS).",
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
          State
        </span>
        <h1
          className="text-4xl font-bold text-white mb-5 tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useHeavyStorage
        </h1>
        <p className="text-[#9ca3af] text-[0.95rem] leading-[1.8]">
          Asynchronously stores GBs of Blobs using Origin Private File System (OPFS).
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
{`function useHeavyStorage(): UseHeavyStorageReturn`}
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
{`import { useHeavyStorage } from 'use-web-kit';

const { save, load } = useHeavyStorage();
await save("intro.mp4", blob);`}
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
                <span className="text-[#a3ff12] font-mono text-sm">save</span>
                <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded border border-[rgba(163,255,18,0.2)] bg-[rgba(163,255,18,0.03)] font-mono">Function</span>
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">Saves data to a virtual file.</p>
            </div>
            <div className="glass-card p-6 rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#a3ff12] font-mono text-sm">load</span>
                <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded border border-[rgba(163,255,18,0.2)] bg-[rgba(163,255,18,0.03)] font-mono">Function</span>
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">Retrieves the virtual file.</p>
            </div>
        </div>
      </div>
    </>
  );
}