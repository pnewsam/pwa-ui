/* eslint-disable @next/next/no-html-link-for-pages -- Hosted vinext navigation requires native document requests. */

import { CodeBlock } from "@/components/code-block";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
  "App layout",
  "Compose PWAProvider, AppShell, NavigationBar, TabBar, and SafeArea into a predictable full-screen application frame.",
  "/guides/app-layout",
);

const composition = `PWAProvider
└── Application root containment
    └── AppShell
        ├── AppShell.Header
        │   └── NavigationBar
        ├── AppShell.Main
        │   └── Routed screen content
        └── AppShell.Footer
            └── TabBar`;

const install = `pnpm dlx shadcn@latest add \\
  @pwa-ui/pwa-provider \\
  @pwa-ui/app-shell \\
  @pwa-ui/navigation-bar \\
  @pwa-ui/tab-bar \\
  @pwa-ui/safe-area`;

const viewport = `import type { Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}`;

const nextRoot = `import { PWAProvider } from "@/components/ui/pwa-provider"
import "@/styles/pwa.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-pwa-app-root>
      <body>
        <PWAProvider>
          <div data-pwa-app-mount>{children}</div>
        </PWAProvider>
      </body>
    </html>
  )
}`;

const viteRoot = `<!-- index.html -->
<html lang="en" data-pwa-app-root>
  <body>
    <div id="root" data-pwa-app-mount></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

const shellExample = `import Link from "next/link"
import { Home, Search, User } from "lucide-react"

import { AppShell } from "@/components/ui/app-shell"
import { NavigationBar } from "@/components/ui/navigation-bar"
import { TabBar } from "@/components/ui/tab-bar"

export function ApplicationLayout({ children }) {
  return (
    <AppShell>
      <AppShell.Header>
        <NavigationBar>
          <NavigationBar.Title>Field Notes</NavigationBar.Title>
        </NavigationBar>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer keyboardBehavior="hide">
        <TabBar>
          <TabBar.Item render={<Link href="/" />} icon={<Home />} label="Home" active />
          <TabBar.Item render={<Link href="/search" />} icon={<Search />} label="Search" />
          <TabBar.Item render={<Link href="/profile" />} icon={<User />} label="Profile" />
        </TabBar>
      </AppShell.Footer>
    </AppShell>
  )
}`;

const responsibilities = [
  ["PWAProvider", "Viewport and keyboard measurements", "Document scrolling or visual chrome"],
  ["Application root", "Containing document scroll for full-screen apps", "Screen regions or navigation"],
  ["AppShell", "One visual-viewport frame and region placement", "Navigation appearance or routing"],
  ["AppShell.Main", "The application’s vertical scrolling", "Persistent header or footer chrome"],
  ["NavigationBar", "Top navigation content and actions", "Safe-area placement or viewport height"],
  ["TabBar", "Primary destinations and active state", "Footer placement or document scrolling"],
  ["SafeArea", "Insets explicitly requested by custom layouts", "Insets AppShell already applies"],
] as const;

export default function AppLayoutGuidePage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Guides <span>/</span> App layout</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Guide</p>
        <h1>App layout</h1>
        <p>Build a full-screen application frame with persistent navigation, one predictable scroll region, and safe-area behavior that is applied exactly once.</p>
      </header>

      <section className="docs-section" id="mental-model">
        <h2>Mental model</h2>
        <p>Each layer owns one concern. The provider measures the viewport, the application root contains document scrolling, AppShell divides the viewport, and the navigation components render inside its placement regions.</p>
        <CodeBlock code={composition} language="text" label="Composition" />
      </section>

      <section className="docs-section" id="installation">
        <h2>Installation</h2>
        <p>Install the shared provider and the layout components together. The registry dependencies also install the PWA UI base stylesheet; import that stylesheet once as shown below.</p>
        <CodeBlock code={install} language="bash" label="Terminal" />
      </section>

      <section className="docs-section" id="responsibilities">
        <h2>Responsibilities</h2>
        <div className="docs-table-wrap" tabIndex={0} aria-label="App layout component responsibilities; scroll horizontally to see every column">
          <table className="docs-table">
            <thead><tr><th>Layer</th><th>Owns</th><th>Does not own</th></tr></thead>
            <tbody>{responsibilities.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="docs-section" id="root-containment">
        <h2>Contain the application root</h2>
        <p>A full-screen application should not let the browser document become a second scroll container. Import the PWA UI base stylesheet, add <code>data-pwa-app-root</code> to the document, and mark the element that directly contains your application.</p>
        <div className="docs-callout"><strong>Opt in only for application surfaces.</strong> Leave these attributes off documentation, marketing, and embedded pages that should use normal document scrolling.</div>
        <h3>Next.js</h3>
        <CodeBlock code={nextRoot} language="tsx" label="app/layout.tsx" />
        <h3>Vite or React</h3>
        <CodeBlock code={viteRoot} language="html" label="index.html" />
      </section>

      <section className="docs-section" id="viewport-metadata">
        <h2>Enable safe-area insets</h2>
        <p>Use <code>viewport-fit=cover</code> so installed and edge-to-edge browser surfaces expose their safe-area environment variables. In Next.js, export the viewport configuration from your root layout.</p>
        <CodeBlock code={viewport} language="tsx" label="app/layout.tsx" />
        <p>For a static HTML entry, add <code>viewport-fit=cover</code> to the viewport meta tag instead.</p>
      </section>

      <section className="docs-section" id="shell-composition">
        <h2>Compose the shell</h2>
        <p>Place visual navigation inside the shell regions. Keep routed screen content inside Main so navigation remains anchored while content changes and scrolls.</p>
        <CodeBlock code={shellExample} language="tsx" label="application-layout.tsx" />
      </section>

      <section className="docs-section" id="safe-areas">
        <h2>Safe-area ownership</h2>
        <ul>
          <li><code>AppShell.Header</code> applies the top inset. Do not add another top SafeArea around NavigationBar.</li>
          <li><code>AppShell.Footer</code> applies the bottom inset. Do not add another bottom SafeArea around TabBar.</li>
          <li>Use <code>SafeArea</code> for standalone custom chrome or for explicit left and right protection in landscape layouts.</li>
          <li>Keep ordinary content spacing inside a child element when it must be additive to a safe-area inset.</li>
        </ul>
      </section>

      <section className="docs-section" id="routing">
        <h2>Routing and persistence</h2>
        <p>Mount PWAProvider and the application shell in a persistent router layout, then render the route outlet inside <code>AppShell.Main</code>. Pass the active route to TabBar and screen-specific titles or actions to NavigationBar without remounting the frame.</p>
      </section>

      <section className="docs-section" id="common-mistakes">
        <h2>Common mistakes</h2>
        <ul>
          <li>Allowing both the document and <code>AppShell.Main</code> to scroll.</li>
          <li>Placing NavigationBar or TabBar beside AppShell instead of inside its Header or Footer.</li>
          <li>Applying the same safe-area edge in both AppShell and SafeArea.</li>
          <li>Mounting a separate AppShell for every route when the navigation chrome should persist.</li>
          <li>Using <code>100vh</code> wrappers outside the shell that can exceed the usable mobile visual viewport.</li>
        </ul>
      </section>

      <nav className="docs-pagination" aria-label="Documentation pagination">
        <a href="/"><small>Previous</small><strong>← Introduction</strong></a>
        <a href="/components/pwa-provider"><small>Next</small><strong>PWAProvider →</strong></a>
      </nav>
    </article>
  );
}
