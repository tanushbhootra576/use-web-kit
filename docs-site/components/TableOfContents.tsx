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
    </div>
  );
}
