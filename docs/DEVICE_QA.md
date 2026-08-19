# Device QA

Run this checklist against a production build. Record the device, OS/browser version, display mode, date, tester, and any linked issue.

## Verification record

| Status | Device | OS and browser | Display mode | Date | Tester | Notes or issue |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | iPhone with Face ID | Safari | Browser | — | — | Required before stable |
| Pending | iPhone with Face ID | Safari | Home Screen | — | — | Required before stable |
| Pending | Current Android device or emulator | Chrome | Browser | — | — | Required before stable |
| Pending | Current Android device or emulator | Chrome | Installed | — | — | Required before stable |
| Pending | Desktop | Chrome, Safari, Firefox | Browser | — | — | Narrow and wide viewports |
| Pending | iPhone or iPad | Safari | Browser | — | — | InstallPrompt manual mode: Share → Add to Home Screen path (#24) |

## Required surfaces

- Recent Face ID iPhone in Safari.
- The same iPhone with the docs app installed to the Home Screen.
- Android Chrome on a current device or emulator.
- The same Android surface with the docs PWA installed.
- Desktop Chrome, Safari, and Firefox at a narrow viewport.

## App frame and safe areas

- The top navigation clears the status/notch region in portrait and landscape.
- The bottom tab bar clears the home indicator and remains reachable.
- Content scrolls between fixed application chrome without scrolling the document unexpectedly.
- Browser-mode and standalone-mode height both recover after rotation.
- No component assumes a named device or hard-coded phone dimension.

## Overlays

- BottomSheet opens from touch and keyboard activation.
- The backdrop dismisses once, Escape dismisses once, and focus returns to the trigger.
- Slow and fast downward swipes feel controlled and do not scroll the page behind the sheet.
- Long sheet content scrolls without starting a dismissal gesture unexpectedly.
- Snap points settle correctly and nested sheets preserve the parent layer.
- ResponsiveDialog is a sheet on narrow screens and a centered dialog on wide screens.
- Resizing an open ResponsiveDialog preserves its open state and leaves only one focus trap.
- ActionSheet groups are clear, destructive actions are distinguishable, and Cancel is easy to reach.

## Pull to refresh

- At the top of the list, a downward touch pull moves the content with increasing resistance and changes the indicator from Pull to Release.
- Releasing beyond the threshold starts exactly one refresh, holds the indicator until the refresh settles, and retracts cleanly.
- Releasing before the threshold does not refresh and returns the content to its resting position.
- When the list is scrolled away from the top, vertical scrolling remains native: no content transform, blocked scroll, or accidental refresh occurs.
- Horizontal intent, an interrupted pointer, and a second pointer do not trigger a refresh.
- In browser mode, application and browser pull-to-refresh do not both activate; in standalone mode, the custom gesture still works.
- Repeat the top-edge and scrolled-list cases on iOS Safari, iOS Home Screen, Android Chrome, and installed Android.
- With Reduce Motion enabled, the state remains understandable without spinner rotation or nonessential movement.

## Stacked navigation

- Push a detail view and confirm it enters from the trailing edge beneath persistent AppShell header/footer chrome without flashing or exposing the covered view.
- Pop with NavigationBar.BackButton and confirm the outgoing view moves toward the trailing edge while the prior view is revealed.
- Type in a list field and scroll the list before pushing; both value and exact scroll position survive the round trip.
- Covered controls are unreachable by keyboard and VoiceOver/TalkBack; focus moves into the new view and returns to the initiating control on pop.
- Repeat with Reduce Motion enabled: the view changes without sliding and focus/state behavior remains identical.
- Rotate during or immediately after push/pop; the active view fills the recovered viewport and no stale transition layer remains.
- Verify both the native View Transitions path on a current browser and the CSS fallback on an older or disabled engine.
- In iOS Safari browser mode, confirm `backGesture="auto"` remains disabled and the browser's own history swipe behaves normally without double navigation.
- Install the same app to the iOS Home Screen, push a detail, and confirm a left-edge drag follows the finger 1:1, reveals the prior view with parallax and dimming, then commits past half width or springs back below it.
- On installed Android with both gesture and three-button navigation configurations, confirm the custom edge swipe does not compete with the OS and the system Back path is handled separately by the host router.
- Begin vertically inside the edge zone and horizontally outside it; list scrolling and horizontal scrollers remain native and no stack gesture state is entered.
- Interrupt an active drag with an OS gesture, app backgrounding, rotation, or `pointercancel`; the detail returns to a stable position and the next attempt still works.
- Repeat the edge swipe with Reduce Motion enabled; it still pops without sliding follow-through, duplicate transitions, or focus loss.

## Software keyboard

- Focus every field in the mobile form and BottomSheet form.
- The focused input remains visible when the keyboard opens.
- A pinned action/footer clears the keyboard and bottom safe area.
- Closing the keyboard restores the layout without a jump or permanent blank space.
- Repeat with rotation while a field is focused.

## Installation, updates, and lifecycle

- The install prompt appears only when the browser reports availability and after a user action.
- On iOS, where no programmatic prompt exists, manual mode shows the Share → Add to Home Screen steps and they match the current Safari flow.
- Accepting, dismissing, and completing installation each leave the interface in the correct state.
- A waiting service worker displays one update prompt and never reloads without an explicit choice.
- Applying an update activates the waiting worker; deferring it keeps the current session usable.
- Offline feedback appears and clears as connectivity changes without blocking application content.
- Backgrounding and restoring the app do not duplicate listeners, prompts, or network work.
- Unsupported browsers and unregistered service workers fail quietly with an accurate state.

## Installable showcase

- Open `/demo` in iOS Safari, use the manual install card, add PWA UI to the Home Screen, and confirm launch opens directly into the demo without browser chrome.
- Open `/demo` in Android Chrome, use the native Install action when offered, launch the installed app, and confirm its standalone display mode and icon treatment.
- In each installed mode, pull to refresh, push and edge-swipe back from a project, switch away from a scrolled Activity tab and return, focus the New note field in its sheet, and verify the offline banner during an actual connectivity change.
- Confirm each “what you’re feeling” caption opens the matching component or hook documentation and the Docs action returns to a normally scrolling documentation page.
- On a desktop browser, confirm the demo remains centered in a phone-width frame while every control stays keyboard reachable.
- Deploy a worker version bump while an installed copy remains open, foreground or reload the old copy, and confirm one UpdatePrompt appears; choosing Later preserves the session and choosing Update now activates and reloads once.
- Inspect application storage after browsing registry pages and confirm the docs worker has not created a cache containing `/r/*` responses.

## Accessibility and motion

- Tab and Shift+Tab remain inside open overlays.
- Titles and descriptions are announced for every overlay.
- Important controls have a visible focus ring and at least a 44px touch target.
- VoiceOver/TalkBack can identify the active tab and all icon-only controls.
- Reduce Motion removes nonessential transitions without hiding state changes.

## Haptics

- On Android Chrome, each demo preset requests one distinct, brief pattern only after its button is pressed.
- Browser, device, low-power, and vibration settings that suppress feedback leave the interface fully understandable and operable.
- On iOS/iPadOS Safari and unsupported desktop browsers, the demo says vibration is unavailable, disables its preset controls, and produces no error.
- Tab and ActionSheet integrations use haptics only as reinforcement; the active, success, warning, or error state remains visible without it.
