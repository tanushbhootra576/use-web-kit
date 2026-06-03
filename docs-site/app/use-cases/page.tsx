import Link from "next/link";

export const metadata = {
  title: "Use Cases — use-web-kit",
  description: "Real-world scenarios and code examples for use-web-kit.",
};

const cases = [
  {
    title: "Lazy Loading Images",
    hook: "useSmartIntersection",
    domain: "DOM",
    desc: "Load images only when they enter the viewport using the global observer. O(1) cost regardless of how many images are on the page.",
    code: `const { ref, isIntersecting } = useSmartIntersection({ lowPriority: true });\nreturn <img ref={ref} src={isIntersecting ? src : undefined} />;`,
  },
  {
    title: "Off-thread Data Sorting",
    hook: "useWorkerPool",
    domain: "Concurrency",
    desc: "Sort large datasets in a background thread to keep the UI responsive at 60fps.",
    code: `const { run, isRunning } = useWorkerPool(sortFn);\nconst [promise] = run(largeArray);`,
  },
  {
    title: "Cross-tab Shopping Cart",
    hook: "useBroadcastState",
    domain: "State",
    desc: "Synchronize a user's shopping cart across multiple open tabs instantly via BroadcastChannel.",
    code: `const [cart, setCart] = useBroadcastState('cart', []);\nsetCart(prev => [...prev, newItem]);`,
  },
  {
    title: "Offline Banner",
    hook: "useNetworkStatus",
    domain: "BOM",
    desc: "Display a warning banner when the user loses internet connection, with SSR-safe hydration.",
    code: `const { online } = useNetworkStatus();\nif (!online) return <Banner>Offline</Banner>;`,
  },
  {
    title: "Draft Autosave",
    hook: "useDebouncedStorage",
    domain: "State",
    desc: "Save form drafts to localStorage with debounced disk writes and instant UI updates.",
    code: `const { value, setValue, flush } = useDebouncedStorage('draft', '');\nreturn <textarea value={value} onChange={e => setValue(e.target.value)} onBlur={flush} />;`,
  },
  {
    title: "Form Server Actions",
    hook: "useActionPipeline",
    domain: "Pipelines",
    desc: "Process and validate FormData before sending it to a Server Action in React 19.",
    code: `const { formAction, isPending } = useActionPipeline([\n  fd => Object.fromEntries(fd),\n  validate\n], { action: submit });`,
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <main className="max-w-5xl mx-auto px-6 lg:px-10 pt-24 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-accent/[0.03] blur-[80px] pointer-events-none" />

        <div className="relative z-10 mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-accent/40" />
            <span className="section-label">Practical Examples</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-[-0.035em] leading-[0.95]">
            Real-world <br />
            <span className="text-gradient-accent">Use Cases.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl font-normal">
            Production patterns that show how each hook solves concrete problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => (
            <Link
              key={c.title}
              href={`/docs/api#${c.hook}`}
              className="group border border-white/[0.05] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] text-zinc-500 group-hover:text-accent group-hover:border-accent/20 group-hover:bg-accent/[0.05] transition-colors">
                  {c.hook}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-700 group-hover:text-accent transition-colors">
                  <line x1="5" y1="19" x2="19" y2="5" /><polyline points="10 5 19 5 19 14" />
                </svg>
              </div>

              <h3 className="text-base font-semibold text-white mb-1.5 tracking-tight group-hover:text-accent transition-colors">{c.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-normal mb-5 flex-grow">{c.desc}</p>

              <div className="bg-[#08080b] border border-white/[0.06] overflow-hidden">
                <pre className="p-4 text-[11px] font-mono text-zinc-500 leading-relaxed overflow-x-auto group-hover:text-zinc-400 transition-colors">
                  <code>{c.code}</code>
                </pre>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
