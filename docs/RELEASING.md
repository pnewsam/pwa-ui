# Releasing PWA UI

PWA UI uses an intentionally gated release flow. Deployment, tagging, directory submission, search-console registration, and announcements remain separate decisions.

## Beta readiness gate

- `pnpm check` passes from a clean install.
- `pnpm test:e2e` passes in Chromium and WebKit, including axe scans.
- `pnpm test:install` installs the namespace into a clean shadcn fixture.
- `pnpm --filter @pwa-ui/docs build:sites` produces the Cloudflare worker bundle.
- A production deploy is followed by `pnpm smoke:public` and `pnpm test:install` against `https://pwaui.com`.
- Physical iOS and Android results are recorded in `docs/DEVICE_QA.md`.
- The changelog and documentation release status match the intended tag.

## Manual production deployment

The GitHub deployment workflow is intentionally `workflow_dispatch` only. Configure a protected `production` environment with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then run the workflow after CI passes.

To deploy from a trusted local environment:

```bash
pnpm check
pnpm test:e2e
pnpm --filter @pwa-ui/docs build:sites
pnpm --filter @pwa-ui/docs exec wrangler deploy
pnpm smoke:public
pnpm test:install
```

Cloudflare retains prior worker versions for rollback. If public verification fails, restore the last known-good deployment before diagnosing the release candidate.

## Documentation service-worker updates

The docs app registers `/sw.js` only in production. For any deployment that should notify already installed copies, bump the readable version stamp and `WORKER_VERSION` in `apps/docs/public/sw.js`; changing that file lets the browser install a waiting worker. The worker deliberately does not call `skipWaiting()` during install, so the demo's `UpdatePrompt` can protect in-progress work. Its Update now action sends `SKIP_WAITING` and reloads after the new worker takes control.

After deployment, keep an older installed copy open, foreground it or reload once, and verify that the prompt appears exactly once. Check Later first, then Update now, and confirm a single controlled reload. Never add `/r/*` registry payloads to a worker cache. For an emergency worker rollback, publish the documented unregistering replacement before restoring normal registration behavior in a later release.

## Formal release

After validation and production verification, create an annotated version tag and a matching GitHub release using the notes in `CHANGELOG.md`. Validate the tagged GitHub registry source as well as the hosted namespace. Directory submission, search ownership, and announcements do not happen implicitly during a documentation deployment.
