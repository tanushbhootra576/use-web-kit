import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Architecture — use-web-kit",
  description: "System design and architectural patterns behind use-web-kit.",
};

const patterns = [
  {
    title: "Global Singleton Observers",
    desc: "Instead of creating one IntersectionObserver per component (O(n) cost), we maintain a single global observer and multiplex all observations through it. A Map<Element, Callback> routes entries to the correct subscribers. Ref-counting destroys the observer when the last component unmounts.",
    code: `// Simplified internal architecture
const observers = new Map<string, IntersectionObserver>();
const callbacks = new Map<Element, Set<Callback>>();
let refCount = 0;

function subscribe(el: Element, cb: Callback, key: string) {
  refCount++;
  if (!observers.has(key)) {
    observers.set(key, new IntersectionObserver(handleEntries));
  }
  observers.get(key)!.observe(el);
  // ...
  return () => { refCount--; if (refCount === 0) cleanup(); };
}`,
  },
  {
    title: "React 19 Ref Callback Cleanup",
    desc: "React 19 allows ref callbacks to return cleanup functions, eliminating the need for useEffect-based observer patterns. This gives us deterministic teardown tied to the DOM node lifecycle rather than the component render lifecycle.",
    code: `// How hooks attach to DOM
const ref = useCallback((node: Element | null) => {
  if (!node) return;
  const unsubscribe = globalObserver.observe(node);
  return unsubscribe; // React 19 calls this on unmount
}, []);`,
  },
  {
    title: "useSyncExternalStore for SSR",
    desc: "All hooks that read browser-only APIs use useSyncExternalStore with a stable getServerSnapshot. This guarantees the first client render always matches the server render, preventing hydration mismatches.",
    code: `// SSR-safe pattern
const value = useSyncExternalStore(
  subscribe,       // subscribe to external store
  getSnapshot,     // client: read live value
  getServerSnapshot // server: return stable default
);`,
  },
  {
    title: "RAF Batching",
    desc: "When multiple elements trigger IntersectionObserver callbacks in the same frame, we batch all state updates into a single requestAnimationFrame. This prevents render cascade storms where n observations trigger n separate re-renders.",
    code: `// Batch updates per frame
let pending = new Map<Element, IntersectionObserverEntry>();
let rafId: number | null = null;

function handleEntries(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) pending.set(entry.target, entry);
  if (!rafId) {
    rafId = requestAnimationFrame(flushUpdates);
  }
}`,
  },
];

export default function ArchitecturePage() {
  return (
    <LegalPageLayout
      label="System Design"
      title="Architecture"
      description="The internal design patterns, memory model, and performance architecture that power use-web-kit."
      lastUpdated="May 2026"
    >
      <div className="not-prose space-y-14">
        {patterns.map((pattern, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent/50 font-mono text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="text-xl font-semibold text-white tracking-tight">{pattern.title}</h2>
            </div>
            <p className="text-zinc-400 text-sm leading-[1.75] mb-5 max-w-3xl">
              {pattern.desc}
            </p>
            <div className="bg-[#08080b] border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
                <span className="meta-text !text-[9px] text-zinc-600">implementation</span>
              </div>
              <pre className="p-5 overflow-x-auto text-[13px] font-mono text-zinc-400 leading-relaxed">
                <code>{pattern.code}</code>
              </pre>
            </div>
            {i < patterns.length - 1 && <div className="mt-14 h-px bg-white/[0.04]" />}
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2>Memory Model</h2>
        <p>
          Every hook in use-web-kit follows a strict memory contract: all subscriptions, event listeners,
          Blob URLs, and timers are cleaned up when the consuming component unmounts. Global singletons
          use ref-counting and are destroyed when the last subscriber disconnects, ensuring zero memory
          leaks even in long-running single-page applications.
        </p>
      </div>
    </LegalPageLayout>
  );
}
