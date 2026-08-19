# Component guide

All examples assume a shadcn-compatible `@/lib/utils` alias. Registry installation adds the standard `cn()` utility and explicit npm dependencies when required.

## PWAProvider

Purpose: publish one shared visual viewport and software-keyboard layout contract for the application.

```tsx
<PWAProvider>{children}</PWAProvider>
```

Mount the provider once near the application root. It writes `--pwa-viewport-height`, `--pwa-visual-viewport-height`, and `--pwa-keyboard-height` on the document root and marks likely keyboard occlusion with `data-pwa-keyboard-open`. The heuristic requires an editable control to be focused, ignores pinch zoom, and resets its baseline after orientation changes.

## AppShell

Purpose: own the available mobile viewport while keeping header and footer chrome outside the independently scrolling main region.

```tsx
<AppShell>
  <AppShell.Header>
    <NavigationBar>...</NavigationBar>
  </AppShell.Header>
  <AppShell.Main>...</AppShell.Main>
  <AppShell.Footer keyboardBehavior="hide">
    <TabBar>...</TabBar>
  </AppShell.Footer>
</AppShell>
```

The root uses the shared viewport-height token with a `100dvh` fallback and consumes the provider's measured height when it is mounted. `Header` and `Footer` are placement regions rather than styled navigation components: they keep chrome outside the scroll container and apply the relevant safe-area inset. The usual composition is `NavigationBar` inside `Header` and `TabBar` inside `Footer`. Do not add another `SafeArea` for the same edge. Footer `keyboardBehavior` can be `none` or `hide`.

For a full-screen application, import `pwa-base` and opt into document containment so the outer page cannot become a second scroll region:

```tsx
<html data-pwa-app-root>
  <body>
    <PWAProvider>
      <div data-pwa-app-mount>
        <AppShell>...</AppShell>
      </div>
    </PWAProvider>
  </body>
</html>
```

Leave these attributes off ordinary document pages and embedded component examples that should retain normal page scrolling.

## PullToRefresh

Purpose: add a touch-driven refresh gesture to a list or feed without owning the data request.

```tsx
<AppShell.Main className="overflow-hidden">
  <PullToRefresh className="h-full" onRefresh={refresh}>
    <MessageList />
  </PullToRefresh>
</AppShell.Main>
```

`PullToRefresh` owns the vertical scroll viewport so its top-edge check has a single reliable boundary. When composing it with `AppShell.Main`, move scrolling to the component by setting Main to `overflow-hidden` and the refresh viewport to `h-full`. It exposes `data-state` and `--pwa-pull-distance` for styling, holds its status indicator while the returned promise is pending, and ignores mouse drags. Keep a conventional refresh action available for people who cannot perform the gesture.

## SafeArea

Purpose: apply selected platform safe-area insets without device detection.

```tsx
<SafeArea edges={["top", "bottom"]}>...</SafeArea>
```

Supported edges are `top`, `right`, `bottom`, and `left`. The component uses `env(safe-area-inset-*)` fallbacks and resolves to zero on unsupported surfaces.

## BottomSheet

Purpose: provide the canonical mobile overlay, including swipe dismissal, controlled or uncontrolled state, focus restoration, scrolling, snap points, nested drawers, and form-keyboard handling.

```tsx
<BottomSheet snapPoints={["24rem", 1]}>
  <BottomSheet.Trigger>Open</BottomSheet.Trigger>
  <BottomSheet.Content>
    <BottomSheet.Header>
      <BottomSheet.Title>Filters</BottomSheet.Title>
      <BottomSheet.Description>Narrow the results.</BottomSheet.Description>
    </BottomSheet.Header>
  </BottomSheet.Content>
</BottomSheet>
```

Behavior comes from Base UI Drawer. The wrapper supplies a bottom presentation, drag handle, safe-area padding, swipe/snap CSS variables, scroll containment, reduced-motion compatibility, and `Drawer.VirtualKeyboardProvider`. `Header` and `Footer` are presentation helpers inside Base UI's semantic `Drawer.Content`; the footer uses sticky positioning for long content.

## ResponsiveDialog

Purpose: reuse one content tree and one open state across mobile BottomSheet and desktop Base UI Dialog presentations.

```tsx
<ResponsiveDialog breakpoint="(max-width: 47.999rem)">
  <ResponsiveDialog.Trigger>Edit profile</ResponsiveDialog.Trigger>
  <ResponsiveDialog.Content>
    <ResponsiveDialog.Header>
      <ResponsiveDialog.Title>Edit profile</ResponsiveDialog.Title>
      <ResponsiveDialog.Description>Update your account.</ResponsiveDialog.Description>
    </ResponsiveDialog.Header>
  </ResponsiveDialog.Content>
</ResponsiveDialog>
```

`open`, `defaultOpen`, and `onOpenChange` are supported. Resizing swaps the primitive under the same state owner, preventing duplicate dialogs. Local form state should live above `ResponsiveDialog.Content` if it must survive a breakpoint remount.

## ActionSheet

Purpose: present a short set of immediate touch actions rather than a generic context menu.

```tsx
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
```

Items close the sheet by default; set `closeOnSelect={false}` for an action that needs to keep it open. Groups, items, and Cancel provide deliberate 56px touch targets.

## NavigationBar

Purpose: render mobile application top chrome without owning routing.

```tsx
<NavigationBar>
  <NavigationBar.Leading><NavigationBar.BackButton onClick={goBack} /></NavigationBar.Leading>
  <NavigationBar.Title>Settings</NavigationBar.Title>
  <NavigationBar.Trailing>...</NavigationBar.Trailing>
</NavigationBar>
```

The three-column grid keeps the title centered even when leading and trailing controls differ in width. Place NavigationBar inside `AppShell.Header` when using the two together. For router links, compose `BackButton` with the router link through its `render` prop so client-side navigation, handlers, classes, and refs are preserved.

## TabBar

Purpose: provide fixed or sticky application navigation without importing a router.

```tsx
<TabBar>
  <TabBar.Item icon={<Home />} label="Home" active />
  <TabBar.Item icon={<Search />} label="Search" badge={3} />
  <TabBar.Item icon={<User />} label="Profile" href="/profile" />
</TabBar>
```

Items render buttons by default or anchors when `href` is supplied. Place TabBar inside `AppShell.Footer` when using the two together. Active items expose `aria-current="page"`; badges remain part of the accessible name.

## KeyboardAvoidingView

Purpose: keep application-level forms and fixed composers clear of the software keyboard outside Base UI drawers.

```tsx
<KeyboardAvoidingView behavior="padding" keyboardOffset={8}>...</KeyboardAvoidingView>
```

Behaviors are `padding`, `height`, and `position`. The component exposes `--pwa-keyboard-height` and `--pwa-visual-viewport-height`, ignores sub-80px viewport changes, cleans up all listeners, and becomes an effective no-op without Visual Viewport support. Inside BottomSheet, prefer the built-in Base UI keyboard provider.

## InstallPrompt

Purpose: present app installation as an explicit, user-initiated choice after the browser reports that installation is available.

```tsx
const { canPrompt, prompt } = useInstallPrompt();

return canPrompt ? <InstallPrompt onInstall={() => void prompt()} /> : null;
```

The component never opens browser UI on its own. The paired hook retains the browser event, prevents concurrent prompts, and reports accepted, dismissed, unavailable, installed, and error states.

## UpdatePrompt

Purpose: let a user apply or defer a waiting service worker update without surprise activation or reloads.

```tsx
const update = useServiceWorkerUpdate();

return update.updateAvailable ? (
  <UpdatePrompt onUpdate={() => update.applyUpdate({ reload: true })} />
) : null;
```

The hook observes an existing service worker registration; it does not register one. It checks again when the page returns to the foreground by default, throttled to once every 30 seconds. The worker must handle the `SKIP_WAITING` message if the application uses the provided update action.

## OfflineBanner

Purpose: provide persistent, non-blocking connectivity feedback with an optional recovery action.

```tsx
const { status } = useNetworkStatus();

return status === "offline" ? <OfflineBanner /> : null;
```

`navigator.onLine` is only a platform hint, not proof that the application server is reachable. Keep request-level failures and retry behavior close to the affected content.

## Lifecycle hooks

`usePageVisibility` exposes foreground and background transitions so an application can pause expensive work, persist state, or refresh stale data. Like the other hooks, it preserves an `unknown` server-rendering state and attaches browser listeners only after mount.

## PWA base styles

`pwa-base` installs conservative tokens for safe areas, dynamic viewport height, keyboard height, navigation and tab bars, touch targets, and opt-in full-screen root containment. It does not overwrite shadcn color tokens. Import `styles/pwa.css` once from the application stylesheet or layout, then mount `PWAProvider` once when application chrome should respond to the measured visual viewport and software keyboard.
