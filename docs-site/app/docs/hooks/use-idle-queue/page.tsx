export const metadata = { title: "useIdleQueue — use-web-kit" };

const sig = `function useIdleQueue(options?: {
  timeout?: number;  // max ms before forced execution (default: 2000)
}): {
  enqueue: (task: () => void) => void;
  flush: () => void;
  clear: () => void;
  size: number;
}`;

const usage = `import { useIdleQueue } from 'use-web-kit';

function Feed() {
  const { enqueue } = useIdleQueue({ timeout: 3000 });

  const handleScroll = () => {
    // Immediate: track scroll for layout
    updateScrollPosition();

    // Deferred: non-critical side effects
    enqueue(() => logScrollDepth());
    enqueue(() => prefetchNextPage());
    enqueue(() => syncReadingProgress());
  };

  return <div onScroll={handleScroll}>...</div>;
}`;

export default function Page() {
  return (
    <div className="w-full">
      <header className="not-prose mb-10">
        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase tracking-wider">
          Performance
        </span>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          useIdleQueue
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed font-light">
          Schedule non-critical tasks to run during browser idle time using
          requestIdleCallback. Keeps your main thread responsive.
        </p>
      </header>

      <hr className="border-white/5 my-10" />

      <section>
        <h2 className="text-sm font-bold text-zinc-500 mb-6 uppercase tracking-widest font-mono not-prose">
          Signature
        </h2>
        <div className="terminal-box bg-zinc-950 rounded-xl p-6 border border-white/5 overflow-x-auto not-prose">
          <pre className="font-mono text-sm text-zinc-300 m-0">
            {sig}
          </pre>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-bold text-zinc-500 mb-6 uppercase tracking-widest font-mono not-prose">
          Usage
        </h2>
        <div className="terminal-box bg-zinc-950 rounded-xl p-6 border border-white/5 overflow-x-auto not-prose">
          <pre className="font-mono text-sm m-0">
            {usage.split("\n").map((l, i) => {
              const isComment = l.trimStart().startsWith("//");
              return (
                <div
                  key={i}
                  className={isComment ? "text-zinc-600 italic" : "text-zinc-300"}
                >
                  {l || "\u00A0"}
                </div>
              );
            })}
          </pre>
        </div>
      </section>

      <section className="mt-16 not-prose">
        <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-6">
          <div className="flex items-start gap-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 mt-0.5 text-cyan-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-widest font-mono mb-2">
                Browser Support
              </div>
              <div className="text-sm text-zinc-400 leading-relaxed font-light">
                <code className="text-cyan-400">requestIdleCallback</code> is polyfilled using <code className="text-cyan-400">setTimeout</code> on browsers
                that do not support it natively (e.g., Safari &lt; 16.4).
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
