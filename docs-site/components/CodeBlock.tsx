"use client";
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlight, themes } from 'prism-react-renderer';

export default function CodeBlock({ code, filename, language = 'tsx' }: { code: string, filename?: string, language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden border border-white/[0.06] rounded-md bg-[#08080b] my-4 font-mono text-sm shadow-sm group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05]">
        <span className="meta-text !text-[9px] text-zinc-500 uppercase tracking-wider">
          {filename || language}
        </span>
        <button
          onClick={handleCopy}
          className="relative text-zinc-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/[0.05] flex items-center justify-center w-7 h-7"
          aria-label="Copy code"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check size={13} className="text-accent" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Copy size={13} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <Highlight
          theme={themes.vsDark}
          code={code.trim()}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className + " py-4"} style={{ ...style, backgroundColor: 'transparent' }}>
              <table className="w-full border-collapse">
                <tbody>
                  {tokens.map((line, i) => {
                    const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
                    return (
                      <tr key={lineKey as any} {...lineProps} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-0 text-right select-none text-zinc-700 text-[11px] w-10 align-top leading-[1.75] border-r border-white/[0.04]">
                          {i + 1}
                        </td>
                        <td className="px-4 py-0 text-[13px] leading-[1.75] whitespace-pre">
                          {line.map((token, key) => {
                            const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key });
                            return <span key={tokenKey as any} {...tokenProps} />;
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
