# PWA UI Charter

> Distilled 2026-08-19 from the project's existing statements of intent — [MVP.md](../MVP.md), [README.md](../README.md), and the pwaui.com positioning — so that planning documents have one stable reference. Review and amend rather than treating as new direction.

## Value proposition

Build mobile web apps that feel installed. PWA UI is a registry-first React UI layer that makes mobile web applications feel like installed applications without replacing shadcn/ui, Base UI, the consumer's router, or the browser platform.

## Who it serves

React developers shipping app-like web products — line-of-business tools, internal apps, commerce, dashboards — who already work in the shadcn/Base UI/Tailwind ecosystem and care about mobile polish but do not want to adopt a framework such as Ionic or Konsta.

## Guiding principles

1. **Consumers own the installed source.** Distribution is a shadcn-compatible registry; there is no required runtime package.
2. **Behavior comes from mature primitives.** Base UI supplies accessible overlay and gesture behavior where a mature primitive exists; PWA UI adds what the mobile platform requires on top.
3. **Phone-first, then desktop.** Components start from phone-native interaction patterns and adapt outward.
4. **Platform features over device detection.** Prefer CSS environment variables, dynamic viewport units, Visual Viewport, media queries, and Pointer Events. User-agent checks are permitted only where the platform offers no capability signal (documented per use).
5. **Honest about the platform ceiling.** Documentation states real limitations (iOS install path, `navigator.onLine` semantics) instead of papering over them.
6. **Copied source stays readable.** Explicit dependencies, small files, no clever indirection a consumer cannot maintain.

## Success signals (leading indicators, provisional)

- The pwaui.com docs app, used on a real phone, demonstrably feels installed — it is the primary proof of the library.
- Registry installs and GitHub adoption signals grow after each release.
- The [DEVICE_QA.md](DEVICE_QA.md) matrix carries published evidence for every required surface before a stable release.
- At least one production application ships on the library.

## Non-goals

- Owning routing, data fetching, or application state.
- Registering or generating service workers (hooks observe an existing registration).
- Replacing shadcn/ui color tokens or theming.
- Native wrappers (Capacitor/Cordova) or app-store distribution.
- Desktop-first components that already exist in shadcn/ui or Base UI.
- Experiences the PWA platform cannot honestly support (games, heavy media pipelines, deep OS integration).
