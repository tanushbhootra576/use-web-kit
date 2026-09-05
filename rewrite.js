
const fs = require("fs");

let data = fs.readFileSync("docs-site/lib/hooks-data.ts", "utf-8");

const replacements = {
  "useSmartIntersection": `import React from "react";\nimport { useSmartIntersection } from "use-web-kit";\n\nexport default function LazyImage() {\n  const { ref, isIntersecting } = useSmartIntersection({ lowPriority: true });\n  return (\n    <div style={{ padding: "20px" }}>\n      <p>Scroll down...</p>\n      <div style={{ height: "100vh" }} />\n      <div ref={ref} style={{ background: isIntersecting ? "#5BE30C" : "#333", padding: "20px", color: "black" }}>\n        {isIntersecting ? "Image Loaded!" : "Waiting..."}\n      </div>\n    </div>\n  );\n}`,
  "useElementDimensions": `import React from "react";\nimport { useElementDimensions } from "use-web-kit";\n\nexport default function ResponsiveWidget() {\n  const { ref, dimensions } = useElementDimensions();\n  return (\n    <div style={{ padding: "20px" }}>\n      <div ref={ref} style={{ resize: "both", overflow: "auto", border: "2px solid #5BE30C", padding: "20px" }}>\n        Drag bottom right corner to resize!<br/>\n        Width: {dimensions?.width ?? 0}px<br/>\n        Height: {dimensions?.height ?? 0}px\n      </div>\n    </div>\n  );\n}`,
  "useIntentObserver": `import React from "react";\nimport { useIntentObserver } from "use-web-kit";\n\nexport default function PreloadLink() {\n  const { ref, isIntented } = useIntentObserver({ intentDelay: 200 });\n  return (\n    <div style={{ padding: "20px" }}>\n      <button ref={ref} style={{ background: isIntented ? "#5BE30C" : "#333", color: "white", padding: "10px 20px" }}>\n        {isIntented ? "Preloading Data..." : "Hover over me!"}\n      </button>\n    </div>\n  );\n}`,
  "useChunkedTask": `import React from "react";\nimport { useChunkedTask } from "use-web-kit";\n\nexport default function LargeList() {\n  const { run, state } = useChunkedTask();\n  return (\n    <div style={{ padding: "20px", color: "white" }}>\n      <button onClick={() => run()} style={{ background: "#5BE30C", color: "black", padding: "10px" }}>Start 1M Loop (No Freeze!)</button>\n      <p>Status: {state}</p>\n    </div>\n  );\n}`,
  "useHeavyStorage": `import React from "react";\nimport { useHeavyStorage } from "use-web-kit";\n\nexport default function VideoCache() {\n  const { save, load } = useHeavyStorage();\n  return (\n    <div style={{ padding: "20px", color: "white" }}>\n      <button onClick={() => save("video", "dummy_blob")} style={{ background: "#5BE30C", color: "black", padding: "10px" }}>Save GB Blob to OPFS</button>\n      <p>OPFS storage does not block the UI thread.</p>\n    </div>\n  );\n}`,
  "useAdaptivePerformance": `import React from "react";\nimport { useAdaptivePerformance } from "use-web-kit";\n\nexport default function Degradation() {\n  const { tier } = useAdaptivePerformance();\n  return (\n    <div style={{ padding: "20px", color: "white" }}>\n      <p>Device Tier: <strong style={{ color: "#5BE30C" }}>{tier}</strong></p>\n      {tier === "low" ? <p>Loading static images...</p> : <p>Loading heavy WebGL animations!</p>}\n    </div>\n  );\n}`,
  "useSharedWorkerPool": `import React from "react";\nimport { useSharedWorkerPool } from "use-web-kit";\n\nexport default function Analytics() {\n  const { postMessage } = useSharedWorkerPool();\n  return (\n    <div style={{ padding: "20px", color: "white" }}>\n      <button onClick={() => postMessage({ type: "TRACK" })} style={{ background: "#5BE30C", color: "black", padding: "10px" }}>Track Event (Background)</button>\n    </div>\n  );\n}`
};

// Instead of regex, we will just patch the examples inside HOOKS_DATA dynamically during load OR replace it in the file.
// Wait, an easier way is to map the string manually using AST or simple regex block replacement.

for (const [id, code] of Object.entries(replacements)) {
  const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?examples:\\s*\\[\\s*\\{[\\s\\S]*?code:\\s*\`)((?:[^\\\`]|\\\`)*)(\`[\\s\\S]*?\\}\\s*\\])`, "m");
  data = data.replace(regex, (match, p1, p2, p3) => {
    return p1 + code + p3;
  });
}

fs.writeFileSync("docs-site/lib/hooks-data.ts", data, "utf-8");
console.log("Rewrote hooks-data.ts!");
