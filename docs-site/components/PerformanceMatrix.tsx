"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const GRID_SIZE = 5000; // Massive background grid for 4K displays

export default function PerformanceMatrix() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(60);
  
  // Track FPS to prove performance
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // O(1) Mathematical Hover (Bypasses z-index and pointer-events overlaps)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cols = 0;
    let cellW = 0;
    let cellH = 0;

    const updateDimensions = () => {
      const firstCell = container.children[0] as HTMLElement;
      if (!firstCell) return;
      const rect = firstCell.getBoundingClientRect();
      const gap = 1; // 1px grid gap
      cellW = rect.width + gap;
      cellH = rect.height + gap;
      
      // Calculate how many columns fit in the container (auto-fill behavior)
      cols = Math.floor((container.clientWidth + gap) / cellW);
    };

    // Delay measurement slightly to let DOM paint, then attach resize listener
    setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      if (cols === 0) return;
      
      const col = Math.floor(e.clientX / cellW);
      const row = Math.floor(e.clientY / cellH);
      const index = row * cols + col;

      if (index >= 0 && index < container.children.length) {
        const target = container.children[index] as HTMLElement;
        if (target && target.classList.contains("matrix-cell")) {
          // Direct DOM manipulation
          target.style.background = "#5BE30C";
          target.style.transform = "scale(1.2)";
          target.style.zIndex = "10";
          target.style.borderRadius = "4px";
          target.style.boxShadow = "0 0 20px rgba(91, 227, 12, 0.4)";
          
          setTimeout(() => {
            if (target) {
              target.style.background = "rgba(255,255,255,0.015)";
              target.style.transform = "scale(1)";
              target.style.zIndex = "1";
              target.style.borderRadius = "2px";
              target.style.boxShadow = "none";
            }
          }, 600);
        }
      }
    };
    
    // Bind to window so it fires even when hovering over z-10 UI layers!
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0 pointer-events-auto bg-[#050507]">
      {/* Real-time FPS Monitor floating HUD */}
   
      {/* The Matrix */}
      <div 
        ref={containerRef}
        className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-[1px] w-full h-full opacity-30"
        style={{ perspective: "1000px" }}
      >
        {[...Array(GRID_SIZE)].map((_, i) => (
          <div
            key={i}
            className="matrix-cell aspect-square bg-white/[0.015] border-b border-r border-white/[0.02] transition-all duration-700 ease-out"
          />
        ))}
      </div>
    </div>
  );
}
