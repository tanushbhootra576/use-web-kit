export const metadata = {
  title: "Quick Start — use-web-kit",
  description: "A practical quick start guide for use-web-kit.",
};

const fullExample = `import React, { useRef } from 'react';
import {
  useBroadcastState,
  useNetworkStatus,
  useStorage,
  useIntersection,
  useIdleQueue,
} from 'use-web-kit';

export function Dashboard() {
  // --- Network awareness ---
  const { isOnline, effectiveType } = useNetworkStatus();

  // --- Persisted user preference ---
  const [theme, setTheme] = useStorage('theme', 'dark');

  // --- Shared counter across browser tabs ---
  const [count, setCount] = useBroadcastState('tab-counter', 0);

  // --- Lazy-load a heavy component ---
  const [sectionRef, entry] = useIntersection({ threshold: 0.1 });
  const isVisible = entry?.isIntersecting ?? false;

  // --- Defer analytics to idle time ---
  const { enqueue } = useIdleQueue();
  const trackEvent = (name: string) => {
    enqueue(() => fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event: name }),
    }));
  };

  return (
    <div data-theme={theme}>
      {!isOnline && (
        <div className="banner">You are offline</div>
      )}

      <header>
        <span>Connection: {effectiveType}</span>
        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          Toggle theme
        </button>
      </header>

      <main>
        {/* Tab-synced counter */}
        <button onClick={() => {
          setCount(c => c + 1);
          trackEvent('counter_click');
        }}>
          Global count (all tabs): {count}
        </button>

        {/* Lazy section */}
        <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
          {isVisible ? <HeavyComponent /> : <div>Loading...</div>}
        </div>
      </main>
    </div>
  );
}`;

export default function QuickStartPage() {
  return (
    <>
      <div className="mb-10">
        <div
          className="text-xs text-[#a3ff12] mb-2 tracking-widest uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Getting Started
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Quick Start</h1>
        <p className="text-[#9ca3af] text-sm leading-relaxed">
          A complete example combining multiple hooks in a single component.
          This demonstrates common real-world patterns.
        </p>
      </div>

      <div className="section-divider mb-10" />

      {/* Concepts */}
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          What we&apos;re building
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              hook: "useNetworkStatus",
              purpose: "Show connection quality banner",
            },
            { hook: "useStorage", purpose: "Persist user theme preference" },
            {
              hook: "useBroadcastState",
              purpose: "Share count across browser tabs",
            },
            {
              hook: "useIntersection",
              purpose: "Lazy-load heavy components",
            },
            { hook: "useIdleQueue", purpose: "Defer analytics to idle time" },
          ].map((item) => (
            <div
              key={item.hook}
              className="glass-card rounded-lg p-3 flex items-center gap-3"
            >
              <div
                className="text-[#a3ff12] text-xs font-medium shrink-0"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {item.hook}
              </div>
              <div className="w-px h-4 bg-[rgba(255,255,255,0.1)]" />
              <div className="text-[#9ca3af] text-xs">{item.purpose}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Full example */}
      <div className="mb-10">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Full Example
        </h2>
        <div className="code-block rounded-xl p-5 text-xs overflow-x-auto">
          <pre style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {fullExample.split("\n").map((line, i) => {
              const isComment =
                line.trimStart().startsWith("//") ||
                line.trimStart().startsWith("---");
              const isJSXComment = line.trimStart().startsWith("{/*");
              return (
                <div
                  key={i}
                  style={{
                    color:
                      isComment || isJSXComment
                        ? "rgba(163,255,18,0.45)"
                        : undefined,
                  }}
                  className={
                    isComment || isJSXComment ? "" : "text-[#9ca3af]"
                  }
                >
                  {line || "\u00A0"}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <h2
          className="text-sm font-semibold text-[#f0f0f0] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Tips
        </h2>

        {[
          {
            title: "Tree-shaking",
            body: "Import only the hooks you use. Bundlers will eliminate unused hooks automatically.",
          },
          {
            title: "No providers needed",
            body: "use-web-kit hooks are fully self-contained. No Context providers or wrappers are required.",
          },
          {
            title: "SSR compatible",
            body: "All hooks guard against server-side rendering where browser APIs are unavailable.",
          },
        ].map((tip) => (
          <div
            key={tip.title}
            className="glass-card rounded-lg p-4 flex gap-3"
          >
            <div className="text-[#a3ff12] mt-0.5 shrink-0">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <div>
              <div
                className="text-xs font-semibold text-[#f0f0f0] mb-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {tip.title}
              </div>
              <div className="text-xs text-[#9ca3af]">{tip.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
