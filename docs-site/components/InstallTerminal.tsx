"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Check, Copy } from "lucide-react";
import { clsx } from "clsx";

const managers = [
  { id: "npm", command: "npm install use-web-kit" },
  { id: "pnpm", command: "pnpm add use-web-kit" },
  { id: "yarn", command: "yarn add use-web-kit" },
  { id: "bun", command: "bun add use-web-kit" },
];

export default function InstallTerminal() {
  const [activeTab, setActiveTab] = useState("npm");
  const [copied, setCopied] = useState(false);

  const activeCommand = managers.find((m) => m.id === activeTab)?.command || "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(activeCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full">
      {/* Tab Interface */}
      <div className="flex border-b border-white/[0.05]">
        {managers.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveTab(m.id)}
            className={clsx(
              "px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] font-semibold transition-all relative",
              activeTab === m.id
                ? "text-accent bg-white/[0.02]"
                : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {m.id}
            {activeTab === m.id && (
              <motion.div layoutId="terminal-tab" className="absolute bottom-0 left-0 right-0 h-px bg-accent/60" />
            )}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="relative overflow-hidden border border-white/[0.05] bg-[#08080b] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <Terminal size={12} className="text-zinc-700" />
            <span className="meta-text !text-[8px] text-zinc-600">Terminal</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 border border-white/10" />
            <div className="w-1.5 h-1.5 border border-white/10" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 font-mono flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-accent/40 select-none">$</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeTab}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                className="text-zinc-200 text-sm truncate tracking-tight"
              >
                {activeCommand}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            onClick={copyToClipboard}
            className={clsx(
              "shrink-0 p-2.5 transition-all border",
              copied
                ? "bg-accent/[0.08] border-accent/20 text-accent"
                : "bg-white/[0.02] border-white/[0.05] text-zinc-600 hover:text-white hover:border-white/10"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
