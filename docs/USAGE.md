# Usage Patterns

## Hydration Safety in Next.js

When using Next.js App Router, ensure you place the `'use client'` directive at the top of the file when consuming `use-web-kit` hooks that interact with the Browser Object Model (BOM).

Hooks like `useDebouncedStorage` internally utilize `useSyncExternalStore`. This guarantees that the initial server HTML perfectly matches the client hydration output without requiring you to write defensive `typeof window !== 'undefined'` checks.

## Hook Composition

`use-web-kit` hooks are designed to be highly composable. 

**Example: Deferring heavy work until visible**
You can combine `useSmartIntersection` with `useWorkerPool` to offload work to a Web Worker only when the component scrolls into the viewport.

\`\`\`tsx
import { useWorkerPool, useSmartIntersection } from 'use-web-kit';

export function LazyChart() {
  const { run } = useWorkerPool(processDataOffThread);
  
  const { ref } = useSmartIntersection({
    onIntersect: (entry) => {
      if (entry.isIntersecting) {
        run(rawData).then(renderChart);
      }
    }
  });

  return <div ref={ref}>Loading Chart...</div>;
}
\`\`\`

## React 19 Ref Cleanups

All DOM-observing hooks return a callback ref. You must attach this directly to your JSX element.

\`\`\`tsx
// Correct
const { ref } = useSmartIntersection({ onIntersect });
return <div ref={ref} />;

// Incorrect (Will cause memory leaks)
const divRef = useRef(null);
const { ref } = useSmartIntersection({ onIntersect });
useEffect(() => {
  ref(divRef.current);
}, []);
return <div ref={divRef} />;
\`\`\`
