# Contributing to PWA UI

PWA UI is a source-owned component registry. Contributions should preserve small, composable APIs and improve behavior across the mobile web rather than encode one product's theme.

## Before opening a change

1. Check whether the behavior belongs in PWA UI, Base UI, or the consuming application.
2. For an API change, include the user problem and the composition that becomes possible.
3. Keep component names semantic and concise. Avoid aliases unless they solve a demonstrated migration problem.
4. Do not claim device support without recording the device, OS, browser, display mode, and test date.

## Local setup

Use Node.js 22 or later and pnpm 10.

```bash
pnpm install
pnpm dev
```

Before requesting review, run:

```bash
pnpm check
pnpm test:e2e
```

Changes to registry source must be followed by `pnpm registry:build`. Commit the generated payloads so the public registry stays reviewable.

## Component expectations

- Preserve keyboard access, focus behavior, visible focus, browser zoom, and reduced-motion preferences.
- Use the shared PWA tokens rather than named-device detection or hard-coded notch values.
- Prefer controlled and uncontrolled composition patterns already used by the underlying primitive.
- Include usage documentation, manual source output, unit coverage for new contracts, and a browser test for important interaction changes.
- Record physical-device results in the device QA document when the change affects safe areas, software keyboards, gestures, installation, or standalone mode.

## Review and conduct

Keep changes focused and explain trade-offs. By participating, you agree to follow [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Security issues should follow [SECURITY.md](./SECURITY.md), not a public issue.
