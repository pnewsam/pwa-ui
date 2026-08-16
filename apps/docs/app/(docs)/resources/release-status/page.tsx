import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Release status", "Current PWA UI maturity, validation status, known limits, and stability policy.", "/resources/release-status");

export default function ReleaseStatusPage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Resources <span>/</span> Release status</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Resource</p>
        <h1>Release status</h1>
        <p><span className="docs-status">v0.1 public beta</span></p>
        <p>PWA UI is publicly available for evaluation and early use. Beta APIs may still change in response to field testing; the project does not yet make a stable compatibility guarantee.</p>
      </header>

      <section className="docs-section">
        <h2>Ready now</h2>
        <ul>
          <li>Copy-pasteable registry payloads and direct installation URLs.</li>
          <li>Automated type, unit, registry, build, and browser checks.</li>
          <li>Documented component relationships, browser degradation, accessibility responsibilities, and device QA.</li>
          <li>Canonical production documentation at pwaui.com.</li>
          <li>Public source, issues, contribution guidance, and private vulnerability reporting on GitHub.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Before stable</h2>
        <ul>
          <li>Complete and record the physical iOS and Android device matrix.</li>
          <li>Run clean-install tests in representative Next.js and Vite applications.</li>
          <li>Freeze the first stable API only after beta usage confirms the current names and composition.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Versioning</h2>
        <p>Beta releases may refine component APIs when field testing reveals a clearer or safer contract. Stable releases will follow semantic versioning, with migration notes for intentional breaking changes.</p>
      </section>
    </article>
  );
}
