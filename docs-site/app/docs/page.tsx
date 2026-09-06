import Link from "next/link";
import InstallTerminal from "@/components/InstallTerminal";
import CodeBlock from "@/components/CodeBlock";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HOOKS_DATA } from "@/lib/hooks-data";

export const metadata = {
  title: "Introduction — use-web-kit",
  description:
    "use-web-kit is a zero-dependency performance toolkit for React 19. Tree-shakeable, SSR-safe, memory-leak-proof hooks.",
};

const importCode = `import { useNetworkStatus, useStorage, useIdleQueue } from 'use-web-kit';`;

const useCode = `function App() {
  const { isOnline, effectiveType } = useNetworkStatus();

  return (
    <div>
      {!isOnline && <Banner>You are offline</Banner>}
      <p>Connection: {effectiveType}</p>
    </div>
  );
}`;

const domains = ["DOM", "Concurrency", "State", "Pipelines", "BOM"] as const;

export default function DocsPage() {
  const totalHooks = HOOKS_DATA.length;

  return (
    <div className="max-w-3xl">
      {/* ── Hero ── */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-mono font-semibold text-accent/80 bg-accent/10 border border-accent/20 px-2.5 py-1 uppercase tracking-widest">
            Getting Started
          </span>
          <span className="text-[10px] font-mono text-zinc-600">v1.0.4 — Stable</span>
        </div>

        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
          Introduction
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
          <code className="text-zinc-300 text-base font-mono">use-web-kit</code> is a
          zero-dependency performance toolkit for React 19 and Next.js 15.{" "}
          {totalHooks} hooks, fully tree-shakeable, SSR-safe, and memory-leak-proof.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/docs/api"
            className="inline-flex items-center gap-2 bg-accent text-black font-semibold text-sm px-4 py-2.5 hover:bg-accent/90 transition-colors rounded-md"
          >
            Browse {totalHooks} Hooks
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/docs/quick-start"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 border border-white/10 px-4 py-2.5 hover:bg-white/[0.04] hover:border-white/20 transition-colors rounded-md"
          >
            Quick Start
          </Link>
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mb-16" />

      {/* ── 3 Steps ── */}
      <div className="mb-16">
        <h2 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-10">
          Setup in 3 steps
        </h2>

        <div className="flex flex-col gap-12">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-white/10 text-sm font-mono font-bold text-zinc-500">
              1
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-white font-semibold mb-1">Install</h3>
              <p className="text-zinc-500 text-base mb-4">
                Add the package to your project.
              </p>
              <InstallTerminal />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-white/10 text-sm font-mono font-bold text-zinc-500">
              2
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-white font-semibold mb-1">Import</h3>
              <p className="text-zinc-500 text-base mb-4">
                Import only what you need — everything is tree-shakeable.
              </p>
              <CodeBlock code={importCode} language="typescript" filename="app.tsx" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-white/10 text-sm font-mono font-bold text-zinc-500">
              3
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-white font-semibold mb-1">Use</h3>
              <p className="text-zinc-500 text-base mb-4">
                Drop hooks directly into components. No providers, no wrappers.
              </p>
              <CodeBlock code={useCode} language="tsx" filename="App.tsx" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mb-16" />

      {/* ── Why ── */}
      <div className="mb-16">
        <h2 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-8">
          Why use-web-kit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Zero Dependencies",
              body: "No lodash, no polyfills, no event emitters. Built on native browser APIs only.",
            },
            {
              title: "O(1) Observers",
              body: "All IntersectionObserver and ResizeObserver hooks share a single global instance — never one per component.",
            },
            {
              title: "React 19 Native",
              body: "Ref callback cleanup, useSyncExternalStore, and startTransition used correctly throughout.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="border border-white/[0.06] bg-white/[0.02] p-5 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={13} className="text-accent shrink-0" />
                <span className="text-white text-base font-semibold">{f.title}</span>
              </div>
              <p className="text-zinc-500 text-base leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/[0.06] mb-16" />

      {/* ── Hook Domains ── */}
      <div className="mb-16">
        <h2 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-8">
          What's included
        </h2>
        <div className="flex flex-col gap-2">
          {domains.map((domain) => {
            const hooks = HOOKS_DATA.filter((h) => h.domain === domain);
            if (!hooks.length) return null;
            return (
              <Link
                key={domain}
                href={`/docs/api#domain-${domain.toLowerCase()}`}
                className="flex items-center justify-between p-4 border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-accent/70 bg-accent/[0.08] border border-accent/10 px-2 py-0.5 uppercase tracking-wider">
                    {domain}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hooks.slice(0, 4).map((h) => (
                      <span key={h.id} className="text-xs font-mono text-zinc-500">
                        {h.name}
                      </span>
                    ))}
                    {hooks.length > 4 && (
                      <span className="text-xs font-mono text-zinc-700">
                        +{hooks.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Next Steps ── */}
      <div>
        <h2 className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-widest mb-6">
          Next steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: "API Reference",
              desc: "Browse all hooks with type signatures, options, and live examples.",
              href: "/docs/api",
            },
            {
              title: "Quick Start",
              desc: "A real-world example combining 5 hooks in a single component.",
              href: "/docs/quick-start",
            },
            {
              title: "Performance Guide",
              desc: "Learn about O(1) observers, RAF batching, and memory patterns.",
              href: "/docs/performance",
            },
            {
              title: "Usage Patterns",
              desc: "SSR safety, testing, and composition best practices.",
              href: "/docs/usage",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col gap-1.5 p-5 border border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.1] transition-all rounded-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-base font-semibold group-hover:text-accent transition-colors rounded-md">
                  {item.title}
                </span>
                <ArrowRight
                  size={14}
                  className="text-zinc-700 group-hover:text-accent group-hover:translate-x-0.5 transition-all rounded-xl"
                />
              </div>
              <p className="text-zinc-500 text-base leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
