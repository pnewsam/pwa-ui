/* eslint-disable @next/next/no-html-link-for-pages -- Hosted vinext navigation requires native document requests. */

import { ArrowRight, Check, Copy, Layers3, Smartphone } from "lucide-react";

import { CodeBlock } from "@/components/example-panel";
import { componentDocs } from "@/lib/component-docs";

export default function IntroductionPage() {
  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Introduction</div>
      <header className="docs-page-header">
        <p className="docs-kicker">Introduction</p>
        <h1>Build mobile web apps<br />that feel installed.</h1>
        <p>PWA UI is a source-owned React component layer for the interaction and layout problems unique to mobile-first web applications.</p>
      </header>

      <section className="docs-section" id="why">
        <h2>Why PWA UI?</h2>
        <p>Accessible primitives already solve dialogs, focus management, and keyboard interaction. PWA UI composes those foundations with safe areas, dynamic viewports, mobile navigation chrome, software keyboard behavior, and touch-first presentation.</p>
        <div className="docs-principles">
          <div><Smartphone size={18} /><strong>Mobile-first</strong><span>Designed from the phone interaction outward.</span></div>
          <div><Copy size={18} /><strong>Source-owned</strong><span>Installed through a shadcn registry and edited locally.</span></div>
          <div><Layers3 size={18} /><strong>Composable</strong><span>Works beside shadcn, Base UI, and your router.</span></div>
        </div>
      </section>

      <section className="docs-section" id="installation">
        <h2>Installation</h2>
        <p>Start with the shared platform tokens, then install only the components required by your screen.</p>
        <CodeBlock code="pnpm dlx shadcn@latest add <registry>/pwa-base" language="bash" />
        <CodeBlock code="pnpm dlx shadcn@latest add <registry>/app-shell\npnpm dlx shadcn@latest add <registry>/bottom-sheet\npnpm dlx shadcn@latest add <registry>/tab-bar" language="bash" />
      </section>

      <section className="docs-section" id="components">
        <h2>Components</h2>
        <p>The MVP is deliberately small: eight primitives that form a coherent mobile application layer.</p>
        <div className="docs-component-list">
          {componentDocs.map((component) => (
            <a href={`/components/${component.slug}`} key={component.slug}>
              <span className="docs-list-icon"><Check size={14} /></span>
              <span><strong>{component.name}</strong><small>{component.summary}</small></span>
              <ArrowRight size={15} />
            </a>
          ))}
        </div>
      </section>

      <nav className="docs-pagination" aria-label="Documentation pagination">
        <span />
        <a href="/components/app-shell"><small>Next</small><strong>AppShell →</strong></a>
      </nav>
    </article>
  );
}
