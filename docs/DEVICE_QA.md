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

## Accessibility and motion

- Tab and Shift+Tab remain inside open overlays.
- Titles and descriptions are announced for every overlay.
- Important controls have a visible focus ring and at least a 44px touch target.
- VoiceOver/TalkBack can identify the active tab and all icon-only controls.
- Reduce Motion removes nonessential transitions without hiding state changes.
