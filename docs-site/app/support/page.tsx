import LegalPageLayout from "@/components/LegalPageLayout";
import Link from "next/link";

export const metadata = {
  title: "Support — use-web-kit",
  description: "Get help with use-web-kit.",
};

const channels = [
  {
    title: "GitHub Issues",
    desc: "For bug reports and feature requests. Please search existing issues before creating a new one.",
    href: "https://github.com/tanushbhootra576/use-web-kit/issues",
    action: "Open an Issue",
    external: true,
  },
  {
    title: "GitHub Discussions",
    desc: "For questions, ideas, and general conversation with the community.",
    href: "https://github.com/tanushbhootra576/use-web-kit/discussions",
    action: "Join Discussion",
    external: true,
  },
  {
    title: "Documentation",
    desc: "Comprehensive guides, API reference, and examples to help you get started.",
    href: "/docs",
    action: "Read Docs",
    external: false,
  },
];

export default function SupportPage() {
  return (
    <LegalPageLayout
      label="Help"
      title="Support"
      description="Get help with use-web-kit through our community channels and documentation."
      lastUpdated="May 2026"
    >
      <div className="not-prose space-y-4 mb-16">
        {channels.map((channel) => (
          <div key={channel.title} className="border border-white/[0.05] bg-white/[0.01] p-6 hover:border-white/[0.08] transition-colors group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold text-base mb-1.5 tracking-tight">{channel.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{channel.desc}</p>
              </div>
              {channel.external ? (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[11px] font-mono uppercase tracking-wider text-accent border border-accent/20 bg-accent/[0.05] px-4 py-2 hover:bg-accent/[0.1] transition-colors font-semibold inline-flex items-center gap-1.5"
                >
                  {channel.action}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={channel.href}
                  className="shrink-0 text-[11px] font-mono uppercase tracking-wider text-accent border border-accent/20 bg-accent/[0.05] px-4 py-2 hover:bg-accent/[0.1] transition-colors font-semibold"
                >
                  {channel.action}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2>Bug Reports</h2>
      <p>When filing a bug report, please include:</p>
      <ul>
        <li>The hook name and version of use-web-kit</li>
        <li>React and Next.js version (if applicable)</li>
        <li>A minimal reproduction (CodeSandbox or repository)</li>
        <li>Expected vs actual behavior</li>
        <li>Browser and OS information</li>
      </ul>

      <h2>Response Times</h2>
      <p>
        This is an open-source project maintained by volunteers. We aim to respond to critical bugs
        within 48 hours and feature requests within one week. Please be patient and respectful in
        all interactions.
      </p>
    </LegalPageLayout>
  );
}
