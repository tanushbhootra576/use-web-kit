import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy — use-web-kit",
  description: "Privacy policy for the use-web-kit documentation website.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Privacy Policy"
      description="How we handle data on the use-web-kit documentation site. We believe in transparency and minimal data collection."
      lastUpdated="May 2026"
    >
      <h2>1. Overview</h2>
      <p>
        The <strong>use-web-kit</strong> documentation site is committed to protecting your privacy. This policy describes
        what information we collect, how we use it, and the choices you have.
      </p>

      <h2>2. Data We Collect</h2>
      <h3>Analytics</h3>
      <p>
        We may collect anonymous usage analytics to improve the documentation experience. This includes:
      </p>
      <ul>
        <li>Page views and navigation patterns</li>
        <li>Browser type and version</li>
        <li>Device type and screen resolution</li>
        <li>Referring URL</li>
      </ul>
      <p>
        No personally identifiable information (PII) is collected through analytics.
      </p>

      <h3>Cookies</h3>
      <p>
        This site uses minimal cookies for essential functionality only. We do not use tracking cookies
        or third-party advertising cookies.
      </p>

      <h2>3. NPM Package</h2>
      <p>
        The <code>use-web-kit</code> npm package itself collects <strong>zero data</strong>. It contains no telemetry,
        no analytics, and no network calls. It is a pure client-side library with zero external dependencies.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>
        The documentation site may use the following third-party services:
      </p>
      <ul>
        <li><strong>Vercel</strong> — Hosting and deployment</li>
        <li><strong>GitHub</strong> — Source code hosting and issue tracking</li>
        <li><strong>npm</strong> — Package distribution</li>
      </ul>
      <p>
        Each service has its own privacy policy that governs their data handling.
      </p>

      <h2>5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request information about data we may have collected</li>
        <li>Request deletion of any data associated with your usage</li>
        <li>Opt out of analytics by using a browser extension or ad blocker</li>
      </ul>

      <h2>6. Contact</h2>
      <p>
        For privacy-related inquiries, please open an issue on our{" "}
        <a href="https://github.com/tanushbhootra576/use-web-kit" target="_blank" rel="noreferrer">GitHub repository</a>.
      </p>
    </LegalPageLayout>
  );
}
