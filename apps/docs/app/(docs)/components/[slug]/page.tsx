import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CodeBlock, ExamplePanel } from "@/components/example-panel";
import { componentDocs, getComponentDoc } from "@/lib/component-docs";

export function generateStaticParams() {
  return componentDocs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/components/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentDoc(slug);
  return component ? { title: `${component.name} — PWA UI`, description: component.summary } : {};
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
        <CodeBlock code={component.install} language="bash" />
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
        {previous ? <Link href={`/components/${previous.slug}`}><small>Previous</small><strong>← {previous.name}</strong></Link> : <span />}
        {next ? <Link href={`/components/${next.slug}`}><small>Next</small><strong>{next.name} →</strong></Link> : <span />}
      </nav>
    </article>
  );
}
