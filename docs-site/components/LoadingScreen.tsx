"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GooeyLoader } from "@/components/ui/loader-10";

interface LoadingScreenProps {
  exitDelay?: number;
  className?: string;
}

export default function LoadingScreen({ 
  exitDelay = 1400, 
  className
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), exitDelay);
    return () => clearTimeout(timer);
  }, [exitDelay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#030305] overflow-hidden",
            className
          )}
          role="status"
          aria-label="Loading"
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-runtime-grid opacity-[0.06]" />

          {/* Loader */}
          <div className="relative flex flex-col items-center gap-12 scale-[0.65] md:scale-75">
            <GooeyLoader 
              primaryColor="#5BE30C" 
              secondaryColor="rgba(91, 227, 12, 0.4)" 
              borderColor="rgba(255, 255, 255, 0.05)" 
            />

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="meta-text text-zinc-600 tracking-[0.3em]"
            >
              Initializing
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
