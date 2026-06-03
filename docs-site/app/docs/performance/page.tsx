export const metadata = {
  title: "Performance Architecture — use-web-kit",
  description: "Deep dive into the zero-overhead architecture of use-web-kit.",
};

export default function PerformancePage() {
  return (
    <div className="py-24 px-6 lg:px-12 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-24 relative">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-8 h-[1px] bg-[#a3ff12]/50" />
          <span className="text-[#a3ff12] font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
            Deep Dive
          </span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-[-0.04em] leading-[0.9] relative z-10">
          Performance Architecture
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-3xl relative z-10">
          How <span className="font-mono text-zinc-300">use-web-kit</span> achieves O(1) observer overhead, zero render cascades, and perfectly fluid 60fps animations in React 19.
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />

      {/* Content */}
      <div className="space-y-32">
        
        {/* Section 1 */}
        <section className="relative">
          <div className="hidden lg:block absolute -left-12 top-0 text-5xl font-black font-mono text-white/[0.03] select-none">
            01
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8">
            The Singleton Pattern
          </h2>
          <div className="glass-card-premium rounded-2xl p-8 mb-8">
            <p className="text-zinc-400 leading-relaxed font-light text-lg">
              Instead of creating one <code className="text-white">IntersectionObserver</code> or <code className="text-white">MutationObserver</code> per component (which scales linearly with O(n) memory complexity), we register all elements to a single, module-level global observer.
            </p>
          </div>
          <p className="text-zinc-400 leading-relaxed font-light">
            When a component unmounts, it simply removes its reference from the global Map. If the Map becomes empty, the global observer disconnects itself. This drops the memory footprint to near-zero, regardless of whether you are observing 10 or 10,000 elements.
          </p>
        </section>

        {/* Section 2 */}
        <section className="relative">
          <div className="hidden lg:block absolute -left-12 top-0 text-5xl font-black font-mono text-white/[0.03] select-none">
            02
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8">
            RAF Batching
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            Scroll events and observer callbacks can fire up to 120 times a second on modern displays. If each event triggers a React state update, the main thread will quickly block.
          </p>
          <div className="terminal-box bg-[#0a0a0a] rounded-2xl p-6 border border-blue-500/20">
            <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Event Coalescing
            </div>
            <pre className="text-[13px] text-zinc-300 font-mono leading-[1.8] overflow-x-auto">
              let queued = false;<br/>
              <br/>
              const handleScroll = () =&gt; {'{'}<br/>
              &nbsp;&nbsp;if (!queued) {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;queued = true;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;requestAnimationFrame(() =&gt; {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Flush all pending state updates exactly once per frame<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;flushUpdates();<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queued = false;<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;{'}'});<br/>
              &nbsp;&nbsp;{'}'}<br/>
              {'}'};
            </pre>
          </div>
        </section>

        {/* Section 3 */}
        <section className="relative">
          <div className="hidden lg:block absolute -left-12 top-0 text-5xl font-black font-mono text-white/[0.03] select-none">
            03
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8">
            React 19 Ref Cleanups
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            The new React 19 ref cleanup pattern completely eliminates the need for <code className="text-white">useEffect</code> when observing DOM nodes. 
          </p>
          <div className="glass-card rounded-2xl p-8 border border-[#a3ff12]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#a3ff12]/5 pointer-events-none" />
            <p className="text-zinc-300 leading-relaxed font-mono text-sm relative z-10">
              By returning a cleanup function directly from the ref callback, we avoid double-cleanup race conditions that typically occur in React 18 Strict Mode. This guarantees zero memory leaks when components rapidly mount and unmount.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="relative">
          <div className="hidden lg:block absolute -left-12 top-0 text-5xl font-black font-mono text-white/[0.03] select-none">
            04
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-8">
            The Worker Pool Threading Model
          </h2>
          <p className="text-zinc-400 leading-relaxed font-light mb-8">
            <code className="text-white">useWorkerPool</code> abstracts the complexity of Web Workers. Instead of spawning a new worker for every task (which is incredibly slow), it instantiates a fixed pool of workers based on the hardware concurrency of the user's device.
          </p>
          <ul className="space-y-4 font-mono text-sm">
            <li className="flex items-center gap-3 text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff12]" /> Intelligent Round-robin task distribution
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff12]" /> Dynamic pooling (defaults to <code className="text-[#a3ff12]">navigator.hardwareConcurrency - 1</code>)
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a3ff12]" /> Automatic blob URL revocation to prevent memory leaks
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
