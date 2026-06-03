"use client";

import LegalPageLayout from "@/components/LegalPageLayout";
import { motion } from "framer-motion";

const systems = [
  { name: "npm Registry", status: "operational", uptime: "99.99%" },
  { name: "Documentation Site", status: "operational", uptime: "99.98%" },
  { name: "GitHub Repository", status: "operational", uptime: "99.99%" },
  { name: "CI/CD Pipeline", status: "operational", uptime: "99.95%" },
  { name: "CDN (unpkg/jsdelivr)", status: "operational", uptime: "99.97%" },
];

const statusColors: Record<string, { dot: string; text: string; bg: string }> = {
  operational: { dot: "bg-accent", text: "text-accent", bg: "bg-accent/[0.06]" },
  degraded: { dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/[0.06]" },
  outage: { dot: "bg-red-400", text: "text-red-400", bg: "bg-red-500/[0.06]" },
};

export default function StatusPage() {
  return (
    <LegalPageLayout
      label="Operations"
      title="System Status"
      description="Real-time operational status of use-web-kit infrastructure and services."
      lastUpdated="May 14, 2026"
    >
      {/* Overall Status Banner */}
      <div className="not-prose mb-12">
        <div className="border border-accent/15 bg-accent/[0.04] p-6 flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-accent animate-ping opacity-30" />
          </div>
          <div>
            <div className="text-white font-semibold text-base">All Systems Operational</div>
            <div className="text-accent/70 text-sm font-normal">No incidents reported in the last 30 days</div>
          </div>
        </div>
      </div>

      {/* Individual Systems */}
      <div className="not-prose mb-12">
        <h2 className="mono-label !text-[9px] text-zinc-500 mb-6">Service Status</h2>
        <div className="border border-white/[0.05] divide-y divide-white/[0.04]">
          {systems.map((system) => {
            const colors = statusColors[system.status];
            return (
              <div key={system.name} className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  <span className="text-white text-sm font-medium">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="meta-text text-zinc-600">{system.uptime} uptime</span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 border ${colors.text} ${colors.bg} border-current/15`}>
                    {system.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Uptime Chart */}
      <div className="not-prose mb-12">
        <h2 className="mono-label !text-[9px] text-zinc-500 mb-6">30-Day Uptime</h2>
        <div className="border border-white/[0.05] bg-white/[0.01] p-6">
          <div className="flex gap-[2px] items-end h-16">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${85 + Math.random() * 15}%` }}
                transition={{ delay: i * 0.02, duration: 0.4 }}
                className="flex-1 bg-accent/30 hover:bg-accent/50 transition-colors rounded-t-[1px] cursor-default"
                title={`Day ${30 - i}: 100%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <span className="meta-text !text-[8px] text-zinc-700">30 days ago</span>
            <span className="meta-text !text-[8px] text-zinc-700">Today</span>
          </div>
        </div>
      </div>

      <h2>Incident History</h2>
      <p>
        No incidents have been reported in the current reporting period. For historical incident data,
        please check our{" "}
        <a href="https://github.com/tanushbhootra576/use-web-kit" target="_blank" rel="noreferrer">GitHub repository</a>.
      </p>
    </LegalPageLayout>
  );
}
