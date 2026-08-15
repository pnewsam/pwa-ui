"use client";

import * as React from "react";

import { CodeBlock } from "@/components/code-block";
import { ComponentSource } from "@/components/component-source";
import type { ComponentSlug } from "@/lib/component-docs";

type InstallationMethod = "command" | "manual";

export function ComponentInstallation({ slug, command }: { slug: ComponentSlug; command: string }) {
  const [method, setMethod] = React.useState<InstallationMethod>("command");

  return (
    <div className="installation-panel">
      <div className="installation-tabs" aria-label="Installation method">
        <button type="button" aria-pressed={method === "command"} onClick={() => setMethod("command")}>
          Command
        </button>
        <button type="button" aria-pressed={method === "manual"} onClick={() => setMethod("manual")}>
          Manual
        </button>
      </div>

      {method === "command" ? (
        <CodeBlock code={command} language="bash" compact />
      ) : (
        <div className="installation-manual">
          <div className="installation-manual-intro">
            <strong>Copy and paste the component into your project.</strong>
            <p>Use the destination shown for each file. Composed primitives are included as separate files.</p>
          </div>
          <ComponentSource slug={slug} />
        </div>
      )}
    </div>
  );
}
