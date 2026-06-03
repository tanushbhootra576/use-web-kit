import { HOOKS_DATA } from "@/lib/hooks-data";
import Link from "next/link";

export const metadata = {
  title: "Examples — use-web-kit",
  description: "Real-world usage examples for use-web-kit hooks.",
};

const examples = [
  {
    title: "Offline-aware Data Fetching",
    hooks: ["useNetworkStatus", "useAdaptivePolling"],
    description:
      "Poll an API endpoint that adapts its interval based on connection quality, and pauses entirely when offline.",
    code: `const { isOnline, effectiveType } = useNetworkStatus();

const { pause, resume } = useAdaptivePolling(fetchData, {
  interval: effectiveType === '4g' ? 5000 : 15000,
  visibilityInterval: 60000, // slow down on hidden tab
});

useEffect(() => {
  if (!isOnline) pause();
  else resume();
}, [isOnline]);`,
  },
  {
    title: "Lazy-load with Visibility Tracking",
    hooks: ["useIntersection"],
    description:
      "Only render heavy content when the section scrolls into view using zero-overhead singletons.",
    code: `const [ref, entry] = useIntersection({ threshold: 0.1 });
const isVisible = entry?.isIntersecting ?? false;

return (
  <section ref={ref}>
    {isVisible ? <HeavyChart /> : <Skeleton />}
  </section>
);`,
  },
  {
    title: "Cross-tab State Sync",
    hooks: ["useBroadcastState"],
    description:
      "A shopping cart counter that stays in sync across all open browser tabs using BroadcastChannel.",
    code: `const [cartCount, setCartCount] = useBroadcastState('cart', 0);

// In any tab, adding an item updates every tab instantly
const addToCart = () => setCartCount(n => n + 1);`,
  },
  {
    title: "Defer Expensive Work",
    hooks: ["useIdleQueue"],
    description:
      "Send analytics events and run computations only when the browser is idle to guarantee 60fps.",
    code: `const { enqueue } = useIdleQueue();

const handleClick = (item) => {
  // Immediate: update UI
  setSelected(item);

  // Deferred: analytics + cache write
  enqueue(() => sendAnalytics('item_selected', item));
  enqueue(() => updateCache(item));
};`,
  },
  {
    title: "Media Player Controls",
    hooks: ["useMediaControls"],
    description:
      "Build a custom video player without dealing with native DOM event listeners.",
    code: `const { 
  ref, 
  state: { isPlaying, currentTime, duration, volume }, 
  controls 
} = useMediaControls();

return (
  <div className="player">
    <video ref={ref} src="/video.mp4" />
    <div className="controls">
      <button onClick={isPlaying ? controls.pause : controls.play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <span>{currentTime} / {duration}</span>
      <input 
        type="range" 
        min="0" max="1" step="0.1"
        value={volume} 
        onChange={e => controls.setVolume(parseFloat(e.target.value))} 
      />
    </div>
  </div>
);`,
  },
];

export default function ExamplesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="not-prose mb-24 relative">
        <div className="absolute top-0 right-12 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-cyan-500/50" />
          <div className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold font-mono">
            Reference
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Examples
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
          Real-world architectural patterns combining <span className="font-mono text-white">use-web-kit</span> hooks to solve common frontend engineering challenges.
        </p>
      </header>

      <hr className="border-white/5 mb-24" />

      {/* Examples List */}
      <div className="space-y-32">
        {examples.map((ex, idx) => (
          <div key={ex.title} className="relative group not-prose">
            {/* Number indicator */}
            <div className="absolute -left-12 top-0 text-5xl font-black font-mono text-white/[0.03] select-none">
              {(idx + 1).toString().padStart(2, '0')}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
              {/* Content Side */}
              <div className="flex-1 lg:max-w-sm pt-2">
                <div className="flex flex-wrap gap-2 mb-6">
                  {ex.hooks.map((h) => (
                    <Link
                      key={h}
                      href={`/docs/api#${h}`}
                      className="text-[10px] px-3 py-1 rounded-full text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 transition-colors font-mono font-bold"
                    >
                      {h}
                    </Link>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-4 group-hover:text-cyan-400 transition-colors m-0">
                  {ex.title}
                </h2>
                <p className="text-zinc-400 text-base leading-relaxed font-light mt-4">
                  {ex.description}
                </p>
              </div>

              {/* Code Side */}
              <div className="w-full lg:flex-1">
                <div className="terminal-box bg-zinc-950 rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
                  {/* Chrome */}
                  <div className="flex items-center px-4 py-3 bg-white/[0.02] border-b border-white/[0.05]">
                    <div className="flex items-center gap-1.5 opacity-50">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    </div>
                  </div>
                  
                  {/* Code */}
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-[13px] leading-[1.8] font-mono m-0 border-none bg-transparent shadow-none p-0">
                      {ex.code.split("\n").map((line, i) => {
                        const isComment = line.trimStart().startsWith("//");
                        
                        return (
                          <div
                            key={i}
                            className={isComment ? "text-zinc-600 italic" : "text-zinc-300"}
                          >
                            {line || "\u00A0"}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
