export const metadata = {
  title: "useStorage — use-web-kit",
  description:
    "Persistent state backed by localStorage or sessionStorage with type-safe serialization.",
};

const signatureCode = `function useStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    storage?: 'local' | 'session';  // default: 'local'
    serializer?: {
      read: (raw: string) => T;
      write: (value: T) => string;
    };
  }
): [T, SetValue<T>, RemoveValue]

type SetValue<T> = (value: T | ((prev: T) => T)) => void;
type RemoveValue = () => void;`;

const usageCode = `import { useStorage } from 'use-web-kit';

function Settings() {
  const [theme, setTheme, removeTheme] = useStorage('theme', 'dark');
  const [fontSize, setFontSize] = useStorage('fontSize', 14);

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
        Theme: {theme}
      </button>
      <button onClick={() => setFontSize(s => s + 1)}>
        Font: {fontSize}px
      </button>
      <button onClick={removeTheme}>Reset theme</button>
    </div>
  );
}`;

const sessionCode = `// Use sessionStorage instead of localStorage
const [token, setToken] = useStorage('auth_token', null, {
  storage: 'session',
});`;

const returns = [
  {
    name: "[0]",
    type: "T",
    description: "The current stored value, or initialValue if not yet set.",
  },
  {
    name: "[1]",
    type: "SetValue<T>",
    description:
      "Setter — accepts a value or updater function. Persists immediately.",
  },
  {
    name: "[2]",
    type: "RemoveValue",
    description: "Remove the key from storage and reset to initialValue.",
  },
];

export default function UseStoragePage() {
  return (
    <>
      <div className="mb-12">
        <span
          className="inline-flex items-center text-[10px] font-medium px-3 py-1 rounded-full mb-4"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
          }}
        >
          State Management
        </span>
        <h1
          className="text-4xl font-bold text-white mb-5 tracking-tight"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          useStorage
        </h1>
        <p className="text-[#9ca3af] text-[0.95rem] leading-[1.8]">
          Persistent React state backed by localStorage or sessionStorage.
          Values are serialized automatically, and changes sync across tabs.
        </p>
      </div>

      <div className="section-divider mb-12" />

      <div className="mb-16">
        <h2
          className="text-xs font-semibold text-[#f0f0f0] mb-6 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Signature
        </h2>
        <div className="glass-card rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-6">
          <pre className="text-[13px] leading-relaxed text-[#a3ff12] overflow-x-auto whitespace-pre">
            {signatureCode}
          </pre>
        </div>
      </div>

      <div className="mb-16">
        <h2
          className="text-xs font-semibold text-[#f0f0f0] mb-6 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Basic Usage
        </h2>
        <div className="glass-card rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-6">
          <pre className="text-[13px] leading-relaxed text-[#9ca3af] overflow-x-auto whitespace-pre">
            {usageCode}
          </pre>
        </div>
      </div>

      <div className="mb-16">
        <h2
          className="text-xs font-semibold text-[#f0f0f0] mb-6 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Returns
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {returns.map((ret, i) => (
            <div key={i} className="glass-card p-6 rounded-xl border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#a3ff12] font-mono text-sm">{ret.name}</span>
                <span className="text-[11px] text-[#9ca3af] px-2 py-0.5 rounded border border-[rgba(163,255,18,0.2)] bg-[rgba(163,255,18,0.03)] font-mono">{ret.type}</span>
              </div>
              <p className="text-sm text-[#9ca3af] leading-relaxed">{ret.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
