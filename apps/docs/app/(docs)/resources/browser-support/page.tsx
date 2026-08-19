import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Browser support", "The PWA UI beta browser policy, feature degradations, and current device-verification status.", "/resources/browser-support");

const rows = [
  ["Core layout and navigation", "Targeted", "Targeted", "Targeted", "Targeted"],
  ["BottomSheet and dialogs", "Targeted", "Targeted", "Targeted", "Targeted"],
  ["Visual viewport handling", "Full", "Full", "Full", "Fallback"],
  ["Native install prompt", "Available", "Available", "Manual flow", "Unavailable"],
  ["Standalone display mode", "Full", "Full", "Full", "Varies"],
] as const;

export default function BrowserSupportPage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Resources <span>/</span> Browser support</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Resource</p>
        <h1>Browser support</h1>
        <p>PWA UI targets current stable Chromium, Safari, and Firefox releases. Platform-specific capabilities degrade honestly when a browser does not expose them.</p>
      </header>

      <section className="docs-section">
        <h2>Beta support matrix</h2>
        <div className="docs-callout"><strong>Verification status:</strong> automated Chromium and WebKit coverage is active. Physical iOS and Android checks remain required before the first stable release.</div>
        <div className="docs-table-wrap" tabIndex={0} aria-label="Browser support matrix; scroll horizontally to see every browser">
          <table className="docs-table">
            <thead><tr><th>Capability</th><th>Desktop Chromium</th><th>Android Chrome</th><th>iOS Safari</th><th>Firefox</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="docs-section">
        <h2>What degradation means</h2>
        <ul>
          <li>Safe-area values resolve to zero on surfaces without display cutouts.</li>
          <li>Viewport-aware layouts fall back to the layout viewport when Visual Viewport is unavailable.</li>
          <li>The install hook reports unavailable when the browser does not offer a programmatic prompt. iOS requires product-specific Share → Add to Home Screen instructions.</li>
          <li>Network status is a browser hint; applications must still handle failed requests.</li>
        </ul>
      </section>

      <section className="docs-section" id="application-viewport">
        <h2>Application viewport</h2>
        <p>Start from this viewport, which enables safe-area insets on edge-to-edge and installed surfaces:</p>
        <pre className="docs-callout"><code>{'<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'}</code></pre>
        <p>The remaining choice is Android&apos;s <code>interactive-widget</code> policy, and it is a genuine tradeoff rather than a recommendation we can make for you. PWA UI derives keyboard height from the visual viewport shrinking, so the policy decides whether the keyboard hooks can see the keyboard at all.</p>

        <h3><code>overlays-content</code> — stable layout, no keyboard detection</h3>
        <p>The keyboard is drawn over the page and neither viewport resizes. Fixed chrome never moves, which is the most predictable choice for layouts that do not react to the keyboard. In exchange, <code>useVisualViewport</code> reports <code>keyboardHeight: 0</code>, <code>--pwa-keyboard-height</code> stays at 0, <code>data-pwa-keyboard-open</code> is never set, and <code>KeyboardAvoidingView</code> and <code>AppShell.Footer keyboardBehavior</code> do nothing on Android.</p>

        <h3><code>resizes-content</code> or the default <code>resizes-visual</code> — keyboard detection works</h3>
        <p>The viewport shrinks when the keyboard opens, so <code>useVisualViewport</code>, <code>KeyboardAvoidingView</code>, and keyboard-aware chrome respond as documented. With <code>resizes-content</code> the layout viewport resizes too, so fixed chrome reflows with it; with the default <code>resizes-visual</code> only the visual viewport changes.</p>
        <pre className="docs-callout"><code>{'<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">'}</code></pre>

        <p>iOS Safari ignores <code>interactive-widget</code> entirely and always shrinks the visual viewport, so the keyboard hooks work there whichever policy you set. Choose the policy on your Android layout&apos;s behalf, then verify it against your own fixed chrome and forms on a real device.</p>
      </section>
    </article>
  );
}
