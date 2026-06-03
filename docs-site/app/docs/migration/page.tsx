export const metadata = {
  title: "Migration Guide — use-web-kit",
  description: "Migrate from standard React hooks to use-web-kit.",
};

export default function MigrationPage() {
  return (
    <div className="py-24 px-6 lg:px-12 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-[#a3ff12]/50" />
          <span className="text-[#a3ff12] font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
            Guides
          </span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-[-0.04em] leading-[0.9]">
          Migration Guide
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-3xl">
          Transitioning from vanilla React hooks or other libraries. Adopting <span className="font-mono text-zinc-300">use-web-kit</span> is designed to be incremental and non-breaking.
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

      {/* Content */}
      <div className="space-y-32">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            Migrating Intersection Observers
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            Standard React patterns often create a new <code className="text-white">IntersectionObserver</code> instance per component, leading to severe memory overhead on long lists. <code className="text-white">useSmartIntersection</code> resolves this via a global singleton.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-red-500/20">
              <div className="text-[10px] text-red-400 font-mono tracking-widest uppercase font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Before
              </div>
              <pre className="text-[13px] text-zinc-400 font-mono leading-[1.8]">
                const ref = useRef(null);<br/>
                <br/>
                useEffect(() =&gt; {'{'}<br/>
                &nbsp;&nbsp;const observer = new IntersectionObserver(cb);<br/>
                &nbsp;&nbsp;if (ref.current) observer.observe(ref.current);<br/>
                &nbsp;&nbsp;return () =&gt; observer.disconnect();<br/>
                {'}'}, []);
              </pre>
            </div>
            
            <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-[#a3ff12]/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#a3ff12]/5 pointer-events-none" />
              <div className="text-[10px] text-[#a3ff12] font-mono tracking-widest uppercase font-bold mb-4 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-[#a3ff12] shadow-[0_0_10px_#a3ff12]" />
                After
              </div>
              <pre className="text-[13px] text-zinc-300 font-mono leading-[1.8] relative z-10">
                const {'{'} ref {'}'} = useSmartIntersection({'{'}<br/>
                &nbsp;&nbsp;onIntersect: cb<br/>
                {'}'});<br/>
                <br/>
                return &lt;div ref={'{'}ref{'}'} /&gt;;
              </pre>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            Migrating Local Storage
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            Vanilla storage hooks often suffer from hydration mismatches in Next.js and lack cross-tab synchronization. <code className="text-white">useDebouncedStorage</code> fixes both issues out-of-the-box using <code className="text-white">useSyncExternalStore</code>.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-red-500/20">
              <div className="text-[10px] text-red-400 font-mono tracking-widest uppercase font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Before
              </div>
              <pre className="text-[13px] text-zinc-400 font-mono leading-[1.8]">
                // Hydration errors in SSR<br/>
                const [val, setVal] = useState(<br/>
                &nbsp;&nbsp;localStorage.getItem('key') || ''<br/>
                );<br/>
                <br/>
                useEffect(() =&gt; {'{'}<br/>
                &nbsp;&nbsp;localStorage.setItem('key', val);<br/>
                {'}'}, [val]);
              </pre>
            </div>
            
            <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-[#a3ff12]/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[#a3ff12]/5 pointer-events-none" />
              <div className="text-[10px] text-[#a3ff12] font-mono tracking-widest uppercase font-bold mb-4 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-[#a3ff12] shadow-[0_0_10px_#a3ff12]" />
                After
              </div>
              <pre className="text-[13px] text-zinc-300 font-mono leading-[1.8] relative z-10">
                // SSR safe & cross-tab synced<br/>
                const [val, setVal] = useDebouncedStorage(<br/>
                &nbsp;&nbsp;'key', <br/>
                &nbsp;&nbsp;''<br/>
                );
              </pre>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            Global State / Context Alternatives
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            For simple cross-tab or cross-component state, avoid heavy Context providers that trigger deep render cascades. Use <code className="text-white">useBroadcastState</code> for isolated, O(1) state sharing.
          </p>

          <div className="glass-card-premium rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Common Gotchas</h3>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex items-start gap-3 text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff12] shrink-0 mt-1.5" /> 
                <span className="leading-relaxed">Do not use <code className="text-[#a3ff12]">useBroadcastState</code> for rapidly changing values (like mouse coordinates) without debouncing, to avoid overloading the BroadcastChannel.</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff12] shrink-0 mt-1.5" /> 
                <span className="leading-relaxed">All hooks must be used in Client Components (<code className="text-[#a3ff12]">'use client'</code>) in Next.js 15.</span>
              </li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
