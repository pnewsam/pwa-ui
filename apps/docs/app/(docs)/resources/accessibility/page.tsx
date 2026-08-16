import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Accessibility", "Accessibility behavior, adopter responsibilities, and validation expectations for PWA UI.", "/resources/accessibility");

export default function AccessibilityPage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Resources <span>/</span> Accessibility</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Resource</p>
        <h1>Accessibility</h1>
        <p>PWA UI supplies accessible structure and interaction defaults, but accessibility remains a property of the finished application—not a component-library certification.</p>
      </header>

      <section className="docs-section">
        <h2>Built into the components</h2>
        <ul>
          <li>Base UI provides focus trapping, Escape dismissal, focus restoration, and dialog semantics for overlays.</li>
          <li>Navigation components expose landmarks, active-page state, visible labels, and accessible badge text.</li>
          <li>Touch-first actions use at least 44 × 44 CSS-pixel targets.</li>
          <li>Motion is suppressed when the user requests reduced motion.</li>
          <li>The documentation viewport preserves browser zoom.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Your responsibilities</h2>
        <ul>
          <li>Give every sheet and dialog a meaningful title, with a description when it adds context.</li>
          <li>Use specific names for icon-only controls and informative badges.</li>
          <li>Verify focus order, contrast, zoom, text reflow, and error handling after applying your theme and content.</li>
          <li>Test with keyboard-only navigation and the screen readers used by your audience.</li>
          <li>Do not disable important actions solely because the browser reports an offline state.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Validation policy</h2>
        <p>Automated semantic checks run in the browser suite. Manual keyboard, VoiceOver, TalkBack, zoom, contrast, and reduced-motion checks remain release requirements because automated scans cannot establish conformance on their own.</p>
      </section>
    </article>
  );
}
