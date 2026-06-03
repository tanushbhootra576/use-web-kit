export const metadata = { title: "usePageLifecycle — use-web-kit" };

const sig = `type PageState = 'active' | 'passive' | 'hidden' | 'frozen' | 'terminated';

function usePageLifecycle(): {
  state: PageState;
  history: PageState[];
}`;

const usage = `import { usePageLifecycle } from 'use-web-kit';

function App() {
  const { state, history } = usePageLifecycle();

  useEffect(() => {
    if (state === 'hidden') {
      // User switched tabs or minimised — save draft
      saveDraft();
    }

    if (state === 'frozen') {
      // Page is about to be discarded — flush critical state
      flushToStorage();
    }
  }, [state]);

  return <div data-lifecycle-state={state}>...</div>;
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
          usePageLifecycle
        </h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          Respond to Page Lifecycle API events. Know when the page is active,
          hidden, frozen, or terminated so you can save state at the right
          moment.
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
          Lifecycle States
        </h2>
        <div className="rounded-lg border border-[rgba(255,255,255,0.06)] overflow-hidden">
          {[
            { state: "active", desc: "Page is visible and has input focus." },
            {
              state: "passive",
              desc: "Page is visible but does not have focus.",
            },
            {
              state: "hidden",
              desc: "Page is not visible (tab hidden, minimised, or locked screen).",
            },
            {
              state: "frozen",
              desc: "Page has been frozen by the browser to conserve resources.",
            },
            {
              state: "terminated",
              desc: "Page is being unloaded and destroyed.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0"
            >
              <div
                className="text-[#a3ff12] text-xs shrink-0 w-24"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {item.state}
              </div>
              <div className="text-[#9ca3af] text-xs">{item.desc}</div>
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
    </>
  );
}
