import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/code-block";
import { ComponentInstallation } from "@/components/component-installation";
import { HookExamplePanel } from "@/components/hook-example-panel";
import { getHookDoc, hookDocs } from "@/lib/hook-docs";
import { createPageMetadata } from "@/lib/site-metadata";

export function generateStaticParams() {
  return hookDocs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/hooks/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const hook = getHookDoc(slug);
  return hook ? createPageMetadata(hook.name, hook.summary, `/hooks/${hook.slug}`) : {};
}

export default async function HookPage({ params }: PageProps<"/hooks/[slug]">) {
  const { slug } = await params;
  const hook = getHookDoc(slug);
  if (!hook) notFound();

  const index = hookDocs.findIndex((item) => item.slug === hook.slug);
  const previous = hookDocs[index - 1];
  const next = hookDocs[index + 1];

  return (
    <article className="docs-article">
      <div className="docs-breadcrumbs">Docs <span>/</span> Hooks <span>/</span> {hook.name}</div>
      <header className="docs-page-header component-header">
        <p className="docs-kicker">Hook</p>
        <h1>{hook.name}</h1>
        <p>{hook.description}</p>
      </header>

      <section className="docs-section" id="preview">
        <h2>Preview</h2>
        <HookExamplePanel slug={hook.slug} code={hook.usage} />
      </section>

      <section className="docs-section" id="installation">
        <h2>Installation</h2>
        <ComponentInstallation slug={hook.slug} command={hook.install} kind="hook" />
      </section>

      <section className="docs-section" id="usage">
        <h2>Usage</h2>
        <CodeBlock code={hook.usage} language="tsx" />
      </section>

      <section className="docs-section" id="returns">
        <h2>Returns</h2>
        <dl className="docs-api-list">
          {hook.returns.map((item) => <div key={item.name}><dt><code>{item.name}</code></dt><dd>{item.description}</dd></div>)}
        </dl>
      </section>

      <section className="docs-section" id="behavior">
        <h2>Behavior notes</h2>
        <ul>{hook.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </section>

      <nav className="docs-pagination" aria-label="Hook documentation pagination">
        {previous ? <a href={`/hooks/${previous.slug}`}><small>Previous</small><strong>← {previous.name}</strong></a> : <span />}
        {next ? <a href={`/hooks/${next.slug}`}><small>Next</small><strong>{next.name} →</strong></a> : <span />}
      </nav>
    </article>
  );
}
