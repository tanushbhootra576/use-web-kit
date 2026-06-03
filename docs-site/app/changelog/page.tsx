import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Changelog — use-web-kit",
  description: "Version history and release notes for use-web-kit.",
};

const releases = [
  {
    version: "1.0.4",
    date: "May 14, 2026",
    tag: "latest",
    changes: [
      { type: "fix", text: "Fixed useWorkerPool Blob URL leak on rapid unmount/remount cycles" },
      { type: "fix", text: "Corrected useBroadcastState stale closure in cross-tab sync" },
      { type: "perf", text: "Reduced useSmartIntersection RAF batch overhead by 15%" },
      { type: "docs", text: "Added migration guide from v0.x to v1.x" },
    ],
  },
  {
    version: "1.0.3",
    date: "April 28, 2026",
    changes: [
      { type: "feat", text: "Added useAdaptivePolling hook for intelligent background polling" },
      { type: "feat", text: "Added useActionPipeline for React 19 form actions" },
      { type: "fix", text: "Fixed useNetworkStatus SSR hydration mismatch" },
      { type: "perf", text: "Optimized useDebouncedStorage write coalescing" },
    ],
  },
  {
    version: "1.0.2",
    date: "April 10, 2026",
    changes: [
      { type: "feat", text: "Added usePermission hook for Permissions API monitoring" },
      { type: "feat", text: "Added usePageLifecycle hook for visibility/focus tracking" },
      { type: "fix", text: "Fixed useMediaControls volume state sync issue" },
    ],
  },
  {
    version: "1.0.1",
    date: "March 22, 2026",
    changes: [
      { type: "fix", text: "Fixed useIdleQueue fallback for browsers without requestIdleCallback" },
      { type: "fix", text: "Corrected TypeScript generic constraints on useEventPipeline" },
      { type: "docs", text: "Improved API reference documentation" },
    ],
  },
  {
    version: "1.0.0",
    date: "March 1, 2026",
    tag: "major",
    changes: [
      { type: "feat", text: "Initial stable release with 14 production-ready hooks" },
      { type: "feat", text: "Global singleton architecture for IntersectionObserver and BroadcastChannel" },
      { type: "feat", text: "React 19 ref callback cleanup pattern across all DOM hooks" },
      { type: "feat", text: "Full SSR/RSC compatibility with useSyncExternalStore" },
      { type: "feat", text: "Complete TypeScript strict-mode definitions" },
    ],
  },
];

const typeColors: Record<string, { bg: string; text: string }> = {
  feat: { bg: "bg-accent/[0.08] border-accent/15", text: "text-accent" },
  fix: { bg: "bg-blue-500/[0.08] border-blue-500/15", text: "text-blue-400" },
  perf: { bg: "bg-amber-500/[0.08] border-amber-500/15", text: "text-amber-400" },
  docs: { bg: "bg-zinc-500/[0.08] border-zinc-500/15", text: "text-zinc-400" },
};

export default function ChangelogPage() {
  return (
    <LegalPageLayout
      label="Releases"
      title="Changelog"
      description="Version history, release notes, and breaking changes for every use-web-kit release."
      lastUpdated="May 2026"
    >
      <div className="not-prose">
        <div className="space-y-12">
          {releases.map((release, ri) => (
            <div key={release.version} className="relative">
              {/* Version Header */}
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight font-mono">{release.version}</h2>
                {release.tag === "latest" && (
                  <span className="text-[9px] font-mono uppercase tracking-wider text-accent bg-accent/[0.08] border border-accent/15 px-2 py-0.5 font-semibold">
                    latest
                  </span>
                )}
                {release.tag === "major" && (
                  <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/[0.08] border border-amber-500/15 px-2 py-0.5 font-semibold">
                    major
                  </span>
                )}
                <span className="meta-text text-zinc-600 ml-auto">{release.date}</span>
              </div>

              {/* Changes */}
              <div className="space-y-2 pl-1">
                {release.changes.map((change, ci) => {
                  const colors = typeColors[change.type] || typeColors.docs;
                  return (
                    <div key={ci} className="flex items-start gap-3 py-2 group">
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border font-semibold shrink-0 mt-0.5 ${colors.bg} ${colors.text}`}>
                        {change.type}
                      </span>
                      <span className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {change.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              {ri < releases.length - 1 && (
                <div className="mt-10 h-px bg-white/[0.04]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </LegalPageLayout>
  );
}
