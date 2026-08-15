# PWA UI

Source-owned React components for mobile-first PWAs and app-like web applications.

PWA UI follows the shadcn distribution model: components are installed into an application, then owned and edited by that application. Base UI supplies accessible behavior where a mature primitive already exists; PWA UI adds the mobile composition, safe-area handling, viewport behavior, and touch-first ergonomics.

## Components

The MVP registry contains:

- `AppShell` — fixed application chrome around independently scrolling content;
- `SafeArea` — explicit CSS environment-variable inset handling;
- `BottomSheet` — swipeable, keyboard-aware Base UI Drawer composition;
- `ResponsiveDialog` — centered Dialog on wide screens and BottomSheet on narrow screens;
- `ActionSheet` — grouped touch actions with destructive and cancel treatments;
- `NavigationBar` — safe-area-aware top application chrome;
- `TabBar` — router-agnostic bottom navigation with labels and badges;
- `KeyboardAvoidingView` — Visual Viewport-aware form and composer layout.

Supporting registry hooks expose display mode, Visual Viewport state, and media queries. The installable documentation app includes settings, mobile-form, and content-feed demos using the canonical registry source.

## Develop

Node.js 20 or later and pnpm are required.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` to browse the documentation, live component examples, and code samples.

## Validate

```bash
pnpm check
pnpm test:e2e
```

## Test the registry locally

Build and serve the docs app:

```bash
pnpm registry:build
pnpm dev
```

In a fresh shadcn-enabled project, install any component from the local registry:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/app-shell.json
pnpm dlx shadcn@latest add http://localhost:3000/r/bottom-sheet.json
pnpm dlx shadcn@latest add http://localhost:3000/r/tab-bar.json
```

Install the shared PWA tokens and Base UI dependency separately:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/pwa-base.json
```

After the repository is public, the same source registry can be consumed directly as `owner/repository/bottom-sheet`.

## Architecture

Registry source is canonical. The docs app imports the same source shown to consumers, while `shadcn build` produces installable payloads in `apps/docs/public/r`.

See [MVP.md](./MVP.md) for product scope, [docs/COMPONENTS.md](./docs/COMPONENTS.md) for API and behavior notes, and [docs/DEVICE_QA.md](./docs/DEVICE_QA.md) for real-device validation.
