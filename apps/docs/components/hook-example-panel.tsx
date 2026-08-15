"use client";

import * as React from "react";

import { CodeBlock } from "@/components/code-block";
import type { HookSlug } from "@/lib/hook-docs";
import { useDisplayMode } from "../../../registry/hooks/use-display-mode";
import { useMediaQuery } from "../../../registry/hooks/use-media-query";
import { useVisualViewport } from "../../../registry/hooks/use-visual-viewport";

function DisplayModeDemo() {
  const mode = useDisplayMode();

  return (
    <div className="hook-demo">
      <span className="hook-demo-label">Current display mode</span>
      <output>{mode}</output>
      <p>Install or open the site in another display mode to see this value change.</p>
    </div>
  );
}

function VisualViewportDemo() {
  const viewport = useVisualViewport();
  const values = [
    ["Width", `${Math.round(viewport.width)}px`],
    ["Height", `${Math.round(viewport.height)}px`],
    ["Scale", viewport.scale.toFixed(2)],
    ["Keyboard hint", `${Math.round(viewport.keyboardHeight)}px`],
  ];

  return (
    <div className="hook-demo hook-demo-wide">
      <span className="hook-demo-label">Live visual viewport</span>
      <div className="hook-demo-grid">
        {values.map(([label, value]) => (
          <div key={label}><span>{label}</span><output>{value}</output></div>
        ))}
      </div>
      <p>Resize or zoom the page to update these measurements.</p>
    </div>
  );
}

function MediaQueryDemo() {
  const query = "(max-width: 47.999rem)";
  const isCompact = useMediaQuery(query);

  return (
    <div className="hook-demo">
      <span className="hook-demo-label">{query}</span>
      <output>{isCompact ? "Matches" : "Does not match"}</output>
      <p>Resize the window across 48rem to see the result change.</p>
    </div>
  );
}

function HookDemo({ slug }: { slug: HookSlug }) {
  switch (slug) {
    case "use-display-mode": return <DisplayModeDemo />;
    case "use-visual-viewport": return <VisualViewportDemo />;
    case "use-media-query": return <MediaQueryDemo />;
  }
}

export function HookExamplePanel({ slug, code }: { slug: HookSlug; code: string }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");

  return (
    <div className="example-panel">
      <div className="example-tabs" aria-label="Example view">
        <button type="button" aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>Preview</button>
        <button type="button" aria-pressed={tab === "code"} onClick={() => setTab("code")}>Code</button>
      </div>
      <div className="example-content">
        {tab === "preview" ? <div className="example-preview"><HookDemo slug={slug} /></div> : <CodeBlock code={code} compact />}
      </div>
    </div>
  );
}
