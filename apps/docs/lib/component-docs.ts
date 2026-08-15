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
    summary: "Safe-area-aware top application chrome with an optically centered title.",
    description: "NavigationBar uses a balanced three-column grid so the title remains centered even when leading and trailing controls have different widths.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/navigation-bar.json`,
    usage: `import { NavigationBar } from "@/components/ui/navigation-bar"

export function Header() {
  return (
    <NavigationBar>
      <NavigationBar.Leading>
        <NavigationBar.BackButton aria-label="Go back" />
      </NavigationBar.Leading>
      <NavigationBar.Title>Settings</NavigationBar.Title>
      <NavigationBar.Trailing>Done</NavigationBar.Trailing>
    </NavigationBar>
  )
}`,
    anatomy: ["NavigationBar", "Leading", "Title", "Trailing", "BackButton"],
    notes: ["Inside AppShell, place NavigationBar within AppShell.Header.", "Router state is deliberately out of scope.", "Place consumer-supplied links in Leading or Trailing.", "Long titles truncate without displacing adjacent controls."],
    accessibility: "The root is a named navigation landmark. Icon-only controls require an aria-label.",
  },
  {
    slug: "tab-bar",
    name: "TabBar",
    summary: "Router-agnostic bottom navigation with labels, active state, and badges.",
    description: "TabBar provides touch-sized app navigation for three to five destinations without coupling the component to Next.js or React Router.",
    install: `pnpm dlx shadcn@latest add ${registryUrl}/tab-bar.json`,
    usage: `import { Home, Search, User } from "lucide-react"
import { TabBar } from "@/components/ui/tab-bar"

export function Navigation() {
  return (
    <TabBar>
      <TabBar.Item icon={<Home />} label="Home" active />
      <TabBar.Item icon={<Search />} label="Search" badge={3} />
      <TabBar.Item icon={<User />} label="Profile" href="/profile" />
    </TabBar>
  )
}`,
    anatomy: ["TabBar", "TabBar.Item"],
    notes: ["Inside AppShell, place TabBar within AppShell.Footer.", "Items render buttons by default and anchors when href is supplied.", "Active items expose aria-current=page.", "Use three to five stable application destinations."],
    accessibility: "Every item requires a visible label. Badges remain part of the accessible name and should be concise.",
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
] as const;

export type ComponentDoc = (typeof componentDocs)[number];
export type ComponentSlug = ComponentDoc["slug"];

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug);
}
