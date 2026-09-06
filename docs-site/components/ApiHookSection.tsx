"use client";

import { HookDoc } from "../lib/hooks-data";
import CodeBlock from "./CodeBlock";
import PropsTable from "./PropsTable";
import Callout from "./Callout";
import LivePlayground from "./LivePlayground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ApiHookSection({ hook }: { hook: HookDoc }) {
  return (
    <section id={hook.id} className="scroll-mt-24">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] font-mono font-semibold text-accent/70 bg-accent/[0.08] border border-accent/15 px-2.5 py-1 uppercase tracking-widest">
            {hook.domain}
          </span>
          {hook.isNew && (
            <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 uppercase tracking-widest">
              New
            </span>
          )}
        </div>

        <h1 className="text-4xl font-mono font-bold text-white tracking-tight mb-4">
          <span className="text-zinc-600">use</span>
          <span>{hook.name.replace(/^use/, "")}</span>
        </h1>

        <p className="text-zinc-400 text-lg leading-[1.8] max-w-2xl">
          {hook.description}
        </p>
      </div>

      <div className="h-px bg-white/[0.06] mb-10" />

      {/* ── Signature ── */}
      <div className="mb-10">
        <h2 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-4">
          Signature
        </h2>
        <CodeBlock code={hook.signature} language="typescript" filename="type.ts" />
      </div>

      {/* ── Options ── */}
      {hook.options.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Options
          </h2>
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
          <h2 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Returns
          </h2>
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
          <h2 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Examples
          </h2>
          <div className="flex flex-col gap-8">
            {hook.examples.map((example, i) => {
              const isRunnable = example.code.includes("export default");
              return (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-3">
                    {isRunnable && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                    )}
                    <span className="text-base font-medium text-white">
                      {example.title}
                    </span>
                    {isRunnable && (
                      <span className="text-[10px] font-mono text-zinc-600 border border-white/10 px-1.5 py-0.5">
                        Live Sandbox
                      </span>
                    )}
                  </div>
                  {isRunnable ? (
                    <LivePlayground code={example.code} />
                  ) : (
                    <CodeBlock code={example.code} filename="example.tsx" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Notes ── */}
      {hook.notes && hook.notes.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-500 mb-4">
            Architecture Notes
          </h2>
          <div className="flex flex-col gap-3">
            {hook.notes.map((note, i) => (
              <Callout key={i} type="performance" title="Implementation Detail">
                {note}
              </Callout>
            ))}
          </div>
        </div>
      )}

      {/* ── Back link ── */}
      <div className="pt-6 border-t border-white/[0.06]">
        <Link
          href="/docs/api"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to API Reference
        </Link>
      </div>
    </section>
  );
}
