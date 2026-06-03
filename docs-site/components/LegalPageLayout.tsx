import { ReactNode } from "react";

interface LegalPageLayoutProps {
  label: string;
  title: string;
  description: string;
  lastUpdated?: string;
  children: ReactNode;
}

export default function LegalPageLayout({ label, title, description, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-accent/40" />
            <span className="section-label">{label}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[-0.035em] leading-[0.95] mb-5">
            {title}
          </h1>
          <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-normal max-w-2xl">
            {description}
          </p>
          {lastUpdated && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-accent/30" />
              <span className="meta-text text-zinc-600">Last updated: {lastUpdated}</span>
            </div>
          )}
        </header>

        <div className="h-px bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent mb-14" />

        {/* Content */}
        <div className="prose prose-invert prose-zinc max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight
          prose-p:text-zinc-400 prose-p:leading-[1.75]
          prose-a:text-accent hover:prose-a:text-accent/80 prose-a:no-underline
          prose-strong:text-zinc-200
          prose-ul:list-disc prose-li:text-zinc-400
          prose-code:text-accent prose-code:bg-accent/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:border prose-code:border-accent/10 prose-code:before:content-none prose-code:after:content-none">
          {children}
        </div>
      </div>
    </div>
  );
}
