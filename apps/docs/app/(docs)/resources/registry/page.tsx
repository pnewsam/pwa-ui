import type { Metadata } from "next";
import { ArrowUpRight, Braces, PackageOpen } from "lucide-react";

import { CodeBlock } from "@/components/example-panel";

export const metadata: Metadata = {
  title: "Registry source — PWA UI",
  description: "Install and inspect the published PWA UI shadcn registry.",
};

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
        <h2>Install a component</h2>
        <p>Use the public site URL as the registry origin and replace the final filename with the item you need.</p>
        <CodeBlock code="pnpm dlx shadcn@latest add https://pwa-ui-docs.paul666490.chatgpt.site/r/app-shell.json" language="bash" />
      </section>

      <section className="docs-section">
        <h2>Available items</h2>
        <p>AppShell, SafeArea, BottomSheet, ResponsiveDialog, ActionSheet, NavigationBar, TabBar, KeyboardAvoidingView, and the shared hooks are published independently.</p>
      </section>

      <nav className="docs-pagination" aria-label="Documentation pagination">
        <a href="/resources/device-qa"><small>Previous resource</small><strong>← Device QA</strong></a>
        <span />
      </nav>
    </article>
  );
}
