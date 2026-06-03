import NetworkPlayground from "@/components/NetworkPlayground";

export const metadata = {
  title: "useNetworkStatus — use-web-kit",
  description:
    "Track online/offline state and connection quality with useNetworkStatus.",
};

const signatureCode = `function useNetworkStatus(): {
  isOnline: boolean;
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number;        // Mbps
  rtt: number;             // ms
  saveData: boolean;
}`;

const usageCode = `import { useNetworkStatus } from 'use-web-kit';

function ConnectionBanner() {
  const { isOnline, effectiveType, downlink } = useNetworkStatus();

  if (!isOnline) {
    return <div className="banner error">You are offline</div>;
  }

  if (effectiveType === '2g' || effectiveType === 'slow-2g') {
    return <div className="banner warn">Slow connection detected</div>;
  }

  return null;
}`;

const params = [
  { name: "—", type: "—", description: "No parameters required." },
];

const returns = [
  {
    name: "isOnline",
    type: "boolean",
    description: "Whether the browser is currently online.",
  },
  {
    name: "effectiveType",
    type: "string",
    description:
      "Connection quality: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'.",
  },
  {
    name: "downlink",
    type: "number",
    description: "Estimated downlink speed in Mbps.",
  },
  {
    name: "rtt",
    type: "number",
    description: "Estimated round-trip latency in milliseconds.",
  },
  {
    name: "saveData",
    type: "boolean",
    description: "Whether the user has requested reduced data usage.",
  },
];

export default function UseNetworkStatusPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <span
          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(56,189,248,0.1)",
            border: "1px solid rgba(56,189,248,0.3)",
            color: "#38bdf8",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Network
        </span>
        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useNetworkStatus
        </h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          Track online/offline state and connection quality in real time using
          the Navigator Connection API. Automatically re-renders when network
          conditions change.
        </p>
      </div>

      <div className="section-divider mb-10" />

      {/* Signature */}
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Signature
        </h2>
        <div className="code-block rounded-lg p-4 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {signatureCode.split("\n").map((line, i) => (
              <div key={i} className="text-[#9ca3af]">
                {line || "\u00A0"}
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Returns */}
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
            <div>Name</div>
            <div>Type</div>
            <div>Description</div>
          </div>
          {returns.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0 gap-3"
            >
              <div
                className="text-[#a3ff12] text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {row.name}
              </div>
              <div
                className="text-[#38bdf8] text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {row.type}
              </div>
              <div className="text-[#9ca3af] text-xs">{row.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Usage
        </h2>
        <div className="code-block rounded-lg p-4 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {usageCode.split("\n").map((line, i) => {
              const isComment = line.trimStart().startsWith("//");
              return (
                <div
                  key={i}
                  style={{
                    color: isComment ? "rgba(163,255,18,0.45)" : undefined,
                  }}
                  className={isComment ? "" : "text-[#9ca3af]"}
                >
                  {line || "\u00A0"}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Live Demo */}
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Live Demo
        </h2>
        <p className="text-[#9ca3af] text-xs mb-4">
          This playground reflects your actual browser network state. Toggle
          offline mode in DevTools (Network tab) to see values update live.
        </p>
        <NetworkPlayground />
      </div>

      {/* Notes */}
      <div className="mb-10 rounded-lg border border-[rgba(163,255,18,0.15)] bg-[rgba(163,255,18,0.03)] p-4">
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
              The Network Information API (effectiveType, downlink, rtt,
              saveData) is not available in all browsers. On unsupported
              browsers, these fields fall back to safe defaults: empty string
              / 0 / false.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
