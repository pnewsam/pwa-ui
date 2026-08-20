import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/code-block";
import { ComponentInstallation } from "@/components/component-installation";
import { ExamplePanel } from "@/components/example-panel";
import { componentDocs, getComponentDoc } from "@/lib/component-docs";
import { createPageMetadata } from "@/lib/site-metadata";

const layoutComponentSlugs = new Set(["pwa-provider", "app-shell", "safe-area", "pull-to-refresh", "stack-navigator", "navigation-bar", "tab-bar"]);

function renderCaveat(caveat: string) {
  return caveat.split(/`([^`]+)`/).map((part, index) => index % 2 === 1 ? <code key={index}>{part}</code> : part);
}

export function generateStaticParams() {
  return componentDocs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentDoc(slug);
  return component ? createPageMetadata(component.name, component.summary, `/components/${component.slug}`) : {};
}

export default async function ComponentPage({ params }: PageProps<"/components/[slug]">) {
  const { slug } = await params;
  const component = getComponentDoc(slug);
  if (!component) notFound();

  const index = componentDocs.findIndex((item) => item.slug === component.slug);
  const previous = componentDocs[index - 1];
  const next = componentDocs[index + 1];

  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Components <span>/</span> {component.name}</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Component</p>
        <h1>{component.name}</h1>
        <p>{component.description}</p>
      </header>

      <section className="docs-section" id="preview">
        <h2>Preview</h2>
        <ExamplePanel slug={component.slug} code={component.usage} />
      </section>

      <section className="docs-section" id="installation">
        <h2>Installation</h2>
        <ComponentInstallation slug={component.slug} command={component.install} />
      </section>

      <section className="docs-section" id="usage">
        <h2>Usage</h2>
        <CodeBlock code={component.usage} language="tsx" />
      </section>

      <section className="docs-section" id="anatomy">
        <h2>Anatomy</h2>
        <div className="docs-anatomy">{component.anatomy.map((part) => <code key={part}>{part}</code>)}</div>
      </section>

      {layoutComponentSlugs.has(component.slug) ? (
        <section className="docs-section" id="composition">
          <h2>Composition</h2>
          <p>See how PWAProvider, AppShell, SafeArea, NavigationBar, and TabBar divide viewport, scrolling, safe-area, and navigation responsibilities.</p>
          <p><a className="docs-inline-link" href="/guides/app-layout">Read the app layout guide →</a></p>
        </section>
      ) : null}

      <section className="docs-section" id="behavior">
        <h2>Behavior notes</h2>
        <ul>{component.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>

      <section className="docs-section" id="platform-limitations">
        <h2>Platform limitations</h2>
        <div className="docs-callout docs-callout--warning" role="note">
          <ul>{component.platformCaveats.map((caveat) => <li key={caveat}>{renderCaveat(caveat)}</li>)}</ul>
        </div>
      </section>

      {"support" in component ? (
        <section className="docs-section" id="support">
          <h2>Transition support</h2>
          <div className="docs-table-wrap" tabIndex={0} aria-label={`${component.name} transition support; scroll horizontally to see every column`}>
            <table className="docs-table">
              <thead><tr><th>Platform</th><th>Path</th><th>Notes</th></tr></thead>
              <tbody>{component.support.map((item) => <tr key={item.platform}><td>{item.platform}</td><td>{item.availability}</td><td>{item.notes}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="docs-section" id="accessibility">
        <h2>Accessibility</h2>
        <p>{component.accessibility}</p>
      </section>

      <nav className="docs-pagination" aria-label="Documentation pagination">
        {previous ? <a href={`/components/${previous.slug}`}><small>Previous</small><strong>← {previous.name}</strong></a> : <span />}
        {next ? <a href={`/components/${next.slug}`}><small>Next</small><strong>{next.name} →</strong></a> : <span />}
      </nav>
    </article>
  );
}
