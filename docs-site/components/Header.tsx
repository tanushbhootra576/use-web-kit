"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TOP_NAV_LINKS } from "@/lib/nav-data";
import { Menu, X, Github, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-[100] w-full transition-all duration-300",
        "border-b backdrop-blur-xl",
        scrolled
          ? "bg-[#050507]/90 border-white/[0.06] shadow-[0_1px_20px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-white/[0.03]"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* ── Left: Logo + Nav ── */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-7 h-7 border border-accent/30 flex items-center justify-center transition-all group-hover:border-accent group-hover:shadow-[0_0_12px_rgba(91,227,12,0.25)]">
                <Cpu size={13} className="text-accent/70 group-hover:text-accent transition-colors" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent rounded-full pulse-subtle" />
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="font-bold tracking-[-0.03em] text-white text-[15px]">use-web-kit</span>
              <span className="meta-text !text-[8px] text-zinc-600">v1.0.4</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {TOP_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "relative px-3.5 py-2 text-[12px] font-medium tracking-[-0.01em] rounded-md transition-all duration-200",
                    isActive
                      ? "text-accent bg-accent/[0.08]"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-px bg-accent/60"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-4">
          {/* Install pill */}
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-md cursor-pointer hover:border-white/[0.1] hover:bg-white/[0.05] transition-all group">
            <Terminal size={12} className="text-zinc-600 group-hover:text-accent transition-colors" />
            <span className="font-mono text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors tracking-tight">npm i use-web-kit</span>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/tanushbhootra576/use-web-kit"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-zinc-500 hover:text-white transition-colors p-2 rounded-md hover:bg-white/[0.04]"
          >
            <Github size={16} />
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-zinc-400 hover:text-white p-2 rounded-md hover:bg-white/[0.04] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-[#050507]/98 backdrop-blur-2xl overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-1">
              {TOP_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-accent bg-accent/[0.08]"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between px-4">
                <a
                  href="https://github.com/tanushbhootra576/use-web-kit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-zinc-500 text-sm"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <span className="meta-text text-zinc-700">v1.0.4</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
