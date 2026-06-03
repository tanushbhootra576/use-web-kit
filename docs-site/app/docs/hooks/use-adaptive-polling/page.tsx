export const metadata = { title: "useAdaptivePolling — use-web-kit" };

const sig = `function useAdaptivePolling(
  callback: () => void | Promise<void>,
  options: {
    interval: number;          // ms — normal polling interval
    visibilityInterval?: number; // ms — interval when tab is hidden (default: interval * 5)
    immediate?: boolean;       // run callback immediately on mount (default: false)
  }
): {
  pause: () => void;
  resume: () => void;
  isPolling: boolean;
}`;

const usage = `import { useAdaptivePolling } from 'use-web-kit';

function LivePrices() {
  const [prices, setPrices] = useState([]);

  const { pause, resume, isPolling } = useAdaptivePolling(
    async () => {
      const data = await fetchPrices();
      setPrices(data);
    },
    {
      interval: 3000,          // 3s when tab is active
      visibilityInterval: 30000, // 30s when tab is hidden
      immediate: true,
    }
  );

  return (
    <div>
      <button onClick={isPolling ? pause : resume}>
        {isPolling ? 'Pause' : 'Resume'}
      </button>
      <PriceList data={prices} />
    </div>
  );
}`;

export default function Page() {
  return (
    <>
      <div className="mb-10">
        <span
          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "#fbbf24",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Performance
        </span>
        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useAdaptivePolling
        </h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          Smart polling that automatically reduces its frequency when the tab
          is hidden, and exposes manual pause/resume controls.
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
    </>
  );
}
