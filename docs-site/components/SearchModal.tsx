"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HOOKS_DATA } from "../lib/hooks-data";
import { NAV_GROUPS } from "../lib/nav-data";
import { cn } from "@/lib/utils";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = HOOKS_DATA.filter((hook) => 
    hook.name.toLowerCase().includes(query.toLowerCase()) || 
    hook.description.toLowerCase().includes(query.toLowerCase())
  );

  const guideResults = NAV_GROUPS.flatMap(g => g.items).filter(item => 
    !item.href.includes("#use") && item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search documentation..."
            className="w-full bg-transparent border-none outline-none text-primary font-mono text-sm placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="text-[10px] text-muted-foreground hover:text-primary font-mono border border-border bg-background rounded px-2 py-1 transition-colors">
            ESC
          </button>
        </div>

        <div className="overflow-y-auto p-2 no-scrollbar">
          {query.length > 0 ? (
            <>
              {results.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] uppercase text-muted-foreground font-mono tracking-widest px-3 py-2 font-semibold">Hooks</div>
                  {results.map((hook) => (
                    <button
                      key={hook.id}
                      onClick={() => {
                        router.push(`/docs/api#${hook.id}`);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 flex items-start gap-3 group transition-colors"
                    >
                      <div className="text-accent mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-mono text-primary group-hover:text-accent transition-colors">{hook.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{hook.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {guideResults.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground font-mono tracking-widest px-3 py-2 font-semibold">Guides</div>
                  {guideResults.map((guide) => (
                    <button
                      key={guide.href}
                      onClick={() => {
                        router.push(guide.href);
                        onClose();
                      }}
                      className="w-full text-left px-3 py-3 rounded-lg hover:bg-white/5 flex items-center gap-3 group transition-colors"
                    >
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{guide.label}</div>
                    </button>
                  ))}
                </div>
              )}

              {results.length === 0 && guideResults.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm font-mono">
                  No results found for "{query}"
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm font-mono">
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
