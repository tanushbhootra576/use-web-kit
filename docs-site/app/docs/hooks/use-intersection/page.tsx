export const metadata = { title: "useIntersection — use-web-kit" };

const sig = `function useIntersection(
  options?: IntersectionObserverInit
): [RefObject<Element | null>, IntersectionObserverEntry | null]`;

const usage = `import { useIntersection } from 'use-web-kit';

function LazySection() {
  const [ref, entry] = useIntersection({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  const isVisible = entry?.isIntersecting ?? false;

  return (
    <section
      ref={ref}
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s' }}
    >
      {isVisible && <ExpensiveChart />}
    </section>
  );
}`;

export default function Page() {
  return (
    <div className="w-full">
      <header className="not-prose mb-10">
        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase tracking-wider">
          Performance
        </span>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          useIntersection
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed font-light">
          Observe element visibility with IntersectionObserver. Returns a ref
          to attach and the latest IntersectionObserverEntry.
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
    </div>
  );
}
