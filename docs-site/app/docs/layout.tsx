import Sidebar from '@/components/Sidebar';
import TableOfContents from '@/components/TableOfContents';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full max-w-[1600px] mx-auto min-h-[calc(100vh-64px)]">
      {/* ── Left Sidebar ── */}
      <aside className="hidden lg:block w-[260px] shrink-0 border-r border-white/[0.04] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar">
        <div className="px-5 py-8">
          <Sidebar />
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0 bg-[#060609]">
        <div className="mx-auto max-w-[900px] px-6 lg:px-14 py-12 lg:py-20">
          <div className="prose prose-lg prose-invert prose-zinc max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
            prose-p:text-zinc-400 prose-p:leading-[1.8] prose-p:font-normal
            prose-a:text-accent hover:prose-a:text-accent/80 prose-a:no-underline prose-a:font-medium
            prose-code:text-accent prose-code:bg-accent/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-accent/10
            prose-pre:bg-[#08080b] prose-pre:border prose-pre:border-white/[0.06] prose-pre:shadow-none prose-pre:rounded-none
            prose-strong:text-zinc-200 prose-strong:font-semibold
            prose-ul:list-disc prose-li:text-zinc-400">
            {children}
          </div>
        </div>
      </div>

      {/* ── Right Inspector ── */}
      <aside className="hidden xl:block w-[240px] shrink-0 border-l border-white/[0.04] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar">
        <div className="px-5 py-8">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
