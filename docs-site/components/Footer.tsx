import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/nav-data";
import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#030305] mt-auto">
      {/* Top gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* ── Main Footer Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8 py-16 lg:py-20">
          {/* Brand Column — spans 2 cols on lg */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 border border-accent/20 flex items-center justify-center">
                <Cpu size={13} className="text-accent/60" />
              </div>
              <span className="font-bold tracking-[-0.03em] text-white text-[15px]">use-web-kit</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6 font-normal">
              Engineering-grade React 19 hooks. Zero dependencies. Frame-perfect performance.
              Designed for predictable runtimes.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 border border-accent/15 bg-accent/[0.04] rounded-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-subtle" />
                <span className="font-mono text-[10px] text-accent/80 tracking-wide">STABLE</span>
              </div>
              <span className="meta-text text-zinc-700">v1.0.4</span>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="mono-label text-zinc-500 mb-5 !text-[9px]">{group.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-zinc-200 text-[13px] transition-colors inline-flex items-center gap-1.5"
                      >
                        {link.label}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-zinc-500 hover:text-zinc-200 text-[13px] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/[0.04] py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[12px] font-mono">
            © {new Date().getFullYear()} use-web-kit. Open source under MIT License.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/tanushbhootra576/use-web-kit"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-zinc-400 text-[12px] font-mono transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://npmjs.com/package/use-web-kit"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-600 hover:text-zinc-400 text-[12px] font-mono transition-colors"
            >
              npm
            </a>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent/40" />
              <span className="text-zinc-700 text-[11px] font-mono">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
