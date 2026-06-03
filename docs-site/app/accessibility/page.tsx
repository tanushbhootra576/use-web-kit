import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Accessibility — use-web-kit",
  description: "Accessibility commitment and guidelines for use-web-kit.",
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      label="Compliance"
      title="Accessibility"
      description="Our commitment to building inclusive, accessible hooks and documentation that work for everyone."
      lastUpdated="May 2026"
    >
      <h2>Commitment</h2>
      <p>
        <strong>use-web-kit</strong> is committed to ensuring accessibility for all users. We strive to meet
        WCAG 2.1 Level AA standards across both the library itself and this documentation site.
      </p>

      <h2>Library Accessibility</h2>
      <p>The hooks in use-web-kit are designed with accessibility in mind:</p>
      <ul>
        <li><strong>useMediaControls</strong> — Returns state values that can be used to build fully accessible custom media players with proper ARIA labels</li>
        <li><strong>useSmartIntersection</strong> — Supports <code>lowPriority</code> mode to prevent scroll jank, improving the experience for users with vestibular disorders</li>
        <li><strong>usePageLifecycle</strong> — Enables focus-aware behavior for screen reader compatibility</li>
        <li><strong>useNetworkStatus</strong> — Enables graceful degradation for users on limited connections</li>
      </ul>

      <h2>Documentation Site</h2>
      <p>This documentation site implements the following accessibility features:</p>
      <ul>
        <li>Semantic HTML5 elements throughout</li>
        <li>Proper heading hierarchy (h1 → h2 → h3)</li>
        <li>Keyboard-navigable interface</li>
        <li>Sufficient color contrast ratios (WCAG AA)</li>
        <li>Focus indicators on all interactive elements</li>
        <li>Screen reader-friendly code blocks</li>
        <li>Responsive design for all viewport sizes</li>
      </ul>

      <h2>Known Limitations</h2>
      <p>We are aware of and actively working on:</p>
      <ul>
        <li>Enhanced ARIA labels for the sidebar navigation</li>
        <li>Skip-to-content links for keyboard users</li>
        <li>Reduced-motion preferences for animations</li>
      </ul>

      <h2>Reporting Issues</h2>
      <p>
        If you encounter accessibility barriers, please open an issue on our{" "}
        <a href="https://github.com/tanushbhootra576/use-web-kit" target="_blank" rel="noreferrer">GitHub repository</a>{" "}
        with the label <code>accessibility</code>. We take accessibility issues seriously and prioritize them in our backlog.
      </p>
    </LegalPageLayout>
  );
}
