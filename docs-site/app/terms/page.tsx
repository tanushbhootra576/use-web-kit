import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Terms of Use — use-web-kit",
  description: "Terms of use for the use-web-kit library and documentation.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Terms of Use"
      description="Terms governing your use of the use-web-kit library, documentation, and associated services."
      lastUpdated="May 2026"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using <strong>use-web-kit</strong> (the &ldquo;Library&rdquo;), its documentation, or any related services,
        you agree to be bound by these Terms of Use. If you do not agree, do not use the Library.
      </p>

      <h2>2. License Grant</h2>
      <p>
        The Library is released under the <strong>MIT License</strong>. You are free to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Library, subject to the conditions of the MIT License.
      </p>

      <h2>3. Permitted Use</h2>
      <p>You may use the Library for any lawful purpose, including:</p>
      <ul>
        <li>Commercial and non-commercial applications</li>
        <li>Open-source and proprietary projects</li>
        <li>Educational and research purposes</li>
        <li>Internal tooling and infrastructure</li>
      </ul>

      <h2>4. Disclaimer of Warranties</h2>
      <p>
        The Library is provided &ldquo;AS IS&rdquo; without warranty of any kind, express or implied, including but not limited to
        the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the
        authors be liable for any claim, damages, or other liability arising from the use of the Library.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall the maintainers, contributors, or copyright holders be liable for any direct, indirect, incidental,
        special, exemplary, or consequential damages arising out of the use or inability to use the Library.
      </p>

      <h2>6. Contributions</h2>
      <p>
        By submitting contributions (pull requests, issues, or other materials), you grant the project maintainers a perpetual,
        worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your contributions under the
        terms of the MIT License.
      </p>

      <h2>7. Modifications</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes will be reflected in the &ldquo;Last Updated&rdquo; date
        at the top of this page. Continued use of the Library constitutes acceptance of modified Terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        For questions about these Terms, please open an issue on our{" "}
        <a href="https://github.com/tanushbhootra576/use-web-kit" target="_blank" rel="noreferrer">GitHub repository</a>.
      </p>
    </LegalPageLayout>
  );
}
