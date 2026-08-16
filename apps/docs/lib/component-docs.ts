const registryUrl = "https://pwaui.com/r";

export const componentDocs = [
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
      <AppShell.Footer>
        <TabBar>
          <TabBar.Item icon={<Home />} label="Home" active />
        </TabBar>
      </AppShell.Footer>
    </AppShell>
  )
}`,
    anatomy: ["AppShell", "AppShell.Header", "AppShell.Main", "AppShell.Footer"],
    notes: ["Header and Footer are placement regions, not styled navigation components.", "The usual composition is NavigationBar inside Header and TabBar inside Footer.", "Header and Footer apply the relevant safe-area inset; do not wrap their children in another SafeArea for the same edge.", "Main owns scrolling and overscroll containment."],
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
    accessibility: "SafeArea is a layout-only div and does not alter the semantics of its children.",
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
    accessibility: "The component is layout-only. Preserve normal focus order and label all form controls inside it.",
  },
  {
    slug: "install-prompt",
    name: "InstallPrompt",
    summary: "A persistent, accessible invitation to install the PWA when the browser allows it.",
    description: "InstallPrompt presents the value and action clearly without triggering browser UI on its own. Pair it with useInstallPrompt and only render it when the browser supplies an install prompt.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/install-prompt.json`,
    usage: `"use client"

import { InstallPrompt } from "@/components/ui/install-prompt"
import { useInstallPrompt } from "@/hooks/use-install-prompt"

export function AppInstallPrompt() {
  const { status, prompt } = useInstallPrompt()

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
    anatomy: ["InstallPrompt", "title", "description", "install action", "optional dismiss action"],
    notes: ["Render only after useInstallPrompt reports available.", "The component never requests installation during render or without a user action.", "Use product-specific copy that explains the value of installing."],
    accessibility: "The prompt is a labelled section with visible text and touch-sized native buttons. Browser installation remains tied to an explicit user action.",
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
    accessibility: "The message uses a polite status live region, includes visible text rather than color alone, and does not interrupt the current task.",
  },
] as const;

export type ComponentDoc = (typeof componentDocs)[number];
export type ComponentSlug = ComponentDoc["slug"];

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug);
}
