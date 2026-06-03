"use client";

import { HookDoc } from "../lib/hooks-data";
import CodeBlock from "./CodeBlock";
import PropsTable from "./PropsTable";
import Callout from "./Callout";

export default function ApiHookSection({ hook }: { hook: HookDoc }) {
  return (
    <section id={hook.id} className="scroll-mt-24 mb-24 last:mb-0">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 bg-accent/[0.08] text-accent border border-accent/15 font-semibold">
            {hook.domain}
          </span>
        </div>
        <h2 id={`${hook.id}-heading`} className="text-3xl lg:text-4xl font-bold text-white tracking-[-0.03em] mb-4 flex items-baseline gap-1.5">
          <span className="text-accent/60 font-mono font-normal text-2xl">use</span>
          <span className="font-mono">{hook.name.replace(/^use/, '')}</span>
        </h2>
        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed max-w-3xl font-normal">
          {hook.description}
        </p>
      </div>

      {/* ── Signature ── */}
      <div className="mb-10">
        <h3 className="mono-label !text-[9px] text-zinc-500 mb-3 flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent/50">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Signature
        </h3>
        <div className="bg-[#08080b] border border-white/[0.06] p-4 font-mono text-[13px] text-zinc-300 overflow-x-auto">
          <code>{hook.signature}</code>
        </div>
      </div>

      {/* ── Options ── */}
      {hook.options.length > 0 && (
        <div className="mb-10">
          <h3 className="mono-label !text-[9px] text-zinc-500 mb-3">Options</h3>
          <PropsTable
            columns={[
              { key: "name", label: "Property" },
              { key: "type", label: "Type" },
              { key: "default", label: "Default" },
              { key: "description", label: "Description" },
            ]}
            data={hook.options}
          />
        </div>
      )}

      {/* ── Returns ── */}
      {hook.returns.length > 0 && (
        <div className="mb-10">
          <h3 className="mono-label !text-[9px] text-zinc-500 mb-3">Returns</h3>
          <PropsTable
            columns={[
              { key: "name", label: "Property" },
              { key: "type", label: "Type" },
              { key: "description", label: "Description" },
            ]}
            data={hook.returns}
          />
        </div>
      )}

      {/* ── Examples ── */}
      {hook.examples.length > 0 && (
        <div className="mb-10">
          <h3 className="mono-label !text-[9px] text-zinc-500 mb-3">Examples</h3>
          <div className="flex flex-col gap-5">
            {hook.examples.map((example, i) => (
              <div key={i}>
                <div className="text-sm text-white mb-2 font-medium">{example.title}</div>
                <CodeBlock code={example.code} filename="example.tsx" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Architecture Notes ── */}
      {hook.notes && hook.notes.length > 0 && (
        <div>
          <h3 className="mono-label !text-[9px] text-zinc-500 mb-3">Architecture</h3>
          <div className="flex flex-col gap-3">
            {hook.notes.map((note, i) => (
              <Callout key={i} type="performance" title="Implementation Detail">
                {note}
              </Callout>
            ))}
          </div>
        </div>
      )}

      {/* Section divider */}
      <div className="mt-16 h-px bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-transparent" />
    </section>
  );
}
