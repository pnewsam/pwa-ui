import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Platform limitations", "The platform behavior PWA UI cannot change: iOS gaps, Android viewport policy, connectivity hints, safe areas, and pre-1.0 dependencies.", "/resources/platform-limitations");

export default function PlatformLimitationsPage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Resources <span>/</span> Platform limitations</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Resource</p>
        <h1>Platform limitations</h1>
        <p>PWA UI is a web component layer. Some behavior belongs to the browser, the operating system, or a dependency, and no amount of component code can recover it. Each component page repeats the caveats that apply to it; this page collects them in one place.</p>
      </header>

      <section className="docs-section" id="ios">
        <h2>iOS constraints</h2>
        <ul>
          <li>iOS Safari never fires <code>beforeinstallprompt</code>. There is no programmatic install flow, so an iOS build must render product-specific Share → Add to Home Screen guidance instead.</li>
          <li>An installed iOS PWA can have its storage evicted and its background work constrained, so a waiting service-worker update may not apply until the next foreground launch.</li>
          <li>iOS auto-scrolls the focused field when the software keyboard opens. That can compound with <code>KeyboardAvoidingView</code> using <code>behavior=&quot;position&quot;</code>; verify the <code>padding</code> and <code>height</code> behaviors on a real device.</li>
          <li>The web platform cannot use native iOS action-sheet chrome or system haptics. <code>ActionSheet</code> is a faithful web presentation, not the system control.</li>
          <li>The home-indicator area in an installed PWA is handled with the footer safe-area inset, not by the OS.</li>
        </ul>
      </section>

      <section className="docs-section" id="android-viewport">
        <h2>Android keyboard &amp; viewport policy</h2>
        <p>On Android, what the software keyboard does to the viewport is decided by the page&apos;s <code>interactive-widget</code> policy, and PWA UI derives keyboard height from the visual viewport shrinking.</p>
        <div className="docs-callout docs-callout--warning" role="note">
          With <code>interactive-widget=overlays-content</code> the visual viewport does not shrink, so <code>--pwa-keyboard-height</code> stays at 0, <code>data-pwa-keyboard-open</code> is never set, and <code>KeyboardAvoidingView</code> does not move. Choose <code>resizes-content</code> or the default <code>resizes-visual</code> when your layout depends on keyboard detection.
        </div>
        <p>iOS Safari ignores <code>interactive-widget</code> entirely and always reports a shrinking visual viewport, so the keyboard hooks work there regardless of the policy you set. See <a className="docs-inline-link" href="/resources/browser-support">Browser support</a> for the full tradeoff.</p>
      </section>

      <section className="docs-section" id="connectivity">
        <h2>Connectivity signal</h2>
        <ul>
          <li><code>navigator.onLine</code> is a hint, not proof of connectivity. It can report online behind a captive portal with no working internet, and it can report offline while requests still succeed.</li>
          <li>Never gate a critical action on the reported status. Always handle failed requests directly and treat <code>OfflineBanner</code> as context for the user rather than a guard.</li>
        </ul>
      </section>

      <section className="docs-section" id="safe-area">
        <h2>Safe-area availability</h2>
        <ul>
          <li><code>env(safe-area-inset-*)</code> only reports non-zero values when the page sets <code>viewport-fit=cover</code> on a device with display cutouts, or on an installed or otherwise edge-to-edge surface.</li>
          <li>Everywhere else — including an ordinary desktop or mobile browser tab — these values resolve to 0 by design. <code>SafeArea</code> and the <code>AppShell</code> chrome regions degrade to no padding rather than guessing at device models.</li>
          <li><code>--pwa-viewport-height</code> tracks the visual viewport and shrinks when the keyboard opens. Anchor fixed chrome with the safe-area padding these components apply rather than with <code>100vh</code>.</li>
        </ul>
      </section>

      <section className="docs-section" id="base-ui-drawer">
        <h2>Base UI Drawer dependency</h2>
        <ul>
          <li>Gesture physics, snap points, dismissal, and focus management for <code>BottomSheet</code>, <code>ActionSheet</code>, and the mobile presentation of <code>ResponsiveDialog</code> come from Base UI&apos;s Drawer, which is pre-1.0.</li>
          <li>Pin your <code>@base-ui/react</code> version so a minor release cannot change drag or snap behavior underneath your application.</li>
          <li>The drag handle is decorative and is not operable by assistive technology. Provide a visible Close, or rely on Escape and backdrop dismissal, for users who cannot perform the gesture.</li>
        </ul>
      </section>

      <section className="docs-section" id="display-mode">
        <h2>Display-mode detection</h2>
        <ul>
          <li>Display mode and breakpoint checks are media queries resolved on the client. <code>useDisplayMode</code> reports <code>unknown</code> during server rendering, and the responsive presentation assumes the desktop case until hydration.</li>
          <li>Crossing the <code>ResponsiveDialog</code> breakpoint while the overlay is open swaps implementations and remounts the content subtree, resetting uncontrolled state and focus. Lift state you must preserve above <code>Content</code>.</li>
          <li>Standalone detection varies by browser: iOS reports it through a non-standard <code>navigator.standalone</code> flag, and Firefox&apos;s installed-app support is limited.</li>
        </ul>
      </section>
    </article>
  );
}
