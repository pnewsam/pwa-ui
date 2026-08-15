"use client";

import * as React from "react";

import { CodeBlock } from "@/components/code-block";
import type { ComponentSlug } from "@/lib/component-docs";

type RegistryFile = {
  path: string;
  target?: string;
  content: string;
};

type RegistryItem = {
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
};

type SourceState =
  | { status: "loading"; slug: ComponentSlug }
  | { status: "error"; slug: ComponentSlug; message: string }
  | { status: "ready"; slug: ComponentSlug; files: RegistryFile[]; dependencies: string[] };

function fileLabel(file: RegistryFile) {
  return file.target ?? file.path.replace(/^registry\//, "");
}

export function ComponentSource({ slug }: { slug: ComponentSlug }) {
  const [requestKey, setRequestKey] = React.useState(0);
  const [state, setState] = React.useState<SourceState>({ status: "loading", slug });
  const [activeFile, setActiveFile] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadSource() {
      try {
        const response = await fetch(`/r/${slug}.json`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Source request failed with ${response.status}.`);

        const item = await response.json() as RegistryItem;
        const files = (item.files ?? []).filter((file) => typeof file.content === "string");
        if (files.length === 0) throw new Error("No component source was included in this registry item.");

        const dependencies = [
          ...(item.dependencies ?? []),
          ...(item.registryDependencies ?? []).map((dependency) => `registry:${dependency}`),
        ];

        setState({ status: "ready", slug, files, dependencies });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          slug,
          message: error instanceof Error ? error.message : "The component source could not be loaded.",
        });
      }
    }

    void loadSource();
    return () => controller.abort();
  }, [requestKey, slug]);

  if (state.slug !== slug || state.status === "loading") {
    return <div className="component-source-status" role="status">Loading component source…</div>;
  }

  if (state.status === "error") {
    return (
      <div className="component-source-status is-error" role="alert">
        <div><strong>Source unavailable</strong><span>{state.message}</span></div>
        <button
          type="button"
          onClick={() => {
            setState({ status: "loading", slug });
            setRequestKey((key) => key + 1);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const selectedFile = state.files.find((file) => fileLabel(file) === activeFile) ?? state.files[0];
  const selectedLabel = fileLabel(selectedFile);

  return (
    <div className="component-source-panel">
      <div className="component-source-meta">
        <span>{state.files.length === 1 ? "1 source file" : `${state.files.length} source files`}</span>
        {state.dependencies.length > 0 ? (
          <div aria-label="Dependencies">
            <span>Requires</span>
            {state.dependencies.map((dependency) => <code key={dependency}>{dependency}</code>)}
          </div>
        ) : <span>No additional dependencies</span>}
      </div>

      <CodeBlock
        code={selectedFile.content}
        compact
        label={selectedLabel}
        toolbarStart={state.files.length > 1 ? (
          <div className="component-source-files" aria-label="Source files">
            {state.files.map((file) => {
              const label = fileLabel(file);
              return (
                <button
                  type="button"
                  key={label}
                  aria-pressed={label === selectedLabel}
                  onClick={() => setActiveFile(label)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : undefined}
        copyLabel={`Copy ${selectedLabel}`}
      />
    </div>
  );
}
