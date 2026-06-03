export const metadata = {
  title: "useBroadcastState — use-web-kit",
  description: "Sync state across browser tabs using BroadcastChannel API.",
};

const sig = `function useBroadcastState<T>(
  channel: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>]`;

const usage = `import { useBroadcastState } from 'use-web-kit';

// Works just like useState — but syncs across all open tabs
function Counter() {
  const [count, setCount] = useBroadcastState('my-counter', 0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count (shared): {count}
    </button>
  );
}`;

const returns = [
  {
    name: "[0]",
    type: "T",
    desc: "Current state value, shared across all tabs on the same channel.",
  },
  {
    name: "[1]",
    type: "Dispatch<SetStateAction<T>>",
    desc: "State setter. Behaves identically to useState setter and broadcasts immediately.",
  },
];

export default function Page() {
  return (
    <>
      <div className="mb-10">
        <span
          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          State Management
        </span>
        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useBroadcastState
        </h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          Sync state across browser tabs using the BroadcastChannel API.
          Changes in one tab instantly propagate to all others on the same
          channel.
        </p>
      </div>
      <div className="section-divider mb-10" />
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Signature
        </h2>
        <div className="code-block rounded-lg p-4 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sig.split("\n").map((l, i) => (
              <div key={i} className="text-[#9ca3af]">
                {l || "\u00A0"}
              </div>
            ))}
          </pre>
        </div>
      </div>
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Return Values
        </h2>
        <div className="rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden">
          <div
            className="grid grid-cols-3 text-[10px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider px-4 py-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <div>Index</div>
            <div>Type</div>
            <div>Description</div>
          </div>
          {returns.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0 gap-3"
            >
              <div
                className="text-[#a3ff12] text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {r.name}
              </div>
              <div
                className="text-[#a5b4fc] text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {r.type}
              </div>
              <div className="text-[#9ca3af] text-xs">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Usage
        </h2>
        <div className="code-block rounded-lg p-4 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {usage.split("\n").map((l, i) => {
              const c = l.trimStart().startsWith("//");
              return (
                <div
                  key={i}
                  style={{ color: c ? "rgba(163,255,18,0.45)" : undefined }}
                  className={c ? "" : "text-[#9ca3af]"}
                >
                  {l || "\u00A0"}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
      <div className="rounded-lg border border-[rgba(163,255,18,0.15)] bg-[rgba(163,255,18,0.03)] p-4">
        <div className="flex items-start gap-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3ff12"
            strokeWidth="2"
            className="shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <div
              className="text-xs font-medium text-[#a3ff12] mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Browser Support
            </div>
            <div className="text-xs text-[#9ca3af] leading-relaxed">
              BroadcastChannel is supported in all modern browsers. On
              unsupported environments the hook falls back to standard
              isolated useState behaviour.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
