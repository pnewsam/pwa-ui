# Device QA

Run this checklist against a production build. Record the device, OS/browser version, display mode, date, tester, and any linked issue.

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

## Accessibility and motion

- Tab and Shift+Tab remain inside open overlays.
- Titles and descriptions are announced for every overlay.
- Important controls have a visible focus ring and at least a 44px touch target.
- VoiceOver/TalkBack can identify the active tab and all icon-only controls.
- Reduce Motion removes nonessential transitions without hiding state changes.
