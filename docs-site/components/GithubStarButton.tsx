"use client";

import { useEffect, useState } from "react";
import { Github, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function GithubStarButton({ showCount = true, className = "" }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    // Fetch live star count from GitHub API
    fetch("https://api.github.com/repos/tanushbhootra576/use-web-kit")
      .then(res => res.json())
      .then(data => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Fallback or ignore
      });
  }, []);

  const formatStars = (count: number) => {
    return count > 999 ? (count / 1000).toFixed(1) + "k" : count.toString();
  };

  return (
    <a
      href="https://github.com/tanushbhootra576/use-web-kit"
      target="_blank"
      rel="noreferrer"
      className={`group flex items-center gap-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.03] text-sm font-medium text-white transition-all hover:bg-white/[0.08] hover:border-white/20 ${className}`}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-white/10 group-hover:border-white/20 transition-colors">
        <Github size={15} className="text-zinc-400 group-hover:text-white transition-colors" />
        <span className="hidden sm:inline">Star on GitHub</span>
        <span className="sm:hidden">Star</span>
      </div>
      
      {showCount && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
          <Star size={13} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
          <motion.span 
            key={stars} // animate on load
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-zinc-400 font-mono text-[11px]"
          >
            {stars !== null ? formatStars(stars) : "..."}
          </motion.span>
        </div>
      )}
    </a>
  );
}