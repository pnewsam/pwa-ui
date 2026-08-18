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
      "The optional second argument is the value used for server rendering and hydration; the first client render already reflects the live media query.",
      "The hook responds when the media query begins or stops matching.",
      "Use the same breakpoint string in CSS and JavaScript when behavior and layout must change together.",
    ],
  },
  {
    slug: "use-install-prompt",
    name: "useInstallPrompt",
    summary: "Capture the browser's one-shot PWA installation opportunity safely.",
    description: "useInstallPrompt normalizes install availability, user choice, installed state, and prompt failures without showing browser UI until your own user-initiated action calls prompt().",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-install-prompt.json`,
    usage: `"use client"

import { useInstallPrompt } from "@/hooks/use-install-prompt"

export function InstallButton() {
  const { status, canPrompt, prompt } = useInstallPrompt()

  if (!canPrompt && status !== "prompting") return null

  return (
    <button disabled={status === "prompting"} onClick={() => void prompt()}>
      {status === "prompting" ? "Opening…" : "Install app"}
    </button>
  )
}`,
    returns: [
      { name: "status", description: "The install lifecycle from unknown or unavailable through prompting and user choice." },
      { name: "canPrompt", description: "Whether a captured browser prompt is currently available." },
      { name: "isInstalled", description: "Whether the app is running installed or the appinstalled event has confirmed installation." },
      { name: "error", description: "The most recent native prompt failure, if one occurred." },
      { name: "prompt()", description: "Shows the captured browser prompt once and resolves with its outcome." },
    ],
    notes: [
      "Mount the hook near the application root so it can capture the browser event when it fires.",
      "prompt() returns unavailable when no prompt has been captured and shares one in-flight request across repeated calls.",
      "Browsers that do not expose beforeinstallprompt remain unavailable; provide separate platform instructions when your product needs them.",
    ],
  },
  {
    slug: "use-service-worker-update",
    name: "useServiceWorkerUpdate",
    summary: "Observe, check, and explicitly activate an existing service worker update.",
    description: "useServiceWorkerUpdate watches a registration without creating one. It exposes the waiting worker and keeps activation or reload behind an explicit application action.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-service-worker-update.json`,
    usage: `"use client"

import { useServiceWorkerUpdate } from "@/hooks/use-service-worker-update"

export function UpdateButton() {
  const { status, applyUpdate } = useServiceWorkerUpdate({
    checkOnMount: true,
  })

  if (status !== "waiting") return null

  return (
    <button onClick={() => applyUpdate({ reload: true })}>
      Update now
    </button>
  )
}`,
    returns: [
      { name: "status", description: "The registration and update lifecycle, including unsupported and error states." },
      { name: "registration", description: "The existing registration found for the requested scope, or null." },
      { name: "updateAvailable", description: "Whether an installed update is waiting to activate." },
      { name: "checkForUpdate()", description: "Requests a service-worker update check and reports whether one is installing or waiting." },
      { name: "applyUpdate()", description: "Posts SKIP_WAITING to the waiting worker, with explicit optional reload behavior." },
      { name: "error", description: "The most recent registration or update failure." },
    ],
    notes: [
      "The hook never registers a service worker and reports unregistered when none exists for the scope.",
      "By default it checks for a newer worker when the page returns to the foreground, throttled to once every 30 seconds; set checkOnVisible to false to opt out.",
      "Set reload: true only after the application has protected unsaved work.",
      "The service worker must handle the SKIP_WAITING message before applyUpdate can activate it.",
    ],
  },
  {
    slug: "use-network-status",
    name: "useNetworkStatus",
    summary: "Subscribe to the browser's online and offline connectivity hint.",
    description: "useNetworkStatus provides a small SSR-safe wrapper around navigator.onLine and its change events while preserving an honest unknown state during server rendering.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-network-status.json`,
    usage: `"use client"

import { useNetworkStatus } from "@/hooks/use-network-status"

export function NetworkStatus() {
  const { status } = useNetworkStatus()

  return <p>Network: {status}</p>
}`,
    returns: [
      { name: "status", description: "unknown during server rendering, then online or offline in the browser." },
      { name: "isOnline", description: "null while unknown, otherwise the boolean browser hint." },
    ],
    notes: [
      "The browser signal does not prove that your API or the public internet is reachable.",
      "Use it to explain likely connectivity trouble, not to permanently disable user actions.",
      "A real request remains the authoritative test for whether a particular service can be reached.",
    ],
  },
  {
    slug: "use-page-visibility",
    name: "usePageVisibility",
    summary: "Observe when the page becomes hidden, visible, restored, or previously discarded.",
    description: "usePageVisibility exposes the browser visibility boundary that mobile applications can use to pause work, persist local state, and refresh data after returning to the foreground.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/use-page-visibility.json`,
    usage: `"use client"

import * as React from "react"
import { usePageVisibility } from "@/hooks/use-page-visibility"

export function RefreshOnReturn() {
  const { isVisible } = usePageVisibility()

  React.useEffect(() => {
    if (isVisible) void refreshData()
  }, [isVisible])

  return null
}`,
    returns: [
      { name: "visibilityState", description: "unknown during server rendering, then the document visibility state." },
      { name: "isVisible", description: "null while unknown, otherwise whether the document is visible." },
      { name: "wasDiscarded", description: "Whether the browser restored this load after discarding the previous page." },
    ],
    notes: [
      "Visibility changes are a better mobile session boundary than relying on unload.",
      "Pause polling and visual work while hidden, and revalidate data when the page returns.",
      "Keep persistence work small because the browser may suspend or discard the page shortly after it becomes hidden.",
    ],
  },
] as const;

export type HookDoc = (typeof hookDocs)[number];
export type HookSlug = HookDoc["slug"];

export function getHookDoc(slug: string) {
  return hookDocs.find((hook) => hook.slug === slug);
}
