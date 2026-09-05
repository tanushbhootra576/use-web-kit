
import LivePlayground from "@/components/LivePlayground";

export const metadata = {
  title: "Live Sandbox — use-web-kit",
  description: "Test the hooks directly in the browser.",
};

const CODE = `import React from "react";
import { useSmartIntersection, useElementDimensions } from "use-web-kit";

export default function App() {
  const { ref: dimRef, dimensions } = useElementDimensions();
  const { ref: intRef, isIntersecting } = useSmartIntersection();
  
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "white", background: "#050507", minHeight: "100vh" }}>
      <h1 style={{ color: "#5BE30C", letterSpacing: "-1px" }}>Zero-Cost Hooks</h1>
      <p style={{ color: "#9ca3af" }}>Edit this code and see the abstractions run in real-time!</p>
      
      <div 
        ref={dimRef} 
        style={{ 
          marginTop: "2rem", 
          padding: "1.5rem", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: "8px",
          background: "rgba(255,255,255,0.02)"
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0" }}>Element Dimensions (ResizeObserver)</h3>
        <pre style={{ margin: 0, color: "#a3ff12" }}>{JSON.stringify(dimensions, null, 2)}</pre>
      </div>
      
      <div style={{ marginTop: "100vh", paddingBottom: "50vh" }}>
        <div ref={intRef} style={{ 
          padding: "2rem", 
          background: isIntersecting ? "#5BE30C" : "rgba(255,255,255,0.05)", 
          color: isIntersecting ? "black" : "white", 
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRadius: "12px",
          fontWeight: "bold"
        }}>
          {isIntersecting ? "Target Intersected! (IntersectionObserver)" : "Scroll down to see me intersect..."}
        </div>
      </div>
    </div>
  );
}
`;

export default function PlaygroundPage() {
  return (
    <div className="w-full">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-[-0.04em] leading-[0.92]">
          Live Sandbox
        </h1>
        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-normal max-w-2xl">
          Write code and instantly test the performance of use-web-kit directly in your browser. 
          Powered by Sandpack.
        </p>
      </header>

      <div className="mt-8">
        <LivePlayground code={CODE} />
      </div>
    </div>
  );
}
