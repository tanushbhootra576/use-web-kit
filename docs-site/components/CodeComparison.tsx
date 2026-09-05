"use client";
import CodeBlock from "./CodeBlock";
import { XCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const BAD_CODE = `// The standard React way (O(N) Render Cascades & Memory Leaks)
import { useState, useEffect, useRef } from "react";

export function HeavyList() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // BAD: Creates a new observer per component instance!
    const observer = new IntersectionObserver(([entry]) => {
      // BAD: Triggers React state updates on every scroll tick!
      setIsIntersecting(entry.isIntersecting);
    });
    
    observer.observe(ref.current);
    
    return () => {
      // Hope you do not forget this, or you leak memory!
      observer.disconnect();
    };
  }, []);

  return <div ref={ref} className={isIntersecting ? "visible" : "hidden"} />;
}`;

const GOOD_CODE = `// The use-web-kit way (O(1) Event Delegation & RAF Batching)
import { useSmartIntersection } from "use-web-kit";

export function FastList() {
  // Uses a single global observer. Bypasses React state.
  // Hands you a perfect React 19 Ref Callback with auto-cleanup.
  const { ref, isIntersecting } = useSmartIntersection({ lowPriority: true });

  return <div ref={ref} className={isIntersecting ? "visible" : "hidden"} />;
}`;

export default function CodeComparison() {
  return (
    <div className="w-full relative z-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Bad Code */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-red-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 p-4">
            <XCircle className="text-red-500/50" size={32} />
          </div>
          <div className="px-6 py-4 border-b border-white/[0.04] bg-red-500/[0.02]">
            <h3 className="text-red-400 font-mono text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Standard React
            </h3>
          </div>
          <div className="p-6 opacity-80">
            <CodeBlock code={BAD_CODE} filename="HeavyList.tsx" />
          </div>
        </motion.div>

        {/* Good Code */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-accent/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl relative premium-border"
        >
          <div className="absolute top-0 right-0 p-4">
            <CheckCircle2 className="text-accent" size={32} />
          </div>
          <div className="px-6 py-4 border-b border-white/[0.04] bg-accent/[0.02]">
            <h3 className="text-accent font-mono text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              use-web-kit
            </h3>
          </div>
          <div className="p-6">
            <CodeBlock code={GOOD_CODE} filename="FastList.tsx" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}