import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Roadmap — use-web-kit",
  description: "Future development plans for use-web-kit.",
};

const phases = [
  {
    quarter: "Q3 2026",
    status: "in-progress",
    title: "Developer Experience",
    items: [
      "Interactive API playground for live hook testing",
      "VS Code extension with inline documentation",
      "useClipboard hook for clipboard API access",
      "useGeolocation hook for Position API",
    ],
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    title: "Advanced Primitives",
    items: [
      "useWebSocket — managed WebSocket connections with auto-reconnect",
      "useServiceWorker — SW lifecycle and cache management",
      "useSharedWorker — shared worker state with ref-counting",
      "useVirtualScroll — zero-dependency virtualized lists",
    ],
  },
  {
    quarter: "Q1 2027",
    status: "exploring",
    title: "Ecosystem Integration",
    items: [
      "First-class Next.js App Router plugin",
      "React Native Web compatibility layer",
      "Devtools browser extension",
      "Performance benchmarking dashboard",
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  "in-progress": { label: "In Progress", color: "text-accent", dot: "bg-accent" },
  "planned": { label: "Planned", color: "text-blue-400", dot: "bg-blue-400" },
  "exploring": { label: "Exploring", color: "text-amber-400", dot: "bg-amber-400" },
};

export default function RoadmapPage() {
  return (
    <LegalPageLayout
      label="Future"
      title="Roadmap"
      description="Our development plans and future direction. This roadmap is indicative and subject to change based on community feedback."
      lastUpdated="May 2026"
    >
      <div className="not-prose space-y-10">
        {phases.map((phase) => {
          const status = statusConfig[phase.status];
          return (
            <div key={phase.quarter} className="border border-white/[0.05] bg-white/[0.01] p-6 lg:p-8 hover:border-white/[0.08] transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-lg font-mono tracking-tight">{phase.quarter}</span>
                  <span className="text-zinc-600 font-normal text-base">— {phase.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${status.color} font-semibold`}>
                    {status.label}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-px h-4 bg-white/[0.08] mt-1 shrink-0 group-hover:bg-accent/30 transition-colors" />
                    <span className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h2>Have a suggestion?</h2>
        <p>
          We prioritize features based on community demand. Open a feature request on{" "}
          <a href="https://github.com/tanushbhootra576/use-web-kit/issues" target="_blank" rel="noreferrer">GitHub Issues</a>{" "}
          to influence our roadmap.
        </p>
      </div>
    </LegalPageLayout>
  );
}
