#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(process.cwd(), 'skills');

const dirsToCreate = [
  '',
  'design',
  'patterns',
  'recipes',
  'examples',
  'examples/basic-dashboard',
  'examples/ai-powered-todo',
  'examples/real-time-chat',
  'examples/media-player',
  'prompts'
];

const filesToCreate = {
  'README.md': `# use-web-kit Skills Kit

Welcome to your locally scaffolded \`use-web-kit\` skills kit. This knowledge base serves as the architectural standard for leveraging zero-cost abstractions in your React 19 application.

## Why a Skills Kit?
We believe that libraries shouldn't just be black boxes. A framework is only as good as the architecture built on top of it. \`use-web-kit\` provides the primitives (global singletons, RAF batching, thread pooling), and this \`skills/\` folder gives you the exact patterns to wield them effectively.

## Directory Structure

*   **Core Concepts**: \`architecture.md\`, \`performance.md\`, \`glossary.md\`
*   **AI Integration**: \`ai-agents.md\`, \`prompts/agent-prompts.md\`
*   **Design & UX**: \`design/guidelines.md\`
*   **Implementation**: \`patterns/\` (theory), \`recipes/\` (copy-paste solutions), \`examples/\` (full components)

Please use this directory as a living document to align your engineering team and your AI assistants.
`,

  'architecture.md': `# Architecture Guidelines

The architectural philosophy of \`use-web-kit\` is rooted in **Zero-Cost Abstractions** and **O(1) Overhead**.

## 1. The Singleton Mandate
Never instantiate complex browser APIs (\`IntersectionObserver\`, \`MutationObserver\`, \`Worker\`) per component. This scales linearly (O(n)) and causes severe memory bloat.
*   **Pattern:** Rely on the global singletons provided by the toolkit (e.g., \`useSmartIntersection\`). 
*   **Result:** Observing 1,000 DOM nodes incurs the same memory footprint as observing 1.

## 2. RAF Batching over Immediate Execution
Event listeners like \`scroll\` and \`resize\` fire at the display's refresh rate (up to 120Hz). State updates triggered by these events must be coalesced.
*   **Pattern:** \`use-web-kit\` hooks automatically batch state updates using \`requestAnimationFrame\`. If writing custom hooks, never call \`setState\` synchronously within high-frequency event handlers.

## 3. Hydration Guarantees
In Next.js or other SSR environments, reading \`window.localStorage\` during initial render causes hydration mismatches.
*   **Pattern:** Use \`useDebouncedStorage\` which utilizes \`useSyncExternalStore\` to guarantee perfect matching between server HTML and the initial client pass.

## 4. React 19 Native Ref Cleanups
Avoid \`useEffect\` + \`useRef\` combinations for DOM observation. 
*   **Pattern:** Return the cleanup function directly from the ref callback. This eliminates race conditions during strict mode mounting/unmounting.
`,

  'performance.md': `# Performance Standards

This document outlines the strict performance boundaries your components must adhere to when using \`use-web-kit\`.

## 1. Frame Budget
You have ~16ms (at 60fps) to calculate state changes, reconcile the Virtual DOM, and paint. 
*   Offload any synchronous computation taking longer than 5ms to a Web Worker via \`useWorkerPool\`.
*   Defer non-critical state updates (e.g., sending analytics, updating non-visible caches) using \`useIdleQueue\`.

## 2. Cross-Tab Communication
Do not use \`localStorage\` events for rapid cross-tab communication. It forces JSON serialization/deserialization and disk I/O.
*   Use \`useBroadcastState\` for O(1), memory-only state synchronization across tabs via the \`BroadcastChannel\` API.

## 3. Layout Shifts & Visibility
Delay rendering heavy, below-the-fold components until they approach the viewport.
*   Use \`useSmartIntersection\` with a \`rootMargin\` of \`'200px'\` to begin fetching data or rendering components *just before* they become visible to the user.
`,

  'ai-agents.md': `# System Instructions for AI Assistants

If you are an AI coding assistant (e.g., Cursor, GitHub Copilot, Antigravity) generating code in this repository, you **MUST** adhere strictly to the following rules:

1.  **Ref Cleanups:** When interacting with DOM nodes, use callback refs that return cleanup functions. Do NOT use \`useEffect\` for observing refs.
2.  **Zero \`new\` Observers:** Do NOT write \`new IntersectionObserver(...)\` inside React components. You must import and use \`useSmartIntersection\` from \`use-web-kit\`.
3.  **State Bypassing:** When isolated components need to share state without triggering a top-down re-render cascade, use \`useBroadcastState\`, NOT React Context.
4.  **Heavy Math:** Wrap any heavy mapping/reducing of large arrays in \`useWorkerPool\`.

Review \`prompts/agent-prompts.md\` for specific system prompt injections.
`,

  'glossary.md': `# Glossary of Terms

*   **O(1) Overhead:** An algorithm or pattern whose performance or memory usage remains constant regardless of the number of items processed (e.g., observing 1 node vs 1000 nodes using a Singleton).
*   **RAF Batching:** Wrapping state updates in \`requestAnimationFrame\` to ensure they only execute once per visual frame, avoiding dropped frames.
*   **Ref Cleanup:** A React 19 feature where a callback ref returns a function that React automatically calls when the component unmounts.
*   **Hydration Mismatch:** When the HTML generated by the server differs from the HTML expected by the client on the first render, causing React to discard the server HTML.
*   **Zero-Cost Abstraction:** An abstraction that imposes no additional runtime overhead compared to writing the lower-level code by hand.
`,

  'design/guidelines.md': `# Design & UX Performance

High-performance engineering must translate to high-performance UX.

## 1. Perceived Performance
Users should never see a frozen UI, even during heavy processing.
*   **Action:** When a user clicks "Process Data", immediately update the UI to a loading state, and offload the actual processing using \`useWorkerPool\`.

## 2. Adaptive Experiences
The UI should degrade gracefully on poor connections.
*   **Action:** Use \`useNetworkStatus\`. If \`effectiveType === '3g'\` or lower, disable auto-playing videos, reduce image resolutions, and increase the interval of \`useAdaptivePolling\`.

## 3. Tab Visibility
Do not waste user battery and CPU when they aren't looking at your app.
*   **Action:** Hook into \`usePageLifecycle\`. When the state is \`hidden\` or \`frozen\`, pause all polling, timers, and WebGL animations.
`,

  'patterns/singleton.md': `# Pattern: Singleton Observer

## The Problem
Using \`new IntersectionObserver()\` inside a component means a list of 500 items creates 500 observers. This causes massive memory spikes and garbage collection pauses.

## The Solution
\`use-web-kit\` uses a module-level global observer.

\`\`\`ts
// Conceptual representation of what useSmartIntersection does internally:
const observerMap = new Map<Element, Function>();
let globalObserver: IntersectionObserver | null = null;

export function observe(element: Element, callback: Function) {
  if (!globalObserver) {
    globalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => observerMap.get(entry.target)?.(entry));
    });
  }
  
  observerMap.set(element, callback);
  globalObserver.observe(element);
  
  return () => {
    observerMap.delete(element);
    globalObserver.unobserve(element);
    if (observerMap.size === 0) {
      globalObserver.disconnect();
      globalObserver = null;
    }
  };
}
\`\`\`
`,

  'patterns/pipeline.md': `# Pattern: Event Pipelines

## The Problem
Complex async actions (e.g., submitting a form, uploading an image, saving to DB) often result in deeply nested \`try/catch\` blocks and messy rollback logic.

## The Solution
Use \`useEventPipeline\` to compose async functions into a linear, readable pipeline with automatic retries.

\`\`\`tsx
import { useEventPipeline } from 'use-web-kit';

const { execute, isExecuting } = useEventPipeline([
  validatePayload,      // Stage 1
  uploadImageToS3,      // Stage 2 (async)
  saveRecordToDatabase, // Stage 3 (async)
]);

// Usage
<button onClick={() => execute(data)} disabled={isExecuting}>
  Submit
</button>
\`\`\`
`,

  'patterns/offloading.md': `# Pattern: Main Thread Offloading

## The Problem
JavaScript is single-threaded. Running a 50ms array sort will freeze the UI, preventing clicks or scrolling.

## The Solution
\`useWorkerPool\` instantiates a pool of Web Workers based on the user's CPU cores, utilizing them in a round-robin fashion.

\`\`\`tsx
import { useWorkerPool } from 'use-web-kit';

// This function is serialized and executed entirely off the main thread.
const heavySort = (arr: number[]) => [...arr].sort((a,b) => a - b);

export function DataGrid({ rows }) {
  const { run } = useWorkerPool(heavySort);
  const [sorted, setSorted] = useState([]);

  useEffect(() => {
    run(rows).then(setSorted);
  }, [rows]);
  
  // UI never freezes!
}
\`\`\`
`,

  'patterns/composition.md': `# Pattern: Hook Composition

The true power of \`use-web-kit\` comes from combining its hooks.

## Example: Adaptive Off-Thread Polling
Combine network status, visibility tracking, and worker pools.

\`\`\`tsx
const { isOnline, effectiveType } = useNetworkStatus();
const { run } = useWorkerPool(processData);

useAdaptivePolling(async () => {
  const data = await fetchData();
  const processed = await run(data); // Off-thread
  updateUI(processed);
}, {
  interval: effectiveType === '4g' ? 5000 : 15000,
  visibilityInterval: 60000, // Slow down drastically when tab is hidden
});
\`\`\`
`,

  'recipes/infinite-scroll.md': `# Recipe: Infinite Scroll

A highly optimized infinite scroll utilizing the global observer.

\`\`\`tsx
import { useSmartIntersection } from 'use-web-kit';

export function InfiniteScrollTrigger({ hasMore, onLoadMore }) {
  const { ref } = useSmartIntersection({
    onIntersect: (entry) => {
      if (entry.isIntersecting && hasMore) {
        onLoadMore();
      }
    },
    rootMargin: '400px', // Fetch well before the user reaches the bottom
  });

  if (!hasMore) return null;

  return (
    <div ref={ref} className="h-10 w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
\`\`\`
`,

  'recipes/lazy-image.md': `# Recipe: Lazy Image Loader

Renders a tiny placeholder until the image is 100px from entering the viewport.

\`\`\`tsx
import { useState } from 'react';
import { useSmartIntersection } from 'use-web-kit';

export function LazyImage({ src, alt, width, height }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref } = useSmartIntersection({
    onIntersect: (entry) => {
      if (entry.isIntersecting) setIsLoaded(true);
    },
    rootMargin: '100px',
  });

  return (
    <div ref={ref} style={{ width, height, backgroundColor: '#222' }}>
      {isLoaded && (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover animate-fade-in" 
        />
      )}
    </div>
  );
}
\`\`\`
`,

  'recipes/auto-save-form.md': `# Recipe: Auto-Save Form

Combines local storage persistence with deferred API saves using \`useIdleQueue\`.

\`\`\`tsx
import { useDebouncedStorage, useIdleQueue } from 'use-web-kit';

export function AutoSaveForm() {
  // 1. SSR-safe, debounced local persistence
  const [draft, setDraft] = useDebouncedStorage('form_draft', '');
  const { enqueue } = useIdleQueue();

  const handleChange = (val: string) => {
    setDraft(val);
    
    // 2. Defer the expensive API call to browser idle time
    enqueue(() => {
      fetch('/api/autosave', { method: 'POST', body: JSON.stringify({ draft: val }) });
    });
  };

  return <textarea value={draft} onChange={e => handleChange(e.target.value)} />;
}
\`\`\`
`,

  'recipes/keyboard-navigation.md': `# Recipe: Keyboard Navigation

Although \`use-web-kit\` focuses on performance, combining React 19 refs with global state allows powerful keyboard navigation tracking without Context re-renders.

*(Coming soon: \`useHotkeys\` will be added to the toolkit natively.)*
`,

  'recipes/dashboard-optimization.md': `# Recipe: Dashboard Optimization

When a dashboard mounts, don't fetch data for charts that are below the fold.

\`\`\`tsx
import { useSmartIntersection } from 'use-web-kit';

function LazyChart({ fetchUrl }) {
  const [data, setData] = useState(null);
  const { ref } = useSmartIntersection({
    onIntersect: (entry) => {
      // Only fetch once when it becomes visible
      if (entry.isIntersecting && !data) {
        fetch(fetchUrl).then(r => r.json()).then(setData);
      }
    }
  });

  return (
    <div ref={ref} className="h-64 w-full bg-zinc-900 rounded-xl">
      {data ? <Chart data={data} /> : <Skeleton />}
    </div>
  );
}
\`\`\`
`,

  'examples/basic-dashboard/README.md': `# Basic Dashboard Example

Combines \`useNetworkStatus\` and \`useSmartIntersection\` to create a resilient data dashboard.

*(Code examples reside in the respective \`.tsx\` files when initialized in a real project).*
`,

  'examples/ai-powered-todo/README.md': `# AI-Powered Todo App

Showcases \`useWorkerPool\` offloading fuzzy-search and AI-classification logic off the main thread while maintaining a fluid UI.
`,

  'examples/real-time-chat/README.md': `# Real-Time Chat

Uses \`useBroadcastState\` to synchronize unread message counts instantly across all open browser tabs without WebSockets.
`,

  'examples/media-player/README.md': `# Custom Media Player

Leverages \`useMediaControls\` to build a fully custom video player UI without manual event listener management.
`,

  'prompts/agent-prompts.md': `# AI Agent Prompts

Copy and paste these snippets into the "Custom Instructions" or ".cursorrules" file for your AI assistants.

## Base Prompt
\`\`\`text
You are an expert React 19 engineer using the \`use-web-kit\` library.
CRITICAL RULES:
1. Never use useEffect for DOM observation. Use callback refs that return a cleanup function.
2. Never instantiate new IntersectionObserver or WebWorker instances. Import \`useSmartIntersection\` and \`useWorkerPool\` from 'use-web-kit'.
3. For local storage, always use \`useDebouncedStorage\` to prevent SSR hydration errors.
4. If a calculation involves array mapping/reducing over 1000 items, wrap it in \`useWorkerPool\`.
\`\`\`
`
};

function init() {
  console.log(' Initializing use-web-kit Skills Kit...');

  dirsToCreate.forEach(dir => {
    const dirPath = path.join(SKILLS_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });

  let createdCount = 0;
  for (const [filename, content] of Object.entries(filesToCreate)) {
    const filePath = path.join(SKILLS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      createdCount++;
    }
  }

  console.log(' Successfully scaffolded ' + createdCount + ' skills files in ./skills/');
  console.log(' Read skills/README.md to get started.');
}

init();
