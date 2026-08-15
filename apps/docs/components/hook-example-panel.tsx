"use client";

import * as React from "react";

import { CodeBlock } from "@/components/code-block";
import type { HookSlug } from "@/lib/hook-docs";
import { useDisplayMode } from "../../../registry/hooks/use-display-mode";
import { useInstallPrompt } from "../../../registry/hooks/use-install-prompt";
import { useMediaQuery } from "../../../registry/hooks/use-media-query";
import { useNetworkStatus } from "../../../registry/hooks/use-network-status";
import { usePageVisibility } from "../../../registry/hooks/use-page-visibility";
import { useServiceWorkerUpdate } from "../../../registry/hooks/use-service-worker-update";
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

function InstallPromptHookDemo() {
  const { status, canPrompt, isInstalled } = useInstallPrompt();
  const values = [
    ["Status", status],
    ["Can prompt", canPrompt ? "Yes" : "No"],
    ["Installed", isInstalled ? "Yes" : "No"],
  ];

  return <HookStatusDemo label="Live install capability" values={values} note="The browser controls whether an install prompt becomes available." />;
}

function ServiceWorkerUpdateDemo() {
  const { status, updateAvailable } = useServiceWorkerUpdate();
  const values = [
    ["Status", status],
    ["Update ready", updateAvailable ? "Yes" : "No"],
  ];

  return <HookStatusDemo label="Current service worker" values={values} note="This documentation page does not register a service worker for you." />;
}

function NetworkStatusDemo() {
  const { status, isOnline } = useNetworkStatus();
  const values = [
    ["Browser hint", status],
    ["Online", isOnline === null ? "Unknown" : isOnline ? "Yes" : "No"],
  ];

  return <HookStatusDemo label="Current network status" values={values} note="This is a browser hint, not proof that a particular server is reachable." />;
}

function PageVisibilityDemo() {
  const { visibilityState, isVisible, wasDiscarded } = usePageVisibility();
  const values = [
    ["Visibility", visibilityState],
    ["Visible", isVisible === null ? "Unknown" : isVisible ? "Yes" : "No"],
    ["Was discarded", wasDiscarded ? "Yes" : "No"],
  ];

  return <HookStatusDemo label="Current page lifecycle" values={values} note="Switch tabs or minimize the browser to change the visibility state." />;
}

function HookStatusDemo({ label, values, note }: { label: string; values: string[][]; note: string }) {
  return (
    <div className="hook-demo hook-demo-wide">
      <span className="hook-demo-label">{label}</span>
      <div className="hook-demo-grid">
        {values.map(([name, value]) => <div key={name}><span>{name}</span><output>{value}</output></div>)}
      </div>
      <p>{note}</p>
    </div>
  );
}

function HookDemo({ slug }: { slug: HookSlug }) {
  switch (slug) {
    case "use-display-mode": return <DisplayModeDemo />;
    case "use-visual-viewport": return <VisualViewportDemo />;
    case "use-media-query": return <MediaQueryDemo />;
    case "use-install-prompt": return <InstallPromptHookDemo />;
    case "use-service-worker-update": return <ServiceWorkerUpdateDemo />;
    case "use-network-status": return <NetworkStatusDemo />;
    case "use-page-visibility": return <PageVisibilityDemo />;
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
