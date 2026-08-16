# Releasing PWA UI

This project is prepared for a beta release but has no automatic public-release trigger. Deployment, source publication, tagging, directory submission, search-console registration, and announcements are separate decisions.

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

## Formal release — intentionally deferred

When authorized, create the public source repository, enable branch protection and private vulnerability reporting, choose the canonical organization and repository URL, tag `v0.1.0-beta.1`, publish release notes from `CHANGELOG.md`, register search ownership, submit the registry directory entry, and announce the beta. None of these steps should happen implicitly during a documentation deployment.
