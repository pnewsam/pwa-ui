# PWA UI

Source-owned React components for mobile-first PWAs and app-like web applications.

[Documentation](https://pwaui.com) · [Components](https://pwaui.com/components/app-shell) · [Issues](https://github.com/pnewsam/pwa-ui/issues) · [Releases](https://github.com/pnewsam/pwa-ui/releases)

PWA UI follows the shadcn distribution model: install the source into an application, then own and adapt it there. Base UI supplies accessible behavior where a mature primitive already exists; PWA UI adds safe areas, dynamic viewports, mobile navigation chrome, software-keyboard behavior, installation, updates, and offline feedback.

> **Status:** v0.1 public beta. The registry is ready for evaluation and early use. Physical iOS and Android verification remains in progress, and beta APIs may change before the first stable release.

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

Mount `PWAProvider` once near the application root. For a full-screen app shell, opt into document containment with `data-pwa-app-root` on `html` and `data-pwa-app-mount` on the element containing the shell. See the [app layout guide](https://pwaui.com/guides/app-layout) for the complete composition. Direct registry URLs such as `https://pwaui.com/r/app-shell.json` remain supported.

Because this repository is also a shadcn source registry, you can install directly from GitHub. Pin the release tag when you need reproducible source:

```bash
pnpm dlx shadcn@latest add pnewsam/pwa-ui/app-shell#v0.1.0-beta.1
```

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
