# Migration Guide

Migrating to `use-web-kit` is incremental and non-breaking. You can replace standard hooks component-by-component.

## 1. Local Storage

**Before (Standard React):**
\`\`\`tsx
const [val, setVal] = useState(
  typeof window !== 'undefined' ? localStorage.getItem('key') : ''
);

useEffect(() => {
  localStorage.setItem('key', val);
}, [val]);
\`\`\`
*Issues: Hydration mismatches, no cross-tab sync, triggers re-renders on every keystroke if attached to an input.*

**After (use-web-kit):**
\`\`\`tsx
const [val, setVal] = useDebouncedStorage('key', '');
\`\`\`
*Benefits: 100% SSR safe, cross-tab synced, debounced writes.*

## 2. Global State

**Before (React Context):**
\`\`\`tsx
<CartContext.Provider value={cart}>
  <Navbar />
  <ProductList />
</CartContext.Provider>
\`\`\`
*Issues: Every time `cart` updates, `Navbar` and `ProductList` and all their children re-render, even if they don't consume the value directly.*

**After (use-web-kit):**
\`\`\`tsx
// Inside Navbar.tsx
const [cart] = useBroadcastState('cart', 0);

// Inside Product.tsx
const [, setCart] = useBroadcastState('cart', 0);
\`\`\`
*Benefits: O(1) state sharing. Updates only re-render the components actively consuming the hook. Works perfectly across multiple browser tabs via `BroadcastChannel`.*
