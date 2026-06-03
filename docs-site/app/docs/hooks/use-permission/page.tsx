export const metadata = { title: "usePermission — use-web-kit" };

const sig = `function usePermission(
  name: PermissionName
): {
  state: PermissionState;   // 'granted' | 'denied' | 'prompt'
  request: () => Promise<void>;
}`;

const usage = `import { usePermission } from 'use-web-kit';

function CameraButton() {
  const { state, request } = usePermission('camera');

  if (state === 'granted') return <Camera />;
  if (state === 'denied') return <p>Camera access denied.</p>;

  return (
    <button onClick={request}>
      Allow camera access
    </button>
  );
}`;

export default function Page() {
  return (
    <>
      <div className="mb-10">
        <span
          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mb-3"
          style={{
            background: "rgba(163,255,18,0.08)",
            border: "1px solid rgba(163,255,18,0.25)",
            color: "#a3ff12",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Browser APIs
        </span>
        <h1
          className="text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          usePermission
        </h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          Query and react to browser permission state. Automatically updates
          when the user changes a permission in browser settings.
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
              Supported Permissions
            </div>
            <div className="text-xs text-[#9ca3af] leading-relaxed">
              Accepts any valid PermissionName: camera, microphone,
              geolocation, notifications, clipboard-read, clipboard-write, and
              more.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
