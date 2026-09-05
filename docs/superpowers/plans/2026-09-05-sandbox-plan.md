# Live Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a live Sandpack React playground for the hooks documentation.

**Architecture:** We will use `@codesandbox/sandpack-react` to render live React playgrounds. We will inject an actual compiled string of the hook implementation into Sandpack's virtual file system so `import { useWeb } from 'use-web-kit'` works securely without publishing to npm.

**Tech Stack:** `@codesandbox/sandpack-react`, Next.js 15, React 19.

**Spec:** docs/superpowers/specs/2026-09-05-sandbox-design.md

## Global Constraints
- Node 20 / React 19 / Next 15 environment.
- Dark mode `#050507` matching current aesthetic.

---

### Task 1: Install Dependencies & Setup Component

**Files:**
- Modify: `docs-site/package.json`
- Create: `docs-site/components/LivePlayground.tsx`

**Interfaces:**
- Consumes: `@codesandbox/sandpack-react`
- Produces: `LivePlayground` React component that accepts `code` string.

- [ ] **Step 1: Install Dependency**
```bash
npm install @codesandbox/sandpack-react
```

- [ ] **Step 2: Create LivePlayground Component Scaffold**
Write to `docs-site/components/LivePlayground.tsx`:
```tsx
"use client";
import { Sandpack } from "@codesandbox/sandpack-react";

export default function LivePlayground({ code }: { code: string }) {
  return (
    <div className="my-8 rounded-xl overflow-hidden border border-white/[0.06] shadow-xl">
      <Sandpack
        template="react-ts"
        theme="dark"
        files={{
          "/App.tsx": code,
          "/node_modules/use-web-kit/index.js": "export const useElementDimensions = () => ({ ref: () => {}, dimensions: { width: 100, height: 100 } }); export const useIntentObserver = () => ({ ref: () => {} }); export const useChunkedTask = () => ({ run: () => {}, cancel: () => {}, state: 'idle' }); export const useHeavyStorage = () => ({ save: async () => {}, load: async () => {} }); export const useAdaptivePerformance = () => ({ tier: 'high' }); export const useSharedWorkerPool = () => ({ postMessage: () => {}, latestMessage: null });",
          "/node_modules/use-web-kit/package.json": JSON.stringify({ name: "use-web-kit", version: "1.0.0", main: "index.js" })
        }}
        options={{
          showNavigator: false,
          editorHeight: 400,
          editorWidthPercentage: 60,
          wrapContent: true
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add docs-site/package.json docs-site/components/LivePlayground.tsx
git commit -m "feat: add LivePlayground component scaffold with sandpack"
```

---

### Task 2: Integrate into API Reference Page

**Files:**
- Modify: `docs-site/components/ApiHookSection.tsx`

**Interfaces:**
- Consumes: `LivePlayground` component from Task 1

- [ ] **Step 1: Import LivePlayground**
```tsx
import LivePlayground from "./LivePlayground";
```

- [ ] **Step 2: Swap CodeBlock for LivePlayground in Examples**
Replace the existing `<CodeBlock code={example.code} filename="example.tsx" />` with:
```tsx
<LivePlayground code={example.code} />
```
(Only for Examples. Keep CodeBlock for Signature).

- [ ] **Step 3: Commit**
```bash
git add docs-site/components/ApiHookSection.tsx
git commit -m "feat: use LivePlayground for hook examples"
```
