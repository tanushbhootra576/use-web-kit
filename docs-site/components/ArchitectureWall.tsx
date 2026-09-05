"use client";

import TextWall from "./TextWall";

export default function ArchitectureWall() {
  return (
    <div className="relative w-full h-[60vh] min-h-[500px] bg-transparent overflow-hidden flex flex-col justify-center border-y border-white/[0.02] my-12">
      
      {/* Subtle fade edges so it seamlessly blends into the global background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Ambient, Minimalist Text Wall */}
      <div className="absolute inset-0 z-0">
        <TextWall 
          words={["O(1) OVERHEAD", "NATIVE DOM", "ZERO DEPS", "SERVER COMPONENTS", "FRAME PERFECT", "USE-WEB-KIT", "ORCHESTRATOR"]} 
          // Scrambling text is barely visible
          textColor="rgba(255, 255, 255, 0.02)" 
          // Revealed words are sophisticated, crisp white
          wordsColor="rgba(255, 255, 255, 0.9)" 
          emptyLines={2}
          font={{ 
            fontFamily: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace', 
            fontSize: 14, 
            fontWeight: 400, 
            letterSpacing: '0.15em' 
          }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          stagger={0.08}
        />
      </div>

      {/* Clean, authoritative foreground typography */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none gap-5">
       
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white/90 drop-shadow-md text-center max-w-xl leading-tight">
          Engineered for raw <span className="text-zinc-500">performance.</span>
        </h2>
      </div>
    </div>
  );
}
