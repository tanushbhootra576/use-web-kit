# Live Sandbox Design Spec

## Architecture
- **Engine**: \@codesandbox/sandpack-react\
- **Component**: A new \<LivePlayground />\ component in \docs-site/components/\.
- **Integration**: Replaces the static \<CodeBlock>\ in \ApiHookSection.tsx\ for the "Examples" section.

## Data Flow & Dependency Injection
- Examples in \hooks-data.ts\ will be injected into Sandpack's \/App.tsx\.
- To make \import { useSomething } from 'use-web-kit'\ work without npm publishing, we will inject a hidden virtual file into Sandpack at \/node_modules/use-web-kit/index.js\.
- Initially, this hidden file will contain mocked/stubbed versions of the hooks that simulate their behavior for the docs, preventing the need to bundle the entire real library into the browser.

## UI Design
- Dark mode Sandpack theme matching the site's #050507 background.
- Split-pane layout: Editor on the left, live React preview on the right.

## Error Handling & Testing
- Fallback to static \<CodeBlock>\ if Sandpack fails to load or JS is disabled.
- Ensure the injected hidden file doesn't crash the Sandpack bundler.
