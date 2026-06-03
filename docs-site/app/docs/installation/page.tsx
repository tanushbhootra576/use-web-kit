import InstallTerminal from "@/components/InstallTerminal";

export default function InstallationPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">Installation</h1>
      <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
        Integrate the infrastructure-grade React 19 performance toolkit into your project. Use your preferred package manager to get started.
      </p>

      <div className="mb-12">
        <InstallTerminal />
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-4">Requirements</h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>React 19 or later</li>
            <li>TypeScript 5.0 or later (recommended)</li>
            <li>Node.js 18 or later</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-4">Manual Setup</h2>
          <p className="text-zinc-400 mb-4">
            If you are not using a standard package manager or need to configure a monorepo, ensure the peer dependencies are properly hoisted:
          </p>
          <div className="p-4 rounded-lg bg-[#0a0a0c] border border-white/10 font-mono text-sm text-zinc-300">
            "peerDependencies": {"{"}
            <br />
            &nbsp;&nbsp;"react": "^19.0.0"
            <br />
            {"}"}
          </div>
        </section>
      </div>
    </div>
  );
}
