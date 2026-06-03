import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Security — use-web-kit",
  description: "Security policy and vulnerability reporting for use-web-kit.",
};

const securityPrinciples = [
  { title: "Zero Dependencies", desc: "No transitive supply chain risk. Every line of code is authored and audited in-house." },
  { title: "No Network Calls", desc: "The library makes zero external requests. All operations are local to the browser." },
  { title: "No eval() or Function()", desc: "Worker pool uses Blob URLs with strict Content-Security-Policy compatibility." },
  { title: "Automated Auditing", desc: "CI pipeline runs npm audit and static analysis on every commit." },
];

export default function SecurityPage() {
  return (
    <LegalPageLayout
      label="Security"
      title="Security Policy"
      description="Our approach to security, vulnerability disclosure, and the architectural decisions that minimize attack surface."
      lastUpdated="May 2026"
    >
      <section className="not-prose mb-16">
        <h2 className="mono-label !text-[9px] text-zinc-500 mb-8">Security Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityPrinciples.map((p, i) => (
            <div key={i} className="border border-white/[0.05] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                <h3 className="text-white font-semibold text-sm tracking-tight">{p.title}</h3>
              </div>
              <p className="text-zinc-500 text-[13px] leading-relaxed font-normal">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <h2>Vulnerability Reporting</h2>
      <p>
        If you discover a security vulnerability, please report it responsibly:
      </p>
      <ul>
        <li><strong>Do not</strong> open a public GitHub issue for security vulnerabilities</li>
        <li>Email the maintainers directly or use GitHub&apos;s private vulnerability reporting feature</li>
        <li>Include a detailed description of the vulnerability and steps to reproduce</li>
        <li>Allow reasonable time for a fix before public disclosure</li>
      </ul>

      <h2>Supported Versions</h2>
      <p>
        Security updates are provided for the latest major version only. We strongly recommend keeping
        your installation up to date.
      </p>

      <div className="not-prose mt-10 border border-white/[0.05] bg-white/[0.01] p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="pb-3 meta-text !text-[9px] text-zinc-500">Version</th>
              <th className="pb-3 meta-text !text-[9px] text-zinc-500">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-white/[0.03]">
              <td className="py-3 font-mono text-white text-[13px]">1.x</td>
              <td className="py-3"><span className="text-accent text-[12px] font-medium">✓ Supported</span></td>
            </tr>
            <tr>
              <td className="py-3 font-mono text-zinc-500 text-[13px]">&lt; 1.0</td>
              <td className="py-3"><span className="text-zinc-600 text-[12px]">End of life</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Dependency Policy</h2>
      <p>
        <strong>use-web-kit has zero runtime dependencies.</strong> This is a core architectural decision,
        not an accident. By eliminating the dependency tree entirely, we eliminate the most common vector
        for supply-chain attacks in the npm ecosystem.
      </p>
    </LegalPageLayout>
  );
}
