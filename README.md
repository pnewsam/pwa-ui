# PWA UI

Source-owned React components for mobile-first PWAs and app-like web applications.

PWA UI follows the shadcn distribution model: components are installed into an application, then owned and edited by that application. Base UI supplies accessible behavior where a mature primitive already exists; PWA UI adds the mobile composition, safe-area handling, viewport behavior, and touch-first ergonomics.

## Phase 0

This scaffold proves the registry-first workflow before the mobile primitives are added. It includes:

- a Next.js documentation app that can be installed as a PWA;
- Tailwind CSS and shadcn-compatible tokens;
- Base UI as an explicit dependency;
- a composable source registry with a `pwa-base` setup item;
- a dependency-free `pwa-ready` proof component;
- registry validation, lint, typecheck, build, and CI commands.

## Develop

Node.js 20 or later and pnpm are required.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Validate

```bash
pnpm check
```

## Test the registry locally

Build and serve the docs app:

```bash
pnpm registry:build
pnpm dev
```

In a fresh shadcn-enabled project, install the proof component from the local registry:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/pwa-ready.json
```

Install the shared PWA tokens and Base UI dependency separately:

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/pwa-base.json
```

After the repository is public, the same source registry can be consumed directly as `owner/repository/pwa-ready`.

## Architecture

Registry source is canonical. The docs app imports the same source shown to consumers, while `shadcn build` produces installable payloads in `apps/docs/public/r`.

See [MVP.md](./MVP.md) for scope and sequencing.
