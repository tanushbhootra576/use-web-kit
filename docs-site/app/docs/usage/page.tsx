export const metadata = {
  title: "Usage Patterns — use-web-kit",
  description: "Best practices and usage patterns for use-web-kit hooks.",
};

export default function UsagePage() {
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
          Usage Patterns
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-3xl">
          Learn how to compose hooks, integrate with Next.js App Router, ensure type safety, and test your components efficiently.
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

      {/* Content */}
      <div className="space-y-32">
        
        {/* Next.js & SSR */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            Next.js App Router & SSR Safety
          </h2>
          <div className="glass-card rounded-2xl p-8 mb-8 border border-[#a3ff12]/10">
            <h3 className="text-lg font-bold text-white mb-4">The "use client" Directive</h3>
            <p className="text-zinc-400 leading-relaxed font-light mb-6">
              All hooks in <code className="text-white">use-web-kit</code> that interact with browser APIs (DOM, BOM, Storage) require the <code className="text-[#a3ff12]">'use client'</code> directive at the top of your component file when using Next.js App Router.
            </p>
          </div>
          
          <div className="glass-card-premium rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">Hydration Guarantees</h3>
            <p className="text-zinc-400 leading-relaxed font-light">
              Hooks like <code className="text-white">useDebouncedStorage</code> and <code className="text-white">useNetworkStatus</code> are built natively with <code className="text-[#a3ff12]">useSyncExternalStore</code>. This guarantees perfect hydration matching between the server HTML and client hydration. You do not need to manually check <code className="text-zinc-500">typeof window !== 'undefined'</code>.
            </p>
          </div>
        </section>

        {/* Composition */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            Hook Composition
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            Hooks are designed to be composable. For example, you can combine <code className="text-white">useSmartIntersection</code> with <code className="text-white">useWorkerPool</code> to only process data off-thread when a component becomes visible.
          </p>
          <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-white/10">
            <pre className="text-[13px] text-zinc-300 font-mono leading-[1.8] overflow-x-auto">
              const {'{'} run {'}'} = useWorkerPool(heavyComputation);<br/>
              <br/>
              const {'{'} ref {'}'} = useSmartIntersection({'{'}<br/>
              &nbsp;&nbsp;onIntersect: (entry) =&gt; {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;if (entry.isIntersecting) {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;run(data).then(setResult);<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
              &nbsp;&nbsp;{'}'}<br/>
              {'}'});
            </pre>
          </div>
        </section>

        {/* TypeScript */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            TypeScript Integration
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            Every hook exports comprehensive TypeScript definitions. Use Generics to enforce strict typing on hooks like <code className="text-white">useStorage</code> and <code className="text-white">useWorkerPool</code>.
          </p>
          <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-blue-500/20">
            <pre className="text-[13px] text-zinc-300 font-mono leading-[1.8] overflow-x-auto">
              <span className="text-zinc-500">// Enforce the shape of your storage</span><br/>
              interface UserPreferences {'{'}<br/>
              &nbsp;&nbsp;theme: 'dark' | 'light';<br/>
              &nbsp;&nbsp;reducedMotion: boolean;<br/>
              {'}'}<br/>
              <br/>
              const [prefs, setPrefs] = useStorage<span className="text-blue-400">&lt;UserPreferences&gt;</span>('prefs', {'{'}<br/>
              &nbsp;&nbsp;theme: 'dark',<br/>
              &nbsp;&nbsp;reducedMotion: false<br/>
              {'}'});
            </pre>
          </div>
        </section>

        {/* Testing */}
        <section>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-8">
            Testing Components
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            When testing components that use browser-specific hooks (like <code className="text-white">IntersectionObserver</code> or <code className="text-white">BroadcastChannel</code>) in JSDOM environments (e.g., Jest or Vitest), you must mock these APIs globally.
          </p>
          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <pre className="text-[13px] text-zinc-400 font-mono leading-[1.8] overflow-x-auto">
              <span className="text-zinc-500">// setupTests.ts</span><br/>
              class MockBroadcastChannel {'{'}<br/>
              &nbsp;&nbsp;name: string;<br/>
              &nbsp;&nbsp;constructor(name: string) {'{'} this.name = name; {'}'}<br/>
              &nbsp;&nbsp;postMessage() {'{}'}<br/>
              &nbsp;&nbsp;close() {'{}'}<br/>
              &nbsp;&nbsp;addEventListener() {'{}'}<br/>
              &nbsp;&nbsp;removeEventListener() {'{}'}<br/>
              {'}'}<br/>
              <br/>
              global.BroadcastChannel = MockBroadcastChannel as any;
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}
