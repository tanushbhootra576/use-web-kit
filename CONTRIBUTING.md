# Contributing to use-web-kit

Thank you for your interest in contributing. We are building a high-performance, zero-cost abstraction toolkit for React 19.

## Core Principles

Before submitting a Pull Request, please ensure your changes adhere to these architectural tenets:
1. **Zero Dependencies**: Do not add external NPM packages to `dependencies`. If a feature requires an external library, it belongs in user-land, not here.
2. **O(1) Overhead**: Never instantiate complex browser APIs (e.g., `IntersectionObserver`, `MutationObserver`, `Worker`) directly inside a hook. Utilize the global singleton pattern established in the codebase.
3. **React 19 Native**: Utilize direct ref callback cleanup patterns. Do not use `useEffect` for DOM node observation.
4. **Hydration Safety**: All hooks interacting with the DOM/BOM must be safe to execute in a Server-Side Rendering (SSR) context. Use `useSyncExternalStore` for external mutable state.

## Local Development

### Setup

\`\`\`bash
git clone https://github.com/tanushbhootra576/use-web-kit.git
cd use-web-kit
npm install
\`\`\`

### Testing

All hooks must have comprehensive unit tests verifying memory safety and React strict-mode compatibility.

\`\`\`bash
npm run test
npm run test:watch
\`\`\`

### Building

We use `tsup` for compiling the library into dual-published ESM and CJS formats.

\`\`\`bash
npm run build
\`\`\`

### Linting & Type Checking

Ensure there are no TypeScript errors or ESLint warnings.

\`\`\`bash
npm run lint
\`\`\`

## Submitting a Pull Request

1. Create a feature branch from `main`.
2. Ensure you have added tests covering the new functionality or bug fix.
3. Run `npm run lint` and `npm run test` to verify your changes.
4. Open a Pull Request with a clear description of the problem solved and the architectural approach taken.
5. If changing public APIs, ensure you update the relevant TypeScript definitions and JSDoc comments.

We review PRs focusing heavily on memory profiles and performance implications. Thank you for helping make `use-web-kit` better!
