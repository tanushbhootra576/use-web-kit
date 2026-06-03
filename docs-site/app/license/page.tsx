import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "License — use-web-kit",
  description: "MIT License for use-web-kit.",
};

export default function LicensePage() {
  return (
    <LegalPageLayout
      label="Open Source"
      title="License"
      description="use-web-kit is released under the MIT License, one of the most permissive open source licenses available."
      lastUpdated="March 2026"
    >
      <div className="not-prose">
        <div className="border border-white/[0.06] bg-[#08080b] p-6 lg:p-8 font-mono text-[13px] text-zinc-400 leading-[1.9] whitespace-pre-wrap">
{`MIT License

Copyright (c) 2026 Tanush Bhootra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </div>
      </div>

      <div className="mt-12">
        <h2>What this means</h2>
        <p>The MIT License allows you to:</p>
        <ul>
          <li>Use the library in commercial projects</li>
          <li>Modify the source code</li>
          <li>Distribute copies</li>
          <li>Include it in proprietary software</li>
          <li>Sublicense to others</li>
        </ul>
        <p>
          The only requirement is that the license text and copyright notice are included in any
          copies or substantial portions of the software.
        </p>
      </div>
    </LegalPageLayout>
  );
}
