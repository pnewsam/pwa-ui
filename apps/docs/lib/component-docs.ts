const registryUrl = "https://pwaui.com/r";

export const componentDocs = [
  {
    slug: "pwa-provider",
    name: "PWAProvider",
    summary: "One shared viewport subscription and stable PWA layout variables for the application.",
    description: "PWAProvider publishes visual viewport and software-keyboard measurements as CSS variables at the document root. Mount it once so AppShell and other layouts share one source of truth.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/pwa-provider.json`,
    usage: `import { PWAProvider } from "@/components/ui/pwa-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  )
}`,
    anatomy: ["PWAProvider", "useVisualViewport", "CSS variables"],
    notes: ["Mount once near the application root.", "PWAProvider publishes measurements but does not lock document scrolling; full-screen applications should use the opt-in root containment described in the app layout guide.", "Publishes --pwa-viewport-height, --pwa-visual-viewport-height, and --pwa-keyboard-height.", "Sets data-pwa-keyboard-open on the document root while a likely software keyboard is occluding the viewport.", "Keyboard detection is a layout hint and intentionally ignores pinch zoom."],
    platformCaveats: ["Software-keyboard detection is a heuristic built on the Visual Viewport API. It cannot perfectly separate the keyboard from other viewport occlusions and is intentionally suppressed during pinch-zoom.", "On Android the reported keyboard height depends on the page's `interactive-widget` policy. With `overlays-content` the visual viewport does not shrink, so the keyboard variables stay at 0. See Platform limitations."],
    accessibility: "The provider renders no wrapper or interactive UI. It preserves pinch zoom and only changes layout variables used by your application.",
  },
  {
    slug: "app-shell",
    name: "AppShell",
    summary: "A dynamic-viewport frame for fixed application chrome and independently scrolling content.",
    description: "AppShell provides placement regions for mobile application chrome and a separately scrolling body. Put visual components such as NavigationBar and TabBar inside its header and footer regions.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/app-shell.json`,
    usage: `import { Home } from "lucide-react"
import { AppShell } from "@/components/ui/app-shell"
import { NavigationBar } from "@/components/ui/navigation-bar"
import { TabBar } from "@/components/ui/tab-bar"

export function Screen() {
  return (
    <AppShell>
      <AppShell.Header>
        <NavigationBar>
          <NavigationBar.Title>Today</NavigationBar.Title>
        </NavigationBar>
      </AppShell.Header>
      <AppShell.Main>Scrollable content</AppShell.Main>
      <AppShell.Footer keyboardBehavior="hide">
        <TabBar>
          <TabBar.Item icon={<Home />} label="Home" active />
        </TabBar>
      </AppShell.Footer>
    </AppShell>
  )
}`,
    anatomy: ["AppShell", "AppShell.Header", "AppShell.Main", "AppShell.Footer"],
    notes: ["Header and Footer are placement regions, not styled navigation components.", "The usual composition is NavigationBar inside Header and TabBar inside Footer.", "For a full-screen application, opt into root containment so Main is the only vertical scroll region.", "Header and Footer apply the relevant safe-area inset; do not wrap their children in another SafeArea for the same edge.", "Main owns scrolling and overscroll containment.", "Footer keyboardBehavior can leave chrome in place or hide it while the software keyboard is open when PWAProvider is mounted."],
    platformCaveats: ["`--pwa-viewport-height` tracks the visual viewport and shrinks when the software keyboard opens. Anchor chrome with the safe-area padding this component applies rather than `100vh`.", "Safe-area insets are only non-zero with `viewport-fit=cover` on edge-to-edge or installed surfaces. In an ordinary browser tab they resolve to 0."],
    accessibility: "Uses semantic header, main, and footer elements. Provide accessible navigation landmarks inside the chrome regions.",
  },
  {
    slug: "safe-area",
    name: "SafeArea",
    summary: "Explicit safe-area padding powered by CSS environment variables.",
    description: "SafeArea applies only the requested platform insets. It gracefully resolves to zero in ordinary browser tabs and never relies on model-specific device detection.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/safe-area.json`,
    usage: `import { SafeArea } from "@/components/ui/safe-area"

export function Footer() {
  return (
    <SafeArea edges={["left", "right", "bottom"]}>
      <nav>...</nav>
    </SafeArea>
  )
}`,
    anatomy: ["SafeArea"],
    notes: ["Supported edges: top, right, bottom, and left.", "Uses env(safe-area-inset-*) with zero-value fallbacks.", "Combine it with your own spacing inside a nested child when padding must be additive."],
    platformCaveats: ["`env(safe-area-inset-*)` only reports non-zero values when the page sets `viewport-fit=cover` on a device with display cutouts or an installed/edge-to-edge surface. Everywhere else these resolve to 0 by design."],
    accessibility: "SafeArea is a layout-only div and does not alter the semantics of its children.",
  },
  {
    slug: "pull-to-refresh",
    name: "PullToRefresh",
    summary: "A resistant, touch-driven refresh viewport for list and feed screens.",
    description: "PullToRefresh owns a scroll viewport, arms only at its top edge, and keeps the refresh indicator visible until your asynchronous refresh work settles.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/pull-to-refresh.json`,
    usage: `"use client"

import { PullToRefresh } from "@/components/ui/pull-to-refresh"

export function Inbox() {
  async function refresh() {
    await fetch("/api/messages", { cache: "no-store" })
  }

  return (
    <PullToRefresh className="h-full" onRefresh={refresh}>
      <ol>{/* messages */}</ol>
    </PullToRefresh>
  )
}`,
    anatomy: ["PullToRefresh", "indicator", "scroll viewport", "content"],
    notes: ["The component owns its scroll viewport so it can determine reliably when scrollTop is zero.", "Inside AppShell, place PullToRefresh in AppShell.Main and move vertical overflow from Main to PullToRefresh: use overflow-hidden on Main and h-full on PullToRefresh.", "The state contract is exposed through data-state=idle, pulling, armed, or refreshing and --pwa-pull-distance.", "Mouse dragging is ignored. Desktop users refresh through your ordinary visible controls or browser command.", "Use the controlled refreshing prop when another state owner determines when the refresh has finished."],
    platformCaveats: ["Browser-mode Safari and Chrome may already provide page-level pull-to-refresh. Keep the application root overscroll-contained so the browser gesture does not compete with this viewport; installed standalone PWAs generally need the custom control.", "Pointer-derived touch behavior still varies at platform boundaries. Verify both browser and installed display modes on real iOS and Android hardware before treating the gesture as stable."],
    accessibility: "Refresh progress is announced through a polite status live region. The default spinner stops rotating when reduced motion is requested; keep a separate visible refresh action available for users who cannot perform the gesture.",
  },
  {
    slug: "stack-navigator",
    name: "StackNavigator",
    summary: "A controlled stack of mounted views with native-enhanced push and pop transitions.",
    description: "StackNavigator animates a consumer-owned list of views while preserving covered DOM state, scroll, and focus. It never reads a URL, writes history, or chooses what to navigate to.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/stack-navigator.json`,
    usage: `"use client"

import * as React from "react"
import { NavigationBar } from "@/components/ui/navigation-bar"
import { StackNavigator, useStackNavigator } from "@/components/ui/stack-navigator"

function ProjectDetail() {
  const { pop } = useStackNavigator()

  return (
    <>
      <NavigationBar>
        <NavigationBar.Leading>
          <NavigationBar.BackButton data-autofocus onClick={pop} />
        </NavigationBar.Leading>
        <NavigationBar.Title>Project</NavigationBar.Title>
      </NavigationBar>
      <main>Project detail</main>
    </>
  )
}

export function ProjectStack() {
  const [detailOpen, setDetailOpen] = React.useState(false)
  const entries = [
    { key: "projects", label: "Projects", content: <button onClick={() => setDetailOpen(true)}>Open project</button> },
    ...(detailOpen ? [{ key: "project", label: "Project detail", content: <ProjectDetail /> }] : []),
  ]

  return <StackNavigator entries={entries} onPop={() => setDetailOpen(false)} />
}`,
    anatomy: ["StackNavigator", "stack view", "useStackNavigator", "entries", "onPop"],
    notes: ["entries is the complete controlled stack. Append to push and remove from the end to pop; the component keeps no private navigation history.", "Covered views stay mounted but inert and aria-hidden, preserving uncontrolled input state and scroll without exposing hidden controls to keyboard or assistive-technology navigation.", "useStackNavigator exposes depth, canPop, and pop so a NavigationBar.BackButton inside the top entry can request onPop.", "onDepthChange can hide a persistent TabBar or update other shell chrome without querying the DOM.", "Keep stacks shallow enough that retaining covered DOM remains inexpensive. Each view owns its own scroll viewport."],
    platformCaveats: ["Same-document View Transitions are a progressive enhancement. StackNavigator feature-detects the API and uses its transform/opacity fallback when unavailable; reduced-motion requests bypass sliding in either path.", "The component cannot synchronize deep links or browser back on its own. When a router owns entries, map router-rendered state into the controlled array and route onPop back through that router."],
    support: [
      { platform: "Chrome / Android WebView", availability: "Native enhancement", notes: "Same-document View Transitions from Chrome 111; older engines use the CSS fallback." },
      { platform: "Safari / iOS", availability: "Native enhancement", notes: "Same-document View Transitions from Safari 18; older versions use the CSS fallback." },
      { platform: "Firefox", availability: "Native enhancement", notes: "Same-document View Transitions from Firefox 139; older versions use the CSS fallback." },
    ],
    accessibility: "Only the active view is reachable. Push focuses an autofocus target or the new view container; pop returns focus to the pointer or keyboard trigger when it remains mounted, otherwise to the revealed view.",
  },
  {
    slug: "bottom-sheet",
    name: "BottomSheet",
    summary: "A swipeable, keyboard-aware mobile bottom sheet built on Base UI Drawer.",
    description: "BottomSheet preserves Base UI's focus, dismissal, nesting, gesture, and snap-point behavior while providing a polished bottom presentation and safe-area handling.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/bottom-sheet.json`,
    usage: `import { BottomSheet } from "@/components/ui/bottom-sheet"

export function Filters() {
  return (
    <BottomSheet snapPoints={["28rem", 1]}>
      <BottomSheet.Trigger>Open filters</BottomSheet.Trigger>
      <BottomSheet.Content>
        <BottomSheet.Header>
          <BottomSheet.Title>Filters</BottomSheet.Title>
          <BottomSheet.Description>Narrow the results.</BottomSheet.Description>
        </BottomSheet.Header>
      </BottomSheet.Content>
    </BottomSheet>
  )
}`,
    anatomy: ["BottomSheet", "Trigger", "Content", "Header", "Title", "Description", "Footer", "Close"],
    notes: ["Supports controlled and uncontrolled open state.", "Snap points and swipe dismissal are inherited from Base UI Drawer.", "VirtualKeyboardProvider keeps form controls visible above software keyboards."],
    platformCaveats: ["Gesture physics, snap points, and focus management come from Base UI's Drawer, an external behavioral dependency. Pin the `@base-ui/react` version you tested and re-check drag and snap behavior when you upgrade it.", "Provide a visible Close, or rely on Escape and backdrop dismissal, for users who cannot perform the drag gesture. The drag handle is decorative and is not operable by assistive technology."],
    accessibility: "Always include a Title. Include a Description when it adds meaningful context. Escape, focus trapping, restoration, and backdrop dismissal are provided by Base UI.",
  },
  {
    slug: "responsive-dialog",
    name: "ResponsiveDialog",
    summary: "One content tree rendered as a desktop dialog or mobile bottom sheet.",
    description: "ResponsiveDialog automatically selects the interaction appropriate to the current media query while retaining one owner for open state.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/responsive-dialog.json`,
    usage: `import { ResponsiveDialog } from "@/components/ui/responsive-dialog"

export function EditProfile() {
  return (
    <ResponsiveDialog>
      <ResponsiveDialog.Trigger>Edit profile</ResponsiveDialog.Trigger>
      <ResponsiveDialog.Content>
        <ResponsiveDialog.Header>
          <ResponsiveDialog.Title>Edit profile</ResponsiveDialog.Title>
          <ResponsiveDialog.Description>Update your details.</ResponsiveDialog.Description>
        </ResponsiveDialog.Header>
      </ResponsiveDialog.Content>
    </ResponsiveDialog>
  )
}`,
    anatomy: ["ResponsiveDialog", "Trigger", "Content", "Header", "Title", "Description", "Close"],
    notes: ["Default breakpoint is max-width: 47.999rem.", "The open state remains valid when the presentation changes.", "Lift local form state above Content when it must survive a breakpoint remount."],
    platformCaveats: ["Crossing the breakpoint while open swaps the dialog and sheet implementations, which remounts the content subtree and resets uncontrolled state and focus. Lift any state you must preserve above `Content`.", "The mobile/desktop choice is resolved on the client, so server-rendered markup assumes the desktop dialog until hydration."],
    accessibility: "Both presentations use Base UI primitives. Only one dialog or drawer root is mounted at a time, avoiding duplicate focus traps.",
  },
  {
    slug: "action-sheet",
    name: "ActionSheet",
    summary: "Grouped, touch-first actions with destructive and cancel treatments.",
    description: "ActionSheet is intentionally narrower than a general context menu. Use it for short, immediate action sets on touch surfaces.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/action-sheet.json`,
    usage: `import { ActionSheet } from "@/components/ui/action-sheet"

export function Actions() {
  return (
    <ActionSheet>
      <ActionSheet.Trigger>Actions</ActionSheet.Trigger>
      <ActionSheet.Content>
        <ActionSheet.Group>
          <ActionSheet.Item>Share</ActionSheet.Item>
          <ActionSheet.Item variant="destructive">Delete</ActionSheet.Item>
        </ActionSheet.Group>
        <ActionSheet.Cancel>Cancel</ActionSheet.Cancel>
      </ActionSheet.Content>
    </ActionSheet>
  )
}`,
    anatomy: ["ActionSheet", "Trigger", "Content", "Header", "Group", "Item", "Cancel"],
    notes: ["Items close the sheet by default.", "Set closeOnSelect={false} for actions that keep the sheet open.", "Groups, items, and Cancel provide deliberate 56px touch targets."],
    platformCaveats: ["Built on Base UI's Drawer (see BottomSheet), so drag and dismissal behavior follows that dependency and is worth re-checking on upgrade. The web cannot access the native iOS action-sheet chrome or its system haptics."],
    accessibility: "Use specific action labels and reserve the destructive variant for irreversible or difficult-to-recover operations.",
  },
  {
    slug: "navigation-bar",
    name: "NavigationBar",
    summary: "Router-composable top application chrome with an optically centered title.",
    description: "NavigationBar uses a balanced three-column grid so the title remains centered even when leading and trailing controls have different widths. Its back control composes with client-side router links through render.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/navigation-bar.json`,
    usage: `import Link from "next/link"
import { NavigationBar } from "@/components/ui/navigation-bar"

export function Header() {
  return (
    <NavigationBar>
      <NavigationBar.Leading>
        <NavigationBar.BackButton
          render={<Link href="/settings" />}
          aria-label="Back to settings"
        />
      </NavigationBar.Leading>
      <NavigationBar.Title>Settings</NavigationBar.Title>
      <NavigationBar.Trailing>Done</NavigationBar.Trailing>
    </NavigationBar>
  )
}`,
    anatomy: ["NavigationBar", "Leading", "Title", "Trailing", "BackButton"],
    notes: ["Inside AppShell, place NavigationBar within AppShell.Header.", "Use BackButton with onClick for history-based navigation or render with your router's Link when the destination is known.", "The render prop follows the Base UI composition convention and preserves the router link's handlers, classes, and ref.", "Long titles truncate without displacing adjacent controls."],
    platformCaveats: ["Back navigation is application-controlled. The OS/browser back gesture and the platform back stack are not managed by this component."],
    accessibility: "The root is a named navigation landmark. BackButton supplies a default Back label when it renders only the built-in icon; use a more specific aria-label when context helps.",
  },
  {
    slug: "tab-bar",
    name: "TabBar",
    summary: "Router-composable bottom navigation with labels, active state, and badges.",
    description: "TabBar provides touch-sized app navigation for three to five destinations without coupling the component to a specific router. Compose each item with your router's link component to preserve client-side navigation.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/tab-bar.json`,
    usage: `import Link from "next/link"
import { Home, Search, User } from "lucide-react"
import { TabBar } from "@/components/ui/tab-bar"

export function Navigation() {
  return (
    <TabBar>
      <TabBar.Item render={<Link href="/" />} icon={<Home />} label="Home" active />
      <TabBar.Item
        render={<Link href="/search" />}
        icon={<Search />}
        label="Search"
        badge={3}
        badgeLabel="3 new results"
      />
      <TabBar.Item render={<Link href="/profile" />} icon={<User />} label="Profile" />
    </TabBar>
  )
}`,
    anatomy: ["TabBar", "TabBar.Item"],
    notes: ["Inside AppShell, place TabBar within AppShell.Footer.", "Use render={<Link href=\"/search\" />} with Next.js, or render={<NavLink to=\"/search\" />} with React Router. TanStack Router follows the same render pattern.", "Items render buttons by default. href remains available for external links and no-router apps, but performs a document navigation.", "Active items expose aria-current=page. Use three to five stable application destinations."],
    platformCaveats: ["This is web navigation chrome, not native tabs. It does not integrate with OS gesture navigation, and in an installed iOS PWA the home-indicator area must be handled with the footer safe-area inset."],
    accessibility: "Every item requires a visible label. Supply badgeLabel whenever badge conveys information so assistive technology hears what the value means.",
  },
  {
    slug: "keyboard-avoiding-view",
    name: "KeyboardAvoidingView",
    summary: "Visual Viewport-aware layout for forms and fixed composers.",
    description: "KeyboardAvoidingView handles application layouts outside Base UI drawers by exposing stable viewport and keyboard CSS variables.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/keyboard-avoiding-view.json`,
    usage: `import { KeyboardAvoidingView } from "@/components/ui/keyboard-avoiding-view"

export function Composer() {
  return (
    <KeyboardAvoidingView behavior="padding" keyboardOffset={8}>
      <textarea aria-label="Message" />
      <button>Send</button>
    </KeyboardAvoidingView>
  )
}`,
    anatomy: ["KeyboardAvoidingView", "useVisualViewport"],
    notes: ["Behaviors: padding, height, and position.", "Exposes --pwa-keyboard-height and --pwa-visual-viewport-height.", "Inside BottomSheet, prefer Base UI's dedicated keyboard provider."],
    platformCaveats: ["Keyboard avoidance depends on the Visual Viewport API and the page's `interactive-widget` policy. With Android's `overlays-content` the viewport does not resize, so `--pwa-keyboard-height` stays 0 and this view does not move. Use `resizes-content` or `resizes-visual` if you depend on it. See Platform limitations.", "On iOS Safari the OS also auto-scrolls the focused field, which can compound with `behavior=\"position\"`. Test the `padding` and `height` behaviors on a real device."],
    accessibility: "The component is layout-only. Preserve normal focus order and label all form controls inside it.",
  },
  {
    slug: "install-prompt",
    name: "InstallPrompt",
    summary: "A persistent, accessible invitation to install the PWA, with a manual path where the browser offers no prompt.",
    description: "InstallPrompt presents the value and action clearly without triggering browser UI on its own. Pair it with useInstallPrompt: show the install action where the browser supplies a prompt, and the manual Home Screen steps where it never will.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/install-prompt.json`,
    usage: `"use client"

import { InstallPrompt } from "@/components/ui/install-prompt"
import { useInstallPrompt } from "@/hooks/use-install-prompt"

export function AppInstallPrompt() {
  const { status, promptType, prompt } = useInstallPrompt()

  if (promptType === "ios-manual") {
    return <InstallPrompt mode="manual" />
  }

  if (status !== "available" && status !== "prompting") return null

  async function install() {
    await prompt()
  }

  return (
    <InstallPrompt
      installing={status === "prompting"}
      onInstall={install}
    />
  )
}`,
    anatomy: ["InstallPrompt", "title", "description", "install action", "manual steps", "optional dismiss action"],
    notes: ["Render the default prompt mode after useInstallPrompt reports promptType \"native\".", "Render mode=\"manual\" when useInstallPrompt reports promptType \"ios-manual\"; iOS has no programmatic prompt, so the component shows Share → Add to Home Screen steps instead of an install button.", "The component never requests installation during render or without a user action.", "Use product-specific copy that explains the value of installing."],
    platformCaveats: ["iOS Safari never fires `beforeinstallprompt`, so the programmatic install flow is unavailable there — render manual \"Share → Add to Home Screen\" guidance for iOS. Firefox does not support programmatic PWA installation."],
    accessibility: "The prompt is a labelled section with visible text. Prompt mode adds touch-sized native buttons; manual mode presents an ordered list of steps and renders a button only when you supply onDismiss. Browser installation remains tied to an explicit user action.",
  },
  {
    slug: "update-prompt",
    name: "UpdatePrompt",
    summary: "A persistent notice for service-worker updates that are ready to activate.",
    description: "UpdatePrompt gives users an explicit choice to apply or defer an update. Pair it with useServiceWorkerUpdate so activation and reload behavior remain under application control.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/update-prompt.json`,
    usage: `"use client"

import { UpdatePrompt } from "@/components/ui/update-prompt"
import { useServiceWorkerUpdate } from "@/hooks/use-service-worker-update"

export function AppUpdatePrompt() {
  const { status, applyUpdate } = useServiceWorkerUpdate({
    checkOnMount: true,
  })

  if (status !== "waiting" && status !== "activating") return null

  return (
    <UpdatePrompt
      updating={status === "activating"}
      onUpdate={() => applyUpdate({ reload: true })}
    />
  )
}`,
    anatomy: ["UpdatePrompt", "title", "status description", "update action", "optional defer action"],
    notes: ["Use a persistent inline notice because the update remains available until activated.", "reload is opt-in so the application can protect unsaved work.", "The service worker must respond to the SKIP_WAITING message."],
    platformCaveats: ["Requires a registered service worker that honors the `SKIP_WAITING` message. iOS PWAs can evict storage and constrain background work, so an update may not apply until the next foreground launch."],
    accessibility: "Status changes are announced politely, actions remain available to keyboard and touch users, and the notice does not steal focus.",
  },
  {
    slug: "offline-banner",
    name: "OfflineBanner",
    summary: "Persistent, non-blocking feedback when the browser reports an offline state.",
    description: "OfflineBanner keeps connectivity context close to the application without blocking work. Pair it with useNetworkStatus and treat the signal as a hint rather than proof that a server is reachable.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/offline-banner.json`,
    usage: `"use client"

import { OfflineBanner } from "@/components/ui/offline-banner"
import { useNetworkStatus } from "@/hooks/use-network-status"

export function ConnectivityBanner() {
  const { status } = useNetworkStatus()

  if (status !== "offline") return null

  return <OfflineBanner />
}`,
    anatomy: ["OfflineBanner", "status indicator", "message", "optional action"],
    notes: ["Place it in normal document flow so it pushes content rather than covering it.", "Do not disable important actions solely because navigator.onLine reports offline.", "Use an action slot for a contextual retry or troubleshooting link when appropriate."],
    platformCaveats: ["`navigator.onLine` is a hint, not proof of connectivity: it can report online with no working internet and vice versa. Never gate critical actions on it; always handle failed requests directly."],
    accessibility: "The message uses a polite status live region, includes visible text rather than color alone, and does not interrupt the current task.",
  },
] as const;

export type ComponentDoc = (typeof componentDocs)[number];
export type ComponentSlug = ComponentDoc["slug"];

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug);
}
