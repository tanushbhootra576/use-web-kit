export const metadata = {
  title: "Contributing — use-web-kit",
  description: "How to contribute to use-web-kit.",
};

const steps = [
  {
    num: "01",
    title: "Clone & Setup",
    desc: "Fork the repository and install dependencies.",
    code: "git clone https://github.com/tanushbhootra576/use-web-kit\ncd use-web-kit && npm install",
  },
  {
    num: "02",
    title: "Run Tests",
    desc: "Ensure the full test suite passes before making changes.",
    code: "npm run test",
  },
  {
    num: "03",
    title: "Create a Branch",
    desc: "Create a feature branch from main.",
    code: "git checkout -b feat/my-new-hook",
  },
  {
    num: "04",
    title: "Submit a PR",
    desc: "Push your branch and open a Pull Request with a clear description.",
    code: "git push origin feat/my-new-hook",
  },
];

const rules = [
  "Zero external dependencies — no exceptions.",
  "SSR-safe: guard all BOM access behind typeof window !== 'undefined'.",
  "Use React 19 ref cleanup callbacks — never useEffect for DOM observers.",
  "Every observer must have a corresponding cleanup path.",
  "No any unless structurally documented — prefer unknown.",
  "One global singleton per heavy API (IntersectionObserver, BroadcastChannel).",
];

export default function ContributingPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      <main className="max-w-5xl mx-auto px-6 lg:px-10 pt-24 pb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-accent/[0.03] blur-[80px] pointer-events-none" />

        <div className="relative z-10 mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-[1px] bg-accent/40" />
            <span className="section-label">Open Source</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-[-0.035em] leading-[0.95]">
            Contributing to <br />
            <span className="text-gradient-accent">use-web-kit.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl font-normal">
            We welcome all contributions. Follow these guidelines to get started.
          </p>
        </div>

        {/* Steps */}
        <section className="mb-20">
          <h2 className="mono-label !text-[9px] text-zinc-500 mb-8">Quick Start</h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.num} className="border border-white/[0.05] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors group">
                <div className="flex items-start gap-5">
                  <span className="text-lg font-bold font-mono text-accent/40 shrink-0">{step.num}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white mb-1.5 tracking-tight">{step.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4 font-normal">{step.desc}</p>
                    <div className="bg-[#08080b] border border-white/[0.06] overflow-hidden">
                      <pre className="p-4 text-[12px] font-mono text-zinc-400 leading-relaxed overflow-x-auto">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rules */}
        <section>
          <h2 className="mono-label !text-[9px] text-zinc-500 mb-8">Hook Requirements</h2>
          <div className="border border-white/[0.05] bg-white/[0.01] p-6 lg:p-8">
            <div className="space-y-4">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5 bg-accent/[0.04]">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#5BE30C" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed font-normal">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
