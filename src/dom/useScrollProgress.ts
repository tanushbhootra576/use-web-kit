import { useCallback, useState } from "react";

export function useScrollProgress(): {
  ref: (node: Element | null) => (() => void) | void;
  progress: number;
} {
  const [progress, setProgress] = useState(0);

  const ref = useCallback((node: Element | null) => {
    if (!node) return;
    
    const isRoot = node === document.documentElement || node === document.body;
    const target = isRoot ? window : node;
    
    let rafId: number | null = null;
    
    const calculateProgress = () => {
      let currentProgress = 0;
      if (isRoot) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        currentProgress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
      } else {
        const el = node;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const maxScroll = scrollHeight - clientHeight;
        currentProgress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;
      }
      setProgress(currentProgress);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        calculateProgress();
      });
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    calculateProgress();

    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, []);

  return { ref, progress };
}
