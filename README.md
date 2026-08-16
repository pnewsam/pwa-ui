# PWA UI

Source-owned React components for mobile-first PWAs and app-like web applications.

PWA UI follows the shadcn distribution model: install the source into an application, then own and adapt it there. Base UI supplies accessible behavior where a mature primitive already exists; PWA UI adds safe areas, dynamic viewports, mobile navigation chrome, software-keyboard behavior, installation, updates, and offline feedback.

> **Status:** v0.1 beta candidate. The registry is ready for evaluation, but physical iOS and Android verification and a formal public release are still pending.

## Install

Add the namespace to `components.json`:

```json
{
  "registries": {
    "@pwa-ui": "https://pwaui.com/r/{name}.json"
  }
}
```

Install the shared provider and only the components you need:

```bash
pnpm dlx shadcn@latest add @pwa-ui/pwa-provider @pwa-ui/app-shell @pwa-ui/tab-bar
```

Import the generated base stylesheet once from your global application entry:

```tsx
import "@/styles/pwa.css"
```

Mount `PWAProvider` once near the application root. Direct registry URLs such as `https://pwaui.com/r/app-shell.json` remain supported.

## Components

- `PWAProvider` — shared viewport and keyboard layout variables.
- `AppShell` — application chrome around independently scrolling content.
- `SafeArea` — explicit CSS environment-variable inset handling.
- `BottomSheet` — swipeable, keyboard-aware Base UI Drawer composition.
- `ResponsiveDialog` — Dialog on wide screens and BottomSheet on narrow screens.
- `ActionSheet` — grouped touch actions with destructive and cancel treatments.
- `NavigationBar` — router-composable top application chrome.
- `TabBar` — router-composable bottom navigation with labels and badges.
- `KeyboardAvoidingView` — Visual Viewport-aware form and composer layout.
- `InstallPrompt`, `UpdatePrompt`, and `OfflineBanner` — PWA lifecycle feedback.

Supporting hooks cover display mode, Visual Viewport state, media queries, install availability, service-worker updates, network status, and page visibility.

## Develop

Node.js 22 or later and pnpm 10 are required.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` for the documentation, live examples, usage snippets, and copy-pasteable component source.

## Validate

```bash
pnpm check
pnpm test:e2e
```

Build and test the local registry with:

```bash
pnpm registry:build
pnpm dev
pnpm dlx shadcn@latest add http://localhost:3000/r/app-shell.json
```

Registry source in `registry/` is canonical. The documentation app imports that same source, while `shadcn build` produces the public payloads in `apps/docs/public/r`.

See [CONTRIBUTING.md](./CONTRIBUTING.md), [SECURITY.md](./SECURITY.md), [docs/COMPONENTS.md](./docs/COMPONENTS.md), and [docs/DEVICE_QA.md](./docs/DEVICE_QA.md).

## License

MIT
