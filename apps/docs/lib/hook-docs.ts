const registryUrl = "https://pwaui.com/r";

export const hookDocs = [
  {
    slug: "use-display-mode",
    name: "useDisplayMode",
    summary: "Detect whether the app is running in a browser or an installed display mode.",
    description: "useDisplayMode provides an SSR-safe view of the current PWA display mode, including the iOS standalone signal and standard display-mode media queries.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-display-mode.json`,
    usage: `"use client"

import { useDisplayMode } from "@/hooks/use-display-mode"

export function DisplayModeStatus() {
  const mode = useDisplayMode()

  return <p>Running in {mode} mode.</p>
}`,
    returns: [
      { name: "unknown", description: "The server-rendered value before the browser can be inspected." },
      { name: "browser", description: "The app is running in a regular browser tab." },
      { name: "standalone", description: "The app is running as an installed standalone experience." },
      { name: "fullscreen", description: "The app is running in fullscreen display mode." },
      { name: "minimal-ui", description: "The browser is presenting minimal navigation controls." },
    ],
    notes: [
      "Checks navigator.standalone for installed iOS and iPadOS web apps.",
      "Subscribes to display-mode media-query changes and cleans up every listener.",
      "Treat unknown as a real initial state rather than assuming browser during server rendering.",
    ],
  },
  {
    slug: "use-visual-viewport",
    name: "useVisualViewport",
    summary: "Read the visible viewport and a practical software-keyboard layout hint.",
    description: "useVisualViewport exposes the part of the page currently visible to the user, which can differ from the layout viewport when browser chrome, zoom, or a software keyboard is present.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-visual-viewport.json`,
    usage: `"use client"

import { useVisualViewport } from "@/hooks/use-visual-viewport"

export function ViewportStatus() {
  const viewport = useVisualViewport()

  return (
    <output>
      {Math.round(viewport.width)} × {Math.round(viewport.height)}
    </output>
  )
}`,
    returns: [
      { name: "width / height", description: "The visible viewport dimensions in CSS pixels." },
      { name: "offsetTop / offsetLeft", description: "The visual viewport offset from the layout viewport." },
      { name: "scale", description: "The current pinch-zoom scale." },
      { name: "keyboardHeight", description: "A thresholded layout hint derived from the viewport difference." },
      { name: "supported", description: "Whether the browser exposes the Visual Viewport API." },
    ],
    notes: [
      "Updates are throttled to one animation frame during viewport resize and scroll events.",
      "Falls back to window dimensions when the Visual Viewport API is unavailable.",
      "keyboardHeight is a layout heuristic, not a definitive keyboard-open signal.",
    ],
  },
  {
    slug: "use-media-query",
    name: "useMediaQuery",
    summary: "Subscribe to a CSS media query without breaking server rendering.",
    description: "useMediaQuery keeps responsive React behavior aligned with the browser's media-query engine while allowing callers to choose a predictable server-rendered default.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-media-query.json`,
    usage: `"use client"

import { useMediaQuery } from "@/hooks/use-media-query"

export function ResponsiveLabel() {
  const isCompact = useMediaQuery("(max-width: 47.999rem)")

  return <p>{isCompact ? "Compact" : "Wide"} layout</p>
}`,
    returns: [
      { name: "boolean", description: "Whether the supplied media query currently matches." },
    ],
    notes: [
      "The optional second argument controls the value used before the client effect runs.",
      "The hook responds when the media query begins or stops matching.",
      "Use the same breakpoint string in CSS and JavaScript when behavior and layout must change together.",
    ],
  },
] as const;

export type HookDoc = (typeof hookDocs)[number];
export type HookSlug = HookDoc["slug"];

export function getHookDoc(slug: string) {
  return hookDocs.find((hook) => hook.slug === slug);
}
