"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, Cpu, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll("h2[id], h3[id]");
    const items: TOCItem[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent?.replace(/^\/\/\s*/, "") || "",
      level: el.tagName === "H2" ? 2 : 3,
    }));
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-10 pt-2">
      {/* On This Page */}
      {headings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-1 bg-accent/40" />
            <span className="mono-label !text-[9px] text-zinc-500">On This Page</span>
          </div>
          <nav className="flex flex-col gap-1">
            {headings.map((heading, i) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={cn(
                  "text-[11px] py-1 transition-all duration-150 border-l",
                  heading.level === 3 ? "pl-6 -ml-px" : "pl-3 -ml-px",
                  activeId === heading.id
                    ? "text-accent border-accent font-medium"
                    : "text-zinc-600 border-transparent hover:text-zinc-400 hover:border-white/10"
                )}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Runtime Status Panel */}
      <div className="border-t border-white/[0.04] pt-8">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={12} className="text-zinc-600" />
          <span className="mono-label !text-[9px] text-zinc-500">Runtime</span>
        </div>

        <div className="border border-white/[0.05] bg-white/[0.01] p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="meta-text !text-[8px] text-zinc-600">Latency</span>
            <span className="text-[10px] font-mono text-accent">0.12ms</span>
          </div>
          <div className="h-px w-full bg-white/[0.04] overflow-hidden">
            <motion.div
              animate={{ width: ["20%", "45%", "30%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-full bg-accent/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="meta-text !text-[7px] text-zinc-700 mb-0.5">Threads</div>
              <div className="text-xs font-mono text-white">4 Active</div>
            </div>
            <div>
              <div className="meta-text !text-[7px] text-zinc-700 mb-0.5">Heap</div>
              <div className="text-xs font-mono text-white">12.4MB</div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 border border-white/[0.04] bg-white/[0.01]">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={10} className="text-accent/50" />
            <span className="meta-text !text-[7px] text-zinc-600">Quick</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 bg-black/40 px-2.5 py-1.5 border border-white/[0.04]">
            $ npx use-web-kit init
          </div>
        </div>
      </div>
    </div>
  );
}
