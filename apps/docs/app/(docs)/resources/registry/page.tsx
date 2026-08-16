import { ArrowUpRight, Braces, PackageOpen } from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Registry source", "Install and inspect the published PWA UI shadcn registry.", "/resources/registry");

export default function RegistryResourcePage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Resources <span>/</span> Registry source</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Resource</p>
        <h1>Registry source</h1>
        <p>The published registry is generated from this project and served with the documentation site. Inspect the index or install individual primitives into your own codebase.</p>
      </header>

      <section className="docs-section">
        <h2>Published files</h2>
        <p>These endpoints are part of the live site, so they stay aligned with the component examples documented here.</p>
        <div className="docs-resource-links">
          <a href="/r/registry.json">
            <Braces size={18} />
            <span><strong>Registry index</strong><small>Browse all published registry items.</small></span>
            <ArrowUpRight size={15} />
          </a>
          <a href="/r/pwa-base.json">
            <PackageOpen size={18} />
            <span><strong>Base configuration</strong><small>Shared tokens, viewport variables, and dependencies.</small></span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      <section className="docs-section">
        <h2>Configure the namespace</h2>
        <p>Add the registry to <code>components.json</code>. This keeps install commands short and makes the source explicit.</p>
        <CodeBlock code={'{\n  "registries": {\n    "@pwa-ui": "https://pwaui.com/r/{name}.json"\n  }\n}'} language="json" />
        <CodeBlock code="pnpm dlx shadcn@latest add @pwa-ui/pwa-provider @pwa-ui/app-shell" language="bash" />
        <p>Direct URLs remain supported when you do not want to configure a namespace.</p>
        <CodeBlock code="pnpm dlx shadcn@latest add https://pwaui.com/r/app-shell.json" language="bash" />
      </section>

      <section className="docs-section">
        <h2>Import the base styles</h2>
        <p>Components that use PWA layout tokens install the shared stylesheet as a registry dependency. Import it once from your application&apos;s global entry point.</p>
        <CodeBlock code={'import "@/styles/pwa.css"'} language="tsx" />
      </section>

      <section className="docs-section">
        <h2>Available items</h2>
        <p>PWAProvider, AppShell, SafeArea, BottomSheet, ResponsiveDialog, ActionSheet, NavigationBar, TabBar, KeyboardAvoidingView, lifecycle feedback components, and the shared hooks are published independently.</p>
      </section>

      <nav className="docs-pagination" aria-label="Documentation pagination">
        <a href="/resources/device-qa"><small>Previous resource</small><strong>← Device QA</strong></a>
        <span />
      </nav>
    </article>
  );
}
