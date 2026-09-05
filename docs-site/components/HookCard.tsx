import Link from "next/link";
import { HookMeta } from "@/lib/hooks-data";
import { clsx } from "clsx";
import { Cpu, ArrowUpRight } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface HookCardProps {
  hook: HookMeta;
}

export default function HookCard({ hook }: HookCardProps) {
  return (
    <Link href={`/docs/hooks/${hook.slug}`} className="block group h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
      <SpotlightCard className="p-8 h-full flex flex-col">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-runtime-dots opacity-[0.03] pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border border-white/5 flex items-center justify-center bg-white/[0.02]">
                 <Cpu size={14} className="text-zinc-700 group-hover:text-accent transition-colors" />
              </div>
              <span className="mono-label !text-[8px] text-zinc-600 tracking-[0.3em]">
                {hook.category}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-accent transition-colors tracking-tighter">
              {hook.name}
            </h3>
          </div>
          <div className="shrink-0 w-10 h-10 border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-accent group-hover:border-accent/20 transition-all duration-300">
             <ArrowUpRight size={18} />
          </div>
        </div>

        {/* Description */}
        <div className="flex-grow relative z-10 mb-8">
          <p className="text-zinc-500 text-sm leading-relaxed font-light line-clamp-2 group-hover:text-zinc-400 transition-colors">
            {hook.description}
          </p>
        </div>

        {/* Code preview - Systems style */}
        <div className="border border-white/5 bg-black/80 mb-8 relative z-10 overflow-hidden group/code">
          <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
            </div>
            <span className="mono-label !text-[7px] text-zinc-700">src/hooks/{hook.slug}.ts</span>
          </div>
          <div className="p-5 overflow-x-auto no-scrollbar">
            <pre className="text-[11px] leading-relaxed font-mono">
              {hook.codePreview.split("\n").map((line, i) => {
                const isFunction = line.includes("use");
                const isString = line.includes("'") || line.includes('"');
                return (
                  <div key={i} className="whitespace-pre flex gap-4">
                    <span className="w-4 text-zinc-800 text-right select-none">{i + 1}</span>
                    <span
                      className={clsx(
                        "transition-colors",
                        isFunction ? "text-accent/80" : isString ? "text-zinc-400" : "text-zinc-600"
                      )}
                    >
                      {line || "\u00A0"}
                    </span>
                  </div>
                );
              })}
            </pre>
          </div>
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover/code:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 relative z-10">
          {hook.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-2 py-0.5 border border-white/5 bg-white/[0.01] text-zinc-600 uppercase tracking-widest font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </SpotlightCard>
    </Link>
  );
}

