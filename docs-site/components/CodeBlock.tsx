"use client";
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ code, filename, language }: { code: string, filename?: string, language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="overflow-hidden border border-white/[0.06] bg-[#08080b] my-4 font-mono text-sm group">
      {/* Header */}
      {(filename || true) && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
          <span className="meta-text !text-[9px] text-zinc-600">
            {filename || language || 'code'}
          </span>
          <button
            onClick={handleCopy}
            className="text-zinc-600 hover:text-white transition-colors p-1 rounded-sm hover:bg-white/[0.05]"
            aria-label="Copy code"
          >
            {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
          </button>
        </div>
      )}

      {/* Code with line numbers */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-3 py-0 text-right select-none text-zinc-800 text-[11px] w-10 align-top leading-[1.75] border-r border-white/[0.04]">
                  {i + 1}
                </td>
                <td className="px-4 py-0 text-zinc-300 text-[13px] leading-[1.75] whitespace-pre">
                  {line || '\u00A0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
