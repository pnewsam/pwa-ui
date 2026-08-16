# PWA UI MVP

> Historical planning document. The current beta surface also includes `PWAProvider` and lifecycle feedback components; see the documentation and changelog for the active public surface.

## Thesis

Build a registry-first React UI layer that makes mobile web applications feel like installed applications without replacing shadcn/ui, Base UI, or the browser platform.

## Hard constraints

- Consumers own the installed source.
- Use Base UI for accessible overlay and gesture behavior.
- Start from phone-native interaction patterns, then adapt them to desktop.
- Prefer CSS environment variables, dynamic viewport units, Visual Viewport, media queries, and Pointer Events over device detection.
- Keep dependencies explicit and copied source readable.
- Do not add a required runtime package.

## Delivery sequence

1. **Phase 0 — scaffold:** workspace, installable docs PWA, Tailwind, Base UI, source registry, proof item, validation, CI, and clean-project install test.
2. **Phase 1 — platform:** PWA CSS, SafeArea, display-mode and viewport hooks, media query hook, and KeyboardAvoidingView.
3. **Phase 2 — app frame:** AppShell, NavigationBar, TabBar, and settings demo.
4. **Phase 3 — overlays:** BottomSheet, ResponsiveDialog, and ActionSheet on Base UI.
5. **Phase 4 — hardening:** automated browser tests, device QA, accessibility, documentation, and fresh-project verification.

## MVP public surface

`AppShell`, `SafeArea`, `BottomSheet`, `ResponsiveDialog`, `ActionSheet`, `NavigationBar`, `TabBar`, and `KeyboardAvoidingView`.

Phase 0 must prove registry installation before the eight MVP primitives are implemented.
