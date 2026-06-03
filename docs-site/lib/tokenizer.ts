// Lightweight TSX/TypeScript syntax tokenizer.
// Zero external dependencies — pure regex-based tokenization.

export interface Token {
  type:
    | "keyword"
    | "string"
    | "comment"
    | "hook"
    | "type"
    | "number"
    | "operator"
    | "jsx-tag"
    | "property"
    | "plain";
  value: string;
}

const PATTERNS: Array<{ type: Token["type"]; re: RegExp }> = [
  // Single-line comments
  { type: "comment", re: /^\/\/[^\n]*/ },
  // Multi-line comments
  { type: "comment", re: /^\/\*[\s\S]*?\*\// },
  // Template literals
  { type: "string", re: /^`(?:[^`\\]|\\.)*`/ },
  // Double-quoted strings
  { type: "string", re: /^"(?:[^"\\]|\\.)*"/ },
  // Single-quoted strings
  { type: "string", re: /^'(?:[^'\\]|\\.)*'/ },
  // JSX closing tags
  { type: "jsx-tag", re: /^<\/[A-Za-z][A-Za-z0-9.]*>/ },
  // JSX self-closing or opening tags
  { type: "jsx-tag", re: /^<[A-Z][A-Za-z0-9.]*(?:\s[^>]*)?\s*\/?>/ },
  // Numbers
  { type: "number", re: /^-?\d+(?:\.\d+)?(?:_\d+)*/ },
  // Keywords
  {
    type: "keyword",
    re: /^\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|implements|new|this|typeof|instanceof|async|await|type|interface|enum|default|null|undefined|true|false|void|throws|try|catch|finally|switch|case|break|continue|in|of|as)\b/,
  },
  // React hooks (use-prefixed identifiers) — must come before "property"
  { type: "hook", re: /\buse[A-Z][A-Za-z0-9]*\b/ },
  // TypeScript built-in types
  {
    type: "type",
    re: /^\b(string|number|boolean|object|any|unknown|never|Promise|Array|Record|Partial|Required|Pick|Omit|Readonly|Map|Set|Element|HTMLElement|Event|SyntheticEvent|FormData)\b/,
  },
  // Object property keys / identifiers with colon
  { type: "property", re: /^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*:)/ },
  // Plain identifiers
  { type: "plain", re: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
  // Operators & punctuation (single chars)
  { type: "operator", re: /^[=+\-*/<>!&|?:;,()[\]{}.]/ },
  // Whitespace (plain)
  { type: "plain", re: /^\s+/ },
  // Fallback — any single character
  { type: "plain", re: /^./ },
];

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    let matched = false;

    for (const { type, re } of PATTERNS) {
      const match = re.exec(remaining);
      if (match) {
        tokens.push({ type, value: match[0] });
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Should never happen due to fallback, but guard against infinite loops.
      tokens.push({ type: "plain", value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return tokens;
}

export const TOKEN_COLORS: Record<Token["type"], string> = {
  keyword: "#a3ff12",
  string: "#22d3ee",
  comment: "rgba(156,163,175,0.5)",
  hook: "#38bdf8",
  type: "#c084fc",
  number: "#fb923c",
  operator: "rgba(240,240,240,0.6)",
  "jsx-tag": "#4ade80",
  property: "#e2e8f0",
  plain: "rgba(240,240,240,0.85)",
};
