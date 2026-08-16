import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/code-block";
import { ComponentInstallation } from "@/components/component-installation";
import { ExamplePanel } from "@/components/example-panel";
import { componentDocs, getComponentDoc } from "@/lib/component-docs";
import { createPageMetadata } from "@/lib/site-metadata";

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

      <section className="docs-section" id="behavior">
        <h2>Behavior notes</h2>
        <ul>{component.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>

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
