# Component guide

All examples assume a shadcn-compatible `@/lib/utils` alias. Registry installation adds the standard `cn()` utility and explicit npm dependencies when required.

## AppShell

Purpose: own the available mobile viewport while keeping header and footer chrome outside the independently scrolling main region.

```tsx
<AppShell>
  <AppShell.Header>
    <NavigationBar>...</NavigationBar>
  </AppShell.Header>
  <AppShell.Main>...</AppShell.Main>
  <AppShell.Footer>
    <TabBar>...</TabBar>
  </AppShell.Footer>
</AppShell>
```

The root uses `100dvh` with a `100svh` floor. `Header` and `Footer` are placement regions rather than styled navigation components: they keep chrome outside the scroll container and apply the relevant safe-area inset. The usual composition is `NavigationBar` inside `Header` and `TabBar` inside `Footer`. Do not add another `SafeArea` for the same edge. AppShell does not modify `document.body`; the consumer decides where the application frame is mounted.

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

Behavior comes from Base UI Drawer. The wrapper supplies a bottom presentation, drag handle, safe-area padding, swipe/snap CSS variables, scroll containment, reduced-motion compatibility, and `Drawer.VirtualKeyboardProvider`. Keep fixed sheet headers and footers outside long scroll bodies where possible.

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

The three-column grid keeps the title centered even when leading and trailing controls differ in width. Place NavigationBar inside `AppShell.Header` when using the two together. For router links, place the consumer-supplied link inside `Leading` or `Trailing`.

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

## PWA base styles

`pwa-base` installs conservative tokens for safe areas, dynamic viewport height, keyboard height, navigation and tab bars, and touch targets. It does not overwrite shadcn color tokens or require a runtime provider. Import `styles/pwa.css` once from the application stylesheet or layout.
